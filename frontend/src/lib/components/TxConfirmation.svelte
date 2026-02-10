<script>
  import { onDestroy } from "svelte";
  import { ethers } from "ethers";
  import { NETWORK } from "$lib/config.js";

  export let txHash = "";

  const TARGET = 5;

  let confirmations = 0;
  let status = "idle"; // idle | waiting | confirmed | error
  let errorMsg = "";

  let cancelled = false;

  function getProvider() {
    return new ethers.JsonRpcProvider(NETWORK.rpcUrl);
  }

  async function trackConfirmations(hash) {
    if (!hash) return;

    cancelled = false;
    confirmations = 0;
    status = "waiting";
    errorMsg = "";

    const provider = getProvider();

    try {
      for (let n = 1; n <= TARGET; n++) {
        if (cancelled) return;
        await provider.waitForTransaction(hash, n);
        if (cancelled) return;
        confirmations = n;
      }
      status = "confirmed";
    } catch (e) {
      status = "error";
      errorMsg = e?.message ?? "Error esperando confirmaciones";
    }
  }

  $: if (txHash) trackConfirmations(txHash);

  onDestroy(() => {
    cancelled = true;
  });

  function pct() {
    return Math.round((confirmations / TARGET) * 100);
  }
</script>

{#if txHash}
  <div class="txc">
    <div class="txc-top">
      <span class="txc-label">Confirmaciones: {confirmations}/{TARGET}</span>
      {#if status === "confirmed"}
        <span class="txc-ok">Listo ✅</span>
      {:else if status === "error"}
        <span class="txc-bad">Error</span>
      {:else}
        <span class="txc-wait">Esperando…</span>
      {/if}
    </div>

    <div class="txc-bar">
      <div class="txc-bar-fill" style="width: {pct()}%"></div>
    </div>

    {#if status === "error"}
      <div class="txc-err">{errorMsg}</div>
    {/if}
  </div>
{/if}

<style>
  .txc { margin-top: 10px; display: grid; gap: 8px; }
  .txc-top { display: flex; justify-content: space-between; align-items: center; font-size: 12px; opacity: 0.95; }
  .txc-bar { height: 8px; border-radius: 999px; background: rgba(255,255,255,0.12); overflow: hidden; }
  .txc-bar-fill { height: 100%; border-radius: 999px; background: rgba(0, 255, 200, 0.75); transition: width 200ms linear; }
  .txc-ok { color: rgba(0, 255, 200, 0.95); }
  .txc-wait { color: rgba(255,255,255,0.75); }
  .txc-bad { color: rgba(255, 90, 90, 0.95); }
  .txc-err { font-size: 12px; color: rgba(255, 90, 90, 0.95); word-break: break-word; }
</style>
