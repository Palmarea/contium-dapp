<script>
  import { onMount } from 'svelte';

  // Props
  export let documentHash = '';
  export let isRegistered = false;
  export let isValidated = false;
  export let hasBadge = false;

  // Estado
  let status = 'idle'; // idle | checking | minting | success | error
  let errorMessage = '';
  let errorType = '';
  let txHash = '';
  let tokenId = '';
  let showConfetti = false;

  // Configuración
  const EXPLORER_URL = 'https://explorer-pob.dev11.top';

  /**
   * Errores específicos con mensajes claros
   */
  const ERROR_MESSAGES = {
    NOT_REGISTERED: {
      icon: '❌',
      title: 'Documento no registrado',
      message: 'Primero debes registrar el documento en blockchain.',
      action: 'Ir a Registrar',
      actionType: 'register'
    },
    NOT_VALIDATED: {
      icon: '❌',
      title: 'Documento no validado',
      message: 'Primero debes validar el documento.',
      action: 'Ir a Validar',
      actionType: 'validate'
    },
    BADGE_EXISTS: {
      icon: 'ℹ️',
      title: 'Badge ya existe',
      message: 'Ya tienes un Badge para este documento.',
      action: 'Ver Badge',
      actionType: 'view'
    },
    USER_REJECTED: {
      icon: '⚠️',
      title: 'Transacción cancelada',
      message: 'Cancelaste la transacción en MetaMask.',
      action: 'Reintentar',
      actionType: 'retry'
    },
    INSUFFICIENT_FUNDS: {
      icon: '💰',
      title: 'Fondos insuficientes',
      message: 'No tienes suficiente TSYS para pagar el gas.',
      action: 'Obtener TSYS',
      actionType: 'faucet'
    },
    NETWORK_ERROR: {
      icon: '🌐',
      title: 'Error de conexión',
      message: 'No se pudo conectar a la red. Verifica tu internet.',
      action: 'Reintentar',
      actionType: 'retry'
    },
    CONTRACT_ERROR: {
      icon: '❓',
      title: 'Error del contrato',
      message: 'Ocurrió un error inesperado. Contacta al equipo.',
      action: 'Cerrar',
      actionType: 'close'
    }
  };

  /**
   * Verifica prerrequisitos antes de mintear
   */
  function checkPrerequisites() {
    if (!documentHash) {
      setError('NOT_REGISTERED');
      return false;
    }
    if (!isRegistered) {
      setError('NOT_REGISTERED');
      return false;
    }
    if (!isValidated) {
      setError('NOT_VALIDATED');
      return false;
    }
    if (hasBadge) {
      setError('BADGE_EXISTS');
      return false;
    }
    return true;
  }

  /**
   * Establece el error con tipo específico
   */
  function setError(type) {
    const error = ERROR_MESSAGES[type];
    status = 'error';
    errorType = type;
    errorMessage = error.message;
  }

  /**
   * Detecta tipo de error desde excepción
   */
  function detectErrorType(error) {
    const message = error?.message?.toLowerCase() || '';
    const code = error?.code;

    // Usuario rechazó en MetaMask
    if (code === 4001 || code === 'ACTION_REJECTED' || message.includes('user rejected')) {
      return 'USER_REJECTED';
    }

    // Sin fondos para gas
    if (message.includes('insufficient funds') || message.includes('gas required exceeds')) {
      return 'INSUFFICIENT_FUNDS';
    }

    // Error de red
    if (message.includes('network') || message.includes('timeout') || message.includes('failed to fetch')) {
      return 'NETWORK_ERROR';
    }

    // Error de contrato (revert)
    if (message.includes('revert') || message.includes('execution reverted')) {
      // Intentar detectar el motivo específico
      if (message.includes('no existe') || message.includes('not registered')) {
        return 'NOT_REGISTERED';
      }
      if (message.includes('no validado') || message.includes('not validated')) {
        return 'NOT_VALIDATED';
      }
      if (message.includes('ya existe') || message.includes('already exists')) {
        return 'BADGE_EXISTS';
      }
    }

    return 'CONTRACT_ERROR';
  }

  /**
   * Genera metadatos del NFT
   */
  function generateMetadata() {
    const metadata = {
      name: `Contium Compliance Badge #${Date.now()}`,
      description: 'Documento verificado en blockchain zkSYS',
      image: 'https://via.placeholder.com/400x400.png?text=CONTIUM+BADGE',
      attributes: [
        { trait_type: 'Grade', value: 'A' },
        { trait_type: 'Document Hash', value: documentHash },
        { trait_type: 'Verified Date', value: new Date().toISOString() },
        { trait_type: 'Network', value: 'zkSYS PoB DevNet' }
      ]
    };

    // Convertir a base64 data URI
    const tokenURI = 'data:application/json;base64,' + btoa(JSON.stringify(metadata));
    return tokenURI;
  }

  /**
   * Función principal de mint
   */
  async function mintBadge() {
    console.log('🚀 mintBadge clicked!'); // ← AGREGA ESTA LÍNEA
    console.log('isRegistered:', isRegistered);
    console.log('isValidated:', isValidated);
    console.log('hasBadge:', hasBadge);
    
    // Resetear estado
    errorMessage = '';
    errorType = '';

    // Verificar prerrequisitos
    if (!checkPrerequisites()) {
      return;
    }

    try {
      status = 'checking';

      // Verificar que MetaMask esté conectado
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      status = 'minting';

      // Importar ethers dinámicamente
      const { ethers } = await import('ethers');

      // Conectar a MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // TODO: Reemplazar con la dirección real del contrato después del deploy
      const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
      
      // ABI mínimo para mintBadge
      const ABI = [
        'function mintBadge(bytes32 documentHash, string tokenURI) returns (uint256)',
        'event BadgeMinted(uint256 indexed tokenId, address indexed owner, bytes32 indexed documentHash)'
      ];

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Generar metadatos
      const tokenURI = generateMetadata();

      // Convertir hash a bytes32 si es necesario
      const hashBytes32 = documentHash.startsWith('0x') 
        ? documentHash 
        : '0x' + documentHash;

      // Enviar transacción
      const tx = await contract.mintBadge(hashBytes32, tokenURI);

      // Esperar confirmación
      const receipt = await tx.wait();

      // Obtener tokenId del evento
      const event = receipt.logs.find(log => log.fragment?.name === 'BadgeMinted');
      tokenId = event ? event.args[0].toString() : 'N/A';
      txHash = receipt.hash;

      // Éxito
      status = 'success';
      showConfetti = true;

      // Disparar evento para que el padre actualice
      dispatchEvent(new CustomEvent('minted', {
        detail: { tokenId, txHash },
        bubbles: true
      }));

      // Quitar confetti después de 3 segundos
      setTimeout(() => {
        showConfetti = false;
      }, 3000);

    } catch (error) {
      console.error('Error minting badge:', error);
      const type = detectErrorType(error);
      setError(type);
    }
  }

  /**
   * Manejar acción del botón de error
   */
  function handleErrorAction() {
    const error = ERROR_MESSAGES[errorType];
    
    switch (error?.actionType) {
      case 'register':
        dispatchEvent(new CustomEvent('navigate', { detail: 'register', bubbles: true }));
        break;
      case 'validate':
        dispatchEvent(new CustomEvent('navigate', { detail: 'validate', bubbles: true }));
        break;
      case 'view':
        window.open(`${EXPLORER_URL}/token/${tokenId}`, '_blank');
        break;
      case 'faucet':
        window.open('https://faucet.syscoin.org/', '_blank');
        break;
      case 'retry':
        status = 'idle';
        errorMessage = '';
        errorType = '';
        break;
      case 'close':
        status = 'idle';
        errorMessage = '';
        errorType = '';
        break;
    }
  }

  /**
   * Obtener texto del botón según estado
   */
  function getButtonText() {
    if (!isRegistered) return '⚠️ Primero registra el documento';
    if (!isValidated) return '⚠️ Primero valida el documento';
    if (hasBadge) return '✅ Badge ya creado';
    
    switch (status) {
      case 'checking': return '🔍 Verificando...';
      case 'minting': return '⏳ Minteando Badge...';
      case 'success': return '🎉 ¡Badge Creado!';
      default: return '🏆 Mint Badge NFT';
    }
  }

  /**
   * Verificar si el botón debe estar deshabilitado
   */
  function isDisabled() {
    return !isRegistered || !isValidated || hasBadge || status === 'checking' || status === 'minting';
  }
</script>

<!-- CONFETTI -->
{#if showConfetti}
  <div class="confetti-container">
    {#each Array(50) as _, i}
      <div 
        class="confetti" 
        style="
          left: {Math.random() * 100}%;
          animation-delay: {Math.random() * 0.5}s;
          background-color: hsl({Math.random() * 360}, 70%, 60%);
        "
      ></div>
    {/each}
  </div>
{/if}

<!-- MAIN BUTTON -->
<div class="mint-container">
  <button 
    class="mint-button" 
    class:disabled={isDisabled()}
    class:success={status === 'success'}
    class:loading={status === 'checking' || status === 'minting'}
    on:click={mintBadge}
    disabled={isDisabled()}
  >
    {getButtonText()}
  </button>

  <!-- SUCCESS INFO -->
  {#if status === 'success' && txHash}
    <div class="success-info">
      <p>🎉 ¡Felicidades! Tu Badge NFT ha sido creado.</p>
      <div class="links">
        <a href="{EXPLORER_URL}/tx/{txHash}" target="_blank" class="link">
          📜 Ver Transacción
        </a>
        {#if tokenId && tokenId !== 'N/A'}
          <a href="{EXPLORER_URL}/token/{tokenId}" target="_blank" class="link">
            🏆 Ver Badge NFT
          </a>
        {/if}
      </div>
    </div>
  {/if}

  <!-- ERROR MESSAGE -->
  {#if status === 'error' && errorType}
    <div class="error-container">
      <div class="error-icon">{ERROR_MESSAGES[errorType]?.icon}</div>
      <div class="error-content">
        <h4>{ERROR_MESSAGES[errorType]?.title}</h4>
        <p>{ERROR_MESSAGES[errorType]?.message}</p>
      </div>
      <button class="error-action" on:click={handleErrorAction}>
        {ERROR_MESSAGES[errorType]?.action}
      </button>
    </div>
  {/if}
</div>

<style>
  .mint-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .mint-button {
    width: 100%;
    padding: 16px 32px;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(245, 175, 25, 0.4);
  }

  .mint-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 175, 25, 0.5);
  }

  .mint-button.disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  .mint-button.loading {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    animation: pulse 1.5s infinite;
  }

  .mint-button.success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Success Info */
  .success-info {
    background: #e8f5e9;
    border: 1px solid #4caf50;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }

  .success-info p {
    margin: 0 0 12px 0;
    color: #2e7d32;
    font-weight: 500;
  }

  .links {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .link {
    color: #1a73e8;
    text-decoration: none;
    font-size: 0.9rem;
    padding: 8px 16px;
    background: white;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .link:hover {
    background: #f0f0f0;
  }

  /* Error Container */
  .error-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fff3e0;
    border: 1px solid #ff9800;
    border-radius: 12px;
  }

  .error-icon {
    font-size: 2rem;
  }

  .error-content {
    flex: 1;
  }

  .error-content h4 {
    margin: 0 0 4px 0;
    color: #e65100;
    font-size: 1rem;
  }

  .error-content p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }

  .error-action {
    padding: 8px 16px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    white-space: nowrap;
  }

  .error-action:hover {
    background: #f57c00;
  }

  /* Confetti */
  .confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .confetti {
    position: absolute;
    top: -10px;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    animation: confetti-fall 3s ease-out forwards;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  /* Responsive */
  @media (max-width: 480px) {
    .error-container {
      flex-direction: column;
      text-align: center;
    }

    .links {
      flex-direction: column;
    }
  }
</style>