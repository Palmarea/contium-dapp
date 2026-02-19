<script>
	import TxConfirmation from "./TxConfirmation.svelte";
	import { createEventDispatcher } from 'svelte';
	import { CONTRACTS, NETWORK } from '$lib/config.js';
	import { t } from "$lib/i18n/t.js";

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

			const ABI = ['function mintBadge(address recipient, bytes32 documentHash)'];
			const contract = new ethers.Contract(CONTRACTS.contiumBadge, ABI, signer);

			const tx = await contract.mintBadge(recipient, normalizeHash(hash));
			txHash = tx.hash;          // ✅ clave para barra
			await tx.wait();

			status = 'success';

			const confetti = (await import('canvas-confetti')).default;
			confetti({ particleCount: 100, spread: 70 });

			dispatch('minted', { txHash });
		} catch (e) {
			status = 'idle';
			if (e.code === 4001) {
				errorMsg = $t("txCancelled");
			} else if (e.message?.includes('onlyOwner')) {
				errorMsg = $t("onlyOwnerMint");
			} else {
				errorMsg = e.shortMessage || e.message || $t("mintError");
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
		{$t("minting")}
	{:else if status === 'success'}
		{$t("minted")}
	{:else}
		{$t("mint")}
	{/if}
</button>

<TxConfirmation txHash={txHash} />

{#if status === 'success' && txHash}
	<a href="{NETWORK.explorer}/tx/{txHash}" target="_blank" class="tx-link">
		{$t("viewTx")}
	</a>
{/if}

{#if errorMsg}
	<p class="error">{errorMsg}</p>
{/if}

<style>
	.mint-btn {
		background: linear-gradient(135deg, #f7d36a 0%, #d6a433 100%);
		color: #1a1200;
		border: none;
		padding: 12px 24px;
		border-radius: 10px;
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.2s;
	}
	.mint-btn:hover:not(:disabled) { transform: translateY(-2px); }
	.mint-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.tx-link { display: block; margin-top: 8px; color: #38bdf8; font-size: 0.9rem; }
	.error { color: #f87171; margin-top: 8px; font-size: 0.9rem; }
</style>
