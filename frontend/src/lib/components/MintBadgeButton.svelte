<script>
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';
  import { DEPLOYMENTS } from '$lib/deployments';

  // Props (según FE-05)
  export let documentHash;
  export let isValidated;
  export let hasBadge;

  const dispatch = createEventDispatcher();

  // Explorer
  const EXPLORER = 'https://explorer-pob.dev11.top';

  // UI state
  let status = 'idle'; // 'idle' | 'loading' | 'success' | 'error'
  let errorMsg = '';
  let txHash = '';
  let tokenId = '';
  let explorerLink = '';

  // --- Helpers ---
  function normalizeBytes32(hex) {
    if (!hex) return '';
    // Acepta "0x..." o "..." (64 hex chars)
    return hex.startsWith('0x') ? hex : `0x${hex}`;
  }

  // btoa no soporta UTF-8 directo → convertimos a bytes.
  function base64EncodeUtf8(input) {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function buildTokenURI(docHash) {
    const ts = new Date().toISOString();

    const metadata = {
      name: 'Contium Compliance Badge',
      description: 'Badge de cumplimiento emitido para un documento validado en zkSYS PoB DevNet.',
      // Reemplaza por una imagen real cuando la tengas:
      image: 'https://via.placeholder.com/512x512.png?text=CONTIUM+BADGE',
      attributes: [
        { trait_type: 'documentHash', value: docHash },
        { trait_type: 'timestamp', value: ts },
        { trait_type: 'chainId', value: 57042 }
      ]
    };

    const json = JSON.stringify(metadata);
    const b64 = base64EncodeUtf8(json);
    return { tokenURI: `data:application/json;base64,${b64}`, metadata };
  }

  function isButtonDisabled() {
    if (!isValidated) return true;
    if (hasBadge) return true;
    return status === 'loading' || status === 'success';
  }

  function buttonLabel() {
    if (!isValidated) return 'Primero valida';
    if (hasBadge) return 'Badge ya creado';
    if (status === 'loading') return 'Creando Badge...';
    if (status === 'success') return '🎉 Badge Creado!';
    return 'Mint Badge NFT';
  }

  async function fireConfetti() {
    // liviana, estándar y sin peso excesivo: canvas-confetti (usa canvas)
    const mod = await import('canvas-confetti');
    const confetti = mod.default;
    confetti({
      particleCount: 130,
      spread: 70,
      origin: { y: 0.75 }
    });
  }

  async function onMintClick() {
    errorMsg = '';
    txHash = '';
    tokenId = '';
    explorerLink = '';
    status = 'idle';

    // 1) Validaciones FE-05
    if (!isValidated) return;
    if (hasBadge) return;

    if (!browser) {
      status = 'error';
      errorMsg = 'Este botón solo funciona en el navegador (no SSR).';
      return;
    }
    if (!window.ethereum) {
      status = 'error';
      errorMsg = 'No se detectó wallet (MetaMask).';
      return;
    }

    const contractAddress = DEPLOYMENTS?.ContiumBadge;
    if (!contractAddress) {
      status = 'error';
      errorMsg = 'Falta configurar DEPLOYMENTS.ContiumBadge (address del contrato).';
      return;
    }

    // 2) Generar metadatos + 3) tokenURI (tu contrato actual NO lo recibe)
    const docHash = normalizeBytes32(documentHash);
    const { tokenURI } = buildTokenURI(docHash);
    // tokenURI queda listo para uso offchain/UI (contrato actual no lo guarda).
    void tokenURI;

    try {
      status = 'loading';

      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const recipient = await signer.getAddress();

      // ABI REAL según contracts/contracts/ContiumBadge.sol:
      // function mintBadge(address recipient, bytes32 documentHash) public onlyOwner
      const ABI = [
        'function mintBadge(address recipient, bytes32 documentHash)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
      ];

      const badge = new ethers.Contract(contractAddress, ABI, signer);

      // 4) Llamar a mintBadge con firma real
      const tx = await badge.mintBadge(recipient, docHash);

      // 5) Esperar confirmación
      const receipt = await tx.wait();
      txHash = receipt?.hash ?? tx.hash;

      // 6) Extraer tokenId del evento Transfer (mint = from 0x0)
      try {
        for (const log of receipt.logs ?? []) {
          const parsed = badge.interface.parseLog(log);
          if (parsed?.name === 'Transfer') {
            const from = (parsed.args?.from ?? '').toString();
            if (from.toLowerCase() === ethers.ZeroAddress) {
              tokenId = parsed.args?.tokenId?.toString?.() ?? '';
              break;
            }
          }
        }
      } catch {
        // si no se puede, igual damos links a TX/contrato
      }

      // Links típicos estilo Blockscout:
      // TX: /tx/<hash>
      // Contrato: /address/<addr>
      // NFT: muchas veces /token/<addr>/instance/<id>
      explorerLink = tokenId
        ? `${EXPLORER}/token/${contractAddress}/instance/${tokenId}`
        : `${EXPLORER}/address/${contractAddress}`;

      status = 'success';
      await fireConfetti();

      dispatch('minted', {
        txHash,
        tokenId: tokenId || undefined,
        contractAddress
      });
    } catch (e) {
      const msg = (e?.shortMessage || e?.message || '').toString();
      const code = e?.code;

      // Mensajes claros
      if (code === 4001 || code === 'ACTION_REJECTED' || msg.toLowerCase().includes('user rejected')) {
        errorMsg = 'Cancelaste la transacción en tu wallet.';
      } else if (msg.toLowerCase().includes('onlyowner')) {
        errorMsg = 'Tu wallet NO es el owner del contrato (mintBadge es onlyOwner), por eso revierte.';
      } else {
        errorMsg = msg || 'La transacción falló por un error desconocido.';
      }

      // FE-05: volver a estado normal si falla
      status = 'idle';
    }
  }
</script>

<div class="wrapper">
  <button
    class="gold"
    type="button"
    on:click={onMintClick}
    disabled={isButtonDisabled()}
    aria-disabled={isButtonDisabled()}
    aria-busy={status === 'loading'}
  >
    {buttonLabel()}
  </button>

  {#if status === 'success'}
    <div class="success">
      <div class="line">🎉 Badge Creado!</div>
      <div class="links">
        {#if txHash}
          <a class="link" href={`${EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer">
            Ver TX
          </a>
        {/if}
        {#if explorerLink}
          <a class="link" href={explorerLink} target="_blank" rel="noreferrer">
            {tokenId ? `Ver NFT #${tokenId}` : 'Ver contrato'}
          </a>
        {/if}
      </div>
      {#if tokenId}
        <div class="hint">TokenId: <span class="mono">{tokenId}</span></div>
      {/if}
    </div>
  {/if}

  {#if errorMsg}
    <div class="error" role="alert">{errorMsg}</div>
  {/if}
</div>

<style>
  .wrapper {
    display: grid;
    gap: 12px;
    width: 100%;
  }

  /* Botón dorado/premium */
  .gold {
    width: 100%;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid rgba(255, 215, 128, 0.55);
    background: linear-gradient(135deg, #f7d36a 0%, #d6a433 35%, #f7d36a 70%, #b9851f 100%);
    color: #1a1200;
    font-weight: 800;
    letter-spacing: 0.2px;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(214, 164, 51, 0.25);
    transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
  }

  .gold:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(214, 164, 51, 0.32);
    filter: brightness(1.03);
  }

  .gold:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 10px 22px rgba(214, 164, 51, 0.25);
  }

  /* Accesibilidad */
  .gold:focus-visible {
    outline: 3px solid rgba(90, 150, 255, 0.9);
    outline-offset: 3px;
  }

  .gold:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    filter: grayscale(0.35);
  }

  .success {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(30, 180, 120, 0.35);
    background: rgba(30, 180, 120, 0.08);
  }
  .success .line {
    font-weight: 700;
    margin-bottom: 6px;
  }
  .links {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .link {
    font-weight: 600;
    text-decoration: none;
    padding: 6px 10px;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.7);
    color: #0b3a73;
  }
  .link:hover {
    background: rgba(255, 255, 255, 0.95);
  }
  .hint {
    margin-top: 8px;
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.7);
  }
  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }

  .error {
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(220, 60, 60, 0.3);
    background: rgba(220, 60, 60, 0.08);
    color: rgba(120, 0, 0, 0.95);
    font-weight: 600;
  }
</style>
