<script>
	import favicon from '$lib/assets/favicon.svg';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Botón fijo arriba-derecha, visible en todas las páginas -->
<div class="lang-fixed">
	<LanguageToggle />
</div>

{@render children()}

<style>
	.lang-fixed{
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 9999;
	}
</style>
