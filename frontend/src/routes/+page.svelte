<script>
  import JourneySection from '$lib/components/JourneySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<!-- HERO SECTION -->
<section class="hero">
  <h1>Verifica documentos en blockchain</h1>
  <p>Registra, valida y certifica tus documentos con NFTs en zkSYS</p>
  <a href="/app" class="cta-button">Launch App</a>
</section>

<!-- JOURNEY SECTION (el componente que creaste) -->
<JourneySection />

<!-- FOOTER -->
<Footer />

<style>
  .hero {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .hero p {
    font-size: 1.3rem;
    margin-bottom: 32px;
    opacity: 0.9;
  }

  .cta-button {
    background: white;
    color: #667eea;
    padding: 16px 40px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2rem;
    }
    .hero p {
      font-size: 1rem;
    }
  }
</style>