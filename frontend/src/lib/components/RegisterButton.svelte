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

  async function onRegister() {
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

      const tx = await contract.registerDocument(normalizeHash(hash), "");
      txHash = tx.hash;        // ✅ AQUÍ
      await tx.wait();         // ✅

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
