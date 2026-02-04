<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  import { ethers } from 'ethers';

  const dispatch = createEventDispatcher();

  // Configuración de la Red zkSYS
  const ZKSYS_CONFIG = {
    chainId: '0xDEB2', // 57042
    chainName: 'zkSYS PoB DevNet',
    rpcUrls: ['https://rpc-pob.dev11.top'],
    nativeCurrency: { name: 'TSYS', symbol: 'TSYS', decimals: 18 },
    blockExplorerUrls: ['https://explorer-pob.dev11.top']
  };

  // Estados
  export let address = "";
  export let isConnected = false;
  let status = "disconnected"; // disconnected, connecting, wrong_network, connected

  async function checkNetwork() {
    if (!window.ethereum) return false;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== ZKSYS_CONFIG.chainId) {
      status = "wrong_network";
      return false;
    }
    return true;
  }

  async function switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ZKSYS_CONFIG.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ZKSYS_CONFIG],
          });
        } catch (addError) {
          console.error("Error agregando red", addError);
        }
      }
    }
  }

  export async function connect() {
    if (!window.ethereum) return alert("Instala MetaMask");
    
    status = "connecting";
    try {
      const isCorrectNet = await checkNetwork();
      if (!isCorrectNet) {
        await switchNetwork();
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      address = accounts[0];
      isConnected = true;
      status = "connected";
      localStorage.setItem('walletConnected', 'true');
      dispatch('connected', { address });
    } catch (err) {
      status = "disconnected";
      console.error(err);
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
    if (browser && window.ethereum) {
      // Auto-reconexión
      if (localStorage.getItem('walletConnected') === 'true') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) connect();
      }

      // Listeners
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) disconnect();
        else { address = accounts[0]; connect(); }
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  });
</script>

<div class="wallet-container">
  {#if status === "disconnected"}
    <button class="btn-connect" on:click={connect}>
      Connect Wallet
    </button>
  {:else if status === "connecting"}
    <button class="btn-status" disabled>Conectando...</button>
  {:else if status === "wrong_network"}
    <button class="btn-wrong" on:click={switchNetwork}>
      Cambiar a zkSYS
    </button>
  {:else}
    <div class="connected-box">
      <span class="addr">{truncate(address)}</span>
      <button class="btn-disconnect" on:click={disconnect}>✖</button>
    </div>
  {/if}
</div>

<style>
  .btn-connect {
    background: #1a73e8;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  }
  .btn-wrong {
    background: #fbbc05;
    color: #000;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
  }
  .connected-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #e8f0fe;
    padding: 5px 15px;
    border-radius: 20px;
    border: 1px solid #1a73e8;
  }
  .addr { font-family: monospace; color: #1a73e8; font-weight: bold; }
  .btn-disconnect {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1.2rem;
  }
  .btn-disconnect:hover { color: #d93025; }
</style>