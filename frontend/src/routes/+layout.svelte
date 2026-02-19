<script>
	import favicon from '$lib/assets/favicon.svg';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Solo mostrar el toggle fijo en páginas sin header propio -->
{#if $page.url.pathname !== '/app'}
	<div class="lang-fixed">
		<LanguageToggle />
	</div>
{/if}

{@render children()}

<style>
	.lang-fixed{
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 9999;
	}
</style>
