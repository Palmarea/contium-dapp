<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  import { NETWORK } from '$lib/config.js';

  const dispatch = createEventDispatcher();

  const ZKSYS_CONFIG = {
    chainId: NETWORK.chainIdHex,
    chainName: NETWORK.name,
    rpcUrls: [NETWORK.rpcUrl],
    nativeCurrency: NETWORK.currency,
    blockExplorerUrls: [NETWORK.explorer]
  };

  export let address = "";
  export let isConnected = false;
  let status = "disconnected";
  let showNetworkModal = false;

  // Detectar Pali O MetaMask (Pali primero)
  function getProvider() {
    if (typeof window === 'undefined') return null;
    // Pali EVM se inyecta en window.ethereum con wallet === 'pali-v2'
    if (window.ethereum) return window.ethereum;
    return null;
  }

  function getProviderName() {
    if (typeof window === 'undefined') return '';
    if (window.ethereum?.wallet === 'pali-v2') return 'Pali Wallet';
    if (window.ethereum) return 'Wallet';
    return '';
  }

  async function checkNetwork() {
    const provider = getProvider();
    if (!provider) return false;
    const chainId = await provider.request({ method: 'eth_chainId' });
    return chainId === ZKSYS_CONFIG.chainId;
  }

  async function switchOrAddNetwork() {
    const provider = getProvider();
    if (!provider) return false;
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [ZKSYS_CONFIG],
      });
      return true;
    } catch (err) {
      throw err;
    }
  }

  export async function connect() {
    const provider = getProvider();
    if (!provider) {
      return alert("No se detectó wallet. Instala Pali Wallet desde https://paliwallet.com");
    }

    status = "connecting";
    try {
      // Pedir cuentas primero (esto abre Pali UNA vez)
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      
      // Verificar red después
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId.toLowerCase() !== ZKSYS_CONFIG.chainId.toLowerCase()) {
        showNetworkModal = true;
        status = "wrong_network";
        return;
      }

      address = accounts[0];
      isConnected = true;
      status = "connected";
      dispatch('connected', { address });
    } catch (err) {
      status = "disconnected";
      console.error(err);
    }
  }

  async function handleAddNetwork() {
    try {
      await switchOrAddNetwork();
      showNetworkModal = false;
      
      // Verificar que ahora sí está en la red correcta
      const provider = getProvider();
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (chainId.toLowerCase() === ZKSYS_CONFIG.chainId.toLowerCase()) {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          address = accounts[0];
          isConnected = true;
          status = "connected";
          dispatch('connected', { address });
        }
      }
    } catch (err) {
      console.error("Error agregando red:", err);
    }
  }

  export function disconnect() {
    address = "";
    isConnected = false;
    status = "disconnected";
    localStorage.removeItem('walletConnected');
    dispatch('disconnected');
  }

  function truncate(str) {
    return str ? `${str.substring(0, 6)}...${str.substring(str.length - 4)}` : "";
  }

  onMount(async () => {
    if (browser) {
      const provider = getProvider();
      if (!provider) return;

      // Solo escuchar cambios, NO auto-reconectar
      provider.on?.('accountsChanged', (accounts) => {
        if (accounts.length === 0) disconnect();
        else { address = accounts[0]; }
      });
      provider.on?.('chainChanged', () => window.location.reload());
    }
  });
</script>

<!-- BOTÓN DE WALLET -->
<div class="wallet-container">
  {#if status === "disconnected"}
    <button class="btn-connect" on:click={connect}>
      🔗 Conectar {getProviderName() || 'Wallet'}
    </button>
  {:else if status === "connecting"}
    <button class="btn-status" disabled>Conectando...</button>
  {:else if status === "wrong_network"}
    <button class="btn-wrong" on:click={() => (showNetworkModal = true)}>
      ⚠️ Red incorrecta
    </button>
  {:else}
    <div class="connected-box">
      <span class="addr">{truncate(address)}</span>
      <button class="btn-disconnect" on:click={disconnect}>✖</button>
    </div>
  {/if}
</div>

<!-- MODAL DE RED (CONT-02) -->
{#if showNetworkModal}
  <div class="modal-overlay" on:click={() => (showNetworkModal = false)}>
    <div class="modal" on:click|stopPropagation>
      <h2>🔗 Agregar Red zkSYS</h2>
      <p>Para usar Contium necesitas conectarte a la red zkSYS PoB DevNet.</p>
      
      <div class="network-info">
        <p><strong>Red:</strong> {NETWORK.name}</p>
        <p><strong>Chain ID:</strong> {NETWORK.chainId}</p>
        <p><strong>Token:</strong> {NETWORK.currency.symbol}</p>
      </div>

      <div class="buttons">
        <button class="btn-secondary" on:click={() => (showNetworkModal = false)}>
          Cancelar
        </button>
        <button class="btn-primary" on:click={handleAddNetwork}>
          ✅ Sí, agregar red
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .btn-connect {
    background: #6c5ce7; color: white; border: none;
    padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;
  }
  .btn-connect:hover { background: #5a4bd1; }
  .btn-wrong {
    background: #fbbc05; color: #000; border: none;
    padding: 10px 20px; border-radius: 6px; cursor: pointer;
  }
  .btn-status {
    background: #334155; color: #94a3b8; border: none;
    padding: 10px 20px; border-radius: 6px;
  }
  .connected-box {
    display: flex; align-items: center; gap: 10px;
    background: rgba(108, 92, 231, 0.15); padding: 5px 15px;
    border-radius: 20px; border: 1px solid #6c5ce7;
  }
  .addr { font-family: monospace; color: #6c5ce7; font-weight: bold; }
  .btn-disconnect {
    background: none; border: none; color: #666; cursor: pointer; font-size: 1.2rem;
  }
  .btn-disconnect:hover { color: #d93025; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
  }
  .modal {
    background: #1e293b; color: white; border-radius: 16px;
    padding: 2rem; max-width: 420px; width: 90%; border: 1px solid #334155;
  }
  .modal h2 { margin-top: 0; }
  .network-info {
    background: rgba(255,255,255,0.05); border-radius: 8px;
    padding: 1rem; margin: 1rem 0;
  }
  .network-info p { margin: 0.3rem 0; }
  .buttons { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
  .btn-primary {
    background: #6c5ce7; color: white; border: none;
    padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;
  }
  .btn-primary:hover { background: #5a4bd1; }
  .btn-secondary {
    background: transparent; color: #aaa; border: 1px solid #334155;
    padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;
  }
</style>