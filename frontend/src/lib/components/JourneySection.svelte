<script>
  import { onMount } from 'svelte';
  
  let journeySteps = [
    { icon: '📤', title: 'UPLOAD', description: 'Sube tu documento (PDF, DOC, imagen)' },
    { icon: '🔐', title: 'HASH', description: 'Generamos huella digital SHA-256' },
    { icon: '⛓️', title: 'REGISTRO', description: 'Guardamos el hash en blockchain zkSYS' },
    { icon: '✅', title: 'VALIDACIÓN', description: 'Verificamos y certificamos el documento' },
    { icon: '🏆', title: 'BADGE NFT', description: 'Recibe tu NFT de cumplimiento' }
  ];

  let visibleSteps = [];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            if (!visibleSteps.includes(index)) {
              visibleSteps = [...visibleSteps, index];
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.journey-step').forEach((step) => {
      observer.observe(step);
    });

    return () => observer.disconnect();
  });
</script>

<section class="journey-section">
  <div class="journey-header">
    <h2>¿CÓMO FUNCIONA?</h2>
    <p>Tu documento verificado en 5 simples pasos</p>
  </div>

  <div class="journey-container">
    <div class="journey-line"></div>
    
    {#each journeySteps as step, index}
      <div 
        class="journey-step" 
        class:visible={visibleSteps.includes(index)}
        data-index={index}
        style="--delay: {index * 0.15}s"
      >
        <div class="step-number">{index + 1}</div>
        <div class="step-icon">{step.icon}</div>
        <div class="step-content">
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  /* Paleta de Colores y Tipografía */
  :root {
    --primary: #1a73e8;
    --secondary: #34a853;
    --bg-gray: #f8f9fa;
    --text-dark: #202124;
    --text-light: #70757a; /* Color más claro para descripciones */
    --shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    --shadow-hover: 0 15px 35px rgba(26, 115, 232, 0.15);
  }

  .journey-section {
    padding: 100px 20px;
    background: var(--bg-gray);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  .journey-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .journey-header h2 {
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 16px;
    letter-spacing: -1px;
  }

  .journey-header p {
    font-size: 1.1rem;
    color: var(--text-light);
    font-weight: 400;
  }

  .journey-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 500px;
    margin: 0 auto;
    position: relative;
  }

  /* Línea conectora vertical (Móvil) */
  .journey-line {
    position: absolute;
    left: 20px;
    top: 40px;
    bottom: 40px;
    width: 3px;
    background: linear-gradient(to bottom, var(--primary), var(--secondary));
    border-radius: 4px;
    opacity: 0.4;
  }

  .journey-step {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 30px;
    background: white;
    border-radius: 16px;
    box-shadow: var(--shadow);
    position: relative;
    margin-left: 45px;
    
    /* Animación */
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay);
  }

  .journey-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .journey-step:hover {
    box-shadow: var(--shadow-hover);
    transform: scale(1.02) translateY(-4px);
    border: 1px solid rgba(26, 115, 232, 0.2);
  }

  .step-number {
    position: absolute;
    left: -55px;
    width: 36px;
    height: 36px;
    background: white;
    color: var(--primary);
    border: 3px solid var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.9rem;
    z-index: 2;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .step-icon {
    font-size: 2.8rem;
    line-height: 1;
    transition: transform 0.3s ease;
  }

  .journey-step:hover .step-icon {
    transform: rotate(-10deg) scale(1.1);
  }

  .step-content h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .step-content p {
    font-size: 0.95rem;
    color: var(--text-light);
    line-height: 1.5;
    margin: 0;
  }

  /* Responsive: Desktop 5 columnas */
  @media (min-width: 1024px) {
    .journey-container {
      flex-direction: row;
      max-width: 1200px;
      gap: 20px;
      align-items: stretch;
    }

    .journey-line {
      left: 50px;
      right: 50px;
      top: 110px; /* Alineado con los números */
      bottom: auto;
      width: auto;
      height: 3px;
      background: linear-gradient(to right, var(--primary), var(--secondary));
    }

    .journey-step {
      flex: 1;
      flex-direction: column;
      text-align: center;
      margin-left: 0;
      margin-top: 50px;
      padding: 40px 20px;
      justify-content: flex-start;
    }

    .step-number {
      left: 50%;
      transform: translateX(-50%);
      top: -68px;
    }

    .step-icon {
      margin-bottom: 20px;
    }

    .step-content h3 {
      font-size: 1.1rem;
    }
  }
</style>