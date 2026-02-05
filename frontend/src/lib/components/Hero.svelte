<!-- Hero.svelte -->
<section class="hero">
  <div class="container fade-in">
    <h1>Verifica documentos en blockchain</h1>
    <p>Registra, valida y certifica con NFTs en zkSYS</p>
    <a href="/app" class="cta">Launch App</a>
  </div>
</section>

<style>
  .hero {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1rem;
    background: #ffffff;
  }

  .container {
    max-width: 720px;
  }

  h1 {
    font-size: 2.6rem;
    font-weight: 700;
    color: #1a73e8;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #444;
    margin-bottom: 2rem;
  }

  .cta {
    display: inline-block;
    background: #1a73e8;
    color: #fff;
    padding: 0.9rem 2rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(26, 115, 232, 0.3);
  }

  /* Fade-in animation */
  .fade-in {
    animation: fadeInUp 0.9s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>