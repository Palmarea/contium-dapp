<script>
  import { createEventDispatcher } from 'svelte';
  import { CONTRACTS, ABIS, NETWORK } from '$lib/config.js';
  const dispatch = createEventDispatcher();

  export let hash = "";

  let status = 'idle';
  let errorMsg = '';
  let txHash = '';

  function normalizeHash(h) {
    if (!h) return '';
    return h.startsWith('0x') ? h : `0x${h}`;
  }

  async function onRegister() {
    if (!hash) return;
    
    errorMsg = '';
    status = 'loading';

    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACTS.documentRegistry, 
        ABIS.documentRegistry, 
        signer
      );

      const tx = await contract.registerDocument(normalizeHash(hash), "");
      const receipt = await tx.wait();

      txHash = receipt.hash;
      status = 'success';
      dispatch('registered');
    } catch (e) {
      status = 'idle';
      if (e.code === 4001) {
        errorMsg = 'Transacción cancelada';
      } else if (e.message?.includes('ya registrado')) {
        errorMsg = 'Este documento ya fue registrado';
      } else if (e.message?.includes('missing revert data') || e.message?.includes('CALL_EXCEPTION')) {
  errorMsg = 'Este documento ya fue registrado o no tienes permisos';
      } else {
        errorMsg = e.shortMessage || e.message || 'Error al registrar';
      }
    }
  }
</script>

<button 
  class="register-btn" 
  on:click={onRegister} 
  disabled={!hash || status === 'loading' || status === 'success'}
>
  {#if status === 'loading'}
    Registrando...
  {:else if status === 'success'}
    ✅ ¡Registrado!
  {:else}
    📝 Registrar en Blockchain
  {/if}
</button>

{#if status === 'success' && txHash}
  <a href="{NETWORK.explorer}/tx/{txHash}" target="_blank" class="tx-link">
    Ver transacción →
  </a>
{/if}

{#if errorMsg}
  <p class="error">{errorMsg}</p>
{/if}

<style>
  .register-btn {
    background: #1a73e8;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .register-btn:hover:not(:disabled) {
    background: #1557b0;
  }

  .register-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tx-link {
    display: block;
    margin-top: 8px;
    color: #38bdf8;
    font-size: 0.9rem;
  }

  .error {
    color: #f87171;
    margin-top: 8px;
    font-size: 0.9rem;
  }
</style>