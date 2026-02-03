<script>
  // Importamos tu componente nuevo
  import PrivacyModal from '$lib/components/PrivacyModal.svelte';
  
  // Importamos la navegación de SvelteKit
  import { goto } from '$app/navigation';

  let showModal = false;

  function abrirModal() {
    showModal = true;
  }

  function irAlaApp() {
    showModal = false;
    console.log("El usuario aceptó. Redirigiendo...");
    // Intentará ir a /app. Dará error 404 por ahora (¡eso es lo esperado!)
    goto('/app'); 
  }
</script>

<main class="contenedor-provisional">
  <h1>Bienvenido a Contium</h1>
  <p>Esta es tu Landing Page (Borrador)</p>

  <button class="btn-lanzar" on:click={abrirModal}>
    🚀 Launch App
  </button>

  <PrivacyModal 
    isOpen={showModal} 
    onAccept={irAlaApp}
    onCancel={() => showModal = false}
  />
</main>

<style>
  .contenedor-provisional {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f4f4f4;
    font-family: sans-serif;
  }

  h1 { margin-bottom: 10px; color: #333; }

  .btn-lanzar {
    background-color: #000;
    color: #fff;
    padding: 15px 30px;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: transform 0.2s;
  }
  
  .btn-lanzar:hover {
    transform: scale(1.05);
  }
</style>