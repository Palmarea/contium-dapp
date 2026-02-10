<script>
  import TxConfirmation from "./TxConfirmation.svelte";
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';
  import { CONTRACTS, NETWORK } from '$lib/config.js';

  export let hash = "";

  const dispatch = createEventDispatcher();

  let status = 'idle';
  let errorMsg = '';
  let txHash = '';

  function normalizeHash(h) {
    if (!h) return '';
    return h.startsWith('0x') ? h : `0x${h}`;
  }

  async function onMint() {
    if (!hash) return;

    errorMsg = '';
    status = 'loading';
    txHash = '';

    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const recipient = await signer.getAddress();

      const ABI = [
        'function mintBadge(address recipient, bytes32 documentHash)'
      ];

      const contract = new ethers.Contract(CONTRACTS.contiumBadge, ABI, signer);

      const tx = await contract.mintBadge(recipient, normalizeHash(hash));
      txHash = tx.hash;         // ✅ AQUÍ
      await tx.wait();          // ✅

      status = 'success';

      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 100, spread: 70 });

      dispatch('minted', { txHash });
    } catch (e) {
      status = 'idle';
      if (e.code === 4001) {
        errorMsg = 'Transacción cancelada';
      } else if (e.message?.includes('onlyOwner')) {
        errorMsg = 'Solo el owner puede mintear badges';
      } else {
        errorMsg = e.shortMessage || e.message || 'Error al mintear';
      }
    }
  }
</script>

<button
  class="mint-btn"
  on:click={onMint}
  disabled={!hash || status === 'loading' || status === 'success'}
>
  {#if status === 'loading'}
    Minteando...
  {:else if status === 'success'}
    🎉 Badge Creado!
  {:else}
    🏆 Mint Badge NFT
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
