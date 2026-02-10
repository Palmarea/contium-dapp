<script>
  import TxConfirmation from "./TxConfirmation.svelte";
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
    txHash = '';

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
      txHash = tx.hash;              // ✅ AQUÍ (antes de esperar)
      await tx.wait();               // ✅ espera minado

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

<!-- ✅ barra de confirmaciones -->
<TxConfirmation txHash={txHash} />

{#if status === 'success' && txHash}
  <a href="{NETWORK.explorer}/tx/{txHash}" target="_blank" class="tx-link">
    Ver transacción →
  </a>
{/if}

{#if errorMsg}
  <p class="error">{errorMsg}</p>
{/if}
