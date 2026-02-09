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

  async function onValidate() {
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

      const tx = await contract.validateDocument(normalizeHash(hash));
      const receipt = await tx.wait();

      txHash = receipt.hash;
      status = 'success';
      dispatch('validated');
    } catch (e) {
      status = 'idle';
      if (e.code === 4001) {
        errorMsg = 'Transacción cancelada';
      } else if (e.message?.includes('ya validado')) {
        errorMsg = 'Este documento ya fue validado';
      } else if (e.message?.includes('no existe')) {
        errorMsg = 'Primero registra el documento';
      } else if (e.message?.includes('solo owner')) {
        errorMsg = 'Solo el dueño puede validar';
      } else {
        errorMsg = e.shortMessage || e.message || 'Error al validar';
      }
    }
  }
</script>

<button 
  class="validate-btn" 
  on:click={onValidate} 
  disabled={!hash || status === 'loading' || status === 'success'}
>
  {#if status === 'loading'}
    Validando...
  {:else if status === 'success'}
    ✅ Validado! (+10 pts)
  {:else}
    ✅ Validar Documento
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
  .validate-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .validate-btn:hover:not(:disabled) {
    background: #059669;
  }

  .validate-btn:disabled {
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