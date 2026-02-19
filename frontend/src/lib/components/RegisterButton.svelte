<script>
	import TxConfirmation from "./TxConfirmation.svelte";
	import { createEventDispatcher } from 'svelte';
	import { CONTRACTS, ABIS, NETWORK } from '$lib/config.js';
	import { t } from "$lib/i18n/t.js";

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
			txHash = tx.hash;          // ✅ clave para barra
			await tx.wait();

			status = 'success';
			dispatch('registered');
		} catch (e) {
			status = 'idle';
			if (e.code === 4001) {
				errorMsg = $t("txCancelled");
			} else if (e.message?.includes('ya registrado')) {
				errorMsg = $t("docAlreadyRegistered");
			} else if (e.message?.includes('missing revert data') || e.message?.includes('CALL_EXCEPTION')) {
				errorMsg = $t("noPermissions");
			} else {
				errorMsg = e.shortMessage || e.message || $t("registerError");
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
		{$t("registering")}
	{:else if status === 'success'}
		{$t("registered")}
	{:else}
		{$t("register")}
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
	.register-btn:hover:not(:disabled) { background: #1557b0; }
	.register-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.tx-link { display: block; margin-top: 8px; color: #38bdf8; font-size: 0.9rem; }
	.error { color: #f87171; margin-top: 8px; font-size: 0.9rem; }
</style>
