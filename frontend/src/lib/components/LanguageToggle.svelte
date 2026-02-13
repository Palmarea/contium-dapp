<script>
	import { lang } from "$lib/i18n/lang";

	function toggle() {
		lang.update((v) => (v === "es" ? "en" : "es"));
	}
</script>

<button class="lang-btn" on:click={toggle}>
	🌐 {$lang === "es" ? "EN" : "ES"}
</button>

<style>
	.lang-btn{
		border: 1px solid rgba(255,255,255,0.15);
		background: rgba(255,255,255,0.06);
		color: white;
		padding: 8px 12px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 600;
		backdrop-filter: blur(6px);
	}
</style>
