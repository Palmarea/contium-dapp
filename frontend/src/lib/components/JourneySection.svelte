<script>
  import { onMount } from 'svelte';

  const steps = [
    { icon: '📤', title: 'UPLOAD', text: 'Sube tu documento (PDF, DOC, imagen)', glow: '#0071e3' },
    { icon: '🔐', title: 'HASH', text: 'Generamos huella digital SHA-256', glow: '#38bdf8' },
    { icon: '⛓️', title: 'REGISTRO', text: 'Guardamos hash en blockchain zkSYS', glow: '#a855f7' },
    { icon: '✅', title: 'VALIDACIÓN', text: 'Verificamos y certificamos', glow: '#30d158' },
    { icon: '🏆', title: 'BADGE NFT', text: 'Recibe tu NFT de cumplimiento', glow: '#fbbf24' }
  ];

  let visible = false;
  onMount(() => {
    setTimeout(() => { visible = true; }, 100);
  });
</script>

<section class="journey">
  <div class="container">
    <h2>¿CÓMO FUNCIONA?</h2>
    <p class="subtitle">Tu documento verificado en 5 pasos</p>

    <div class="timeline">
      {#each steps as step, i}
        <div class="timeline-item" class:visible style="transition-delay: {i * 120}ms; --step-glow: {step.glow}">
          <div class="dot-wrapper">
             <div class="dot"></div>
             {#if i !== steps.length - 1}
                <div class="connector-line"></div>
             {/if}
          </div>

          <div class="card">
            <div class="card-bg"></div>
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
    background: #050505; /* Un tono casi negro pero con profundidad */
    padding: 100px 20px;
    color: #fff;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 10px;
    background: linear-gradient(180deg, #fff 0%, #86868b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: #86868b;
    margin-bottom: 80px;
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .timeline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    width: 100%;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .timeline-item.visible { opacity: 1; transform: translateY(0); }

  .dot-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 50px;
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--step-glow);
    box-shadow: 0 0 15px var(--step-glow);
    z-index: 2;
  }

  .connector-line {
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, var(--step-glow), transparent);
    opacity: 0.3;
  }

  .card {
    background: #121212; /* Gris Space Gray para contraste con el fondo */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 35px;
    width: 100%;
    max-width: 420px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
  }

  /* El brillo que aparece detrás al pasar el mouse */
  .card-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at center, var(--step-glow) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
    filter: blur(40px);
  }

  .card:hover {
    transform: scale(1.05) translateY(-10px);
    border-color: var(--step-glow);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(var(--step-glow), 0.2);
  }

  .card:hover .card-bg {
    opacity: 0.15;
  }

  .card:hover h3 {
    text-shadow: 0 0 10px var(--step-glow);
  }

  .icon, h3, p {
    position: relative;
    z-index: 1;
  }

  .icon {
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
    display: block;
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
  }

  h3 {
    font-size: 0.9rem;
    letter-spacing: 0.25em;
    color: var(--step-glow); /* Título del color del paso */
    margin-bottom: 0.8rem;
    font-weight: 800;
  }

  .card p {
    margin: 0;
    color: #f5f5f7;
    line-height: 1.5;
    font-size: 1.1rem;
    font-weight: 400;
  }

  @media (max-width: 640px) {
    .card { max-width: 90%; }
  }
</style>