<script>
  import { onMount } from 'svelte';

  const steps = [
    { icon: '📤', title: 'UPLOAD', text: 'Sube tu documento (PDF, DOC, imagen)' },
    { icon: '🔐', title: 'HASH', text: 'Generamos huella digital SHA-256' },
    { icon: '⛓️', title: 'REGISTRO', text: 'Guardamos hash en blockchain zkSYS' },
    { icon: '✅', title: 'VALIDACIÓN', text: 'Verificamos y certificamos' },
    { icon: '🏆', title: 'BADGE NFT', text: 'Recibe tu NFT de cumplimiento' }
  ];

  let visible = false;

  onMount(() => {
    // Hacer visible después de montar
    setTimeout(() => {
      visible = true;
    }, 100);
  });
</script>

<section class="journey">
  <div class="container">
    <h2>¿CÓMO FUNCIONA?</h2>
    <p class="subtitle">Tu documento verificado en 5 pasos</p>

    <div class="timeline">
      {#each steps as step, i}
        <div
          class="timeline-item"
          class:visible
          style="transition-delay: {i * 120}ms"
        >
          <div class="dot"></div>
          <div class="card">
            <span class="icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .journey {
    background: #f8f9fa;
    padding: 6rem 1rem;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
  }

  h2 {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #202124;
  }

  .subtitle {
    text-align: center;
    color: #555;
    margin-bottom: 4rem;
    font-size: 1.05rem;
  }

  .timeline {
    position: relative;
    margin-left: 1.5rem;
  }

  .timeline::before {
    content: '';
    position: absolute;
    top: 0;
    left: 12px;
    width: 2px;
    height: 100%;
    background: #dcdfe3;
  }

  .timeline-item {
    position: relative;
    display: flex;
    gap: 1.5rem;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .timeline-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #1a73e8;
    flex-shrink: 0;
    margin-top: 0.6rem;
    box-shadow: 0 0 0 6px #f8f9fa;
    z-index: 2;
  }

  .card {
    background: #ffffff;
    border-radius: 14px;
    padding: 1.4rem 1.6rem;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    max-width: 520px;
  }

  .icon {
    font-size: 1.6rem;
    display: inline-block;
    margin-bottom: 0.4rem;
  }

  h3 {
    font-size: 0.95rem;
    letter-spacing: 0.08em;
    color: #1a73e8;
    margin-bottom: 0.4rem;
    font-weight: 600;
  }

  .card p {
    margin: 0;
    color: #333;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    .timeline {
      margin-left: 0;
    }

    .timeline::before {
      left: 13px;
    }

    .card {
      max-width: 100%;
    }
  }
</style>