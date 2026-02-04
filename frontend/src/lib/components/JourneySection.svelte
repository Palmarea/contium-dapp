<script>
  import { onMount } from 'svelte';
  
  let journeySteps = [
    {
      icon: '📤',
      title: 'UPLOAD',
      description: 'Sube tu documento (PDF, DOC, imagen)'
    },
    {
      icon: '🔐',
      title: 'HASH',
      description: 'Generamos huella digital SHA-256'
    },
    {
      icon: '⛓️',
      title: 'REGISTRO',
      description: 'Guardamos el hash en blockchain zkSYS'
    },
    {
      icon: '✅',
      title: 'VALIDACIÓN',
      description: 'Verificamos y certificamos el documento'
    },
    {
      icon: '🏆',
      title: 'BADGE NFT',
      description: 'Recibe tu NFT de cumplimiento'
    }
  ];

  let visibleSteps = [];

  onMount(() => {
    // Intersection Observer para animación al scroll
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
      { threshold: 0.2 }
    );

    // Observar cada step
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
  .journey-section {
    padding: 80px 20px;
    background: #f8f9fa;
  }

  .journey-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .journey-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #202124;
    margin-bottom: 12px;
  }

  .journey-header p {
    font-size: 1.2rem;
    color: #5f6368;
  }

  .journey-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  /* Línea conectora */
  .journey-line {
    position: absolute;
    left: 24px;
    top: 40px;
    bottom: 40px;
    width: 3px;
    background: linear-gradient(to bottom, #1a73e8, #34a853);
    border-radius: 2px;
  }

  .journey-step {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    position: relative;
    margin-left: 50px;
    
    /* Animación inicial: oculto */
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.5s ease;
    transition-delay: var(--delay);
  }

  .journey-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .journey-step:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .step-number {
    position: absolute;
    left: -50px;
    top: 24px;
    width: 32px;
    height: 32px;
    background: #1a73e8;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    z-index: 1;
  }

  .step-icon {
    font-size: 2.5rem;
    line-height: 1;
  }

  .step-content h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #202124;
    margin-bottom: 4px;
  }

  .step-content p {
    font-size: 0.95rem;
    color: #5f6368;
    margin: 0;
  }

  /* Responsive: Desktop horizontal */
  @media (min-width: 900px) {
    .journey-container {
      flex-direction: row;
      max-width: 1200px;
      gap: 20px;
    }

    .journey-line {
      left: 40px;
      right: 40px;
      top: 50px;
      bottom: auto;
      width: auto;
      height: 3px;
      background: linear-gradient(to right, #1a73e8, #34a853);
    }

    .journey-step {
      flex: 1;
      flex-direction: column;
      text-align: center;
      margin-left: 0;
      margin-top: 60px;
      padding: 20px 16px;
    }

    .step-number {
      left: 50%;
      transform: translateX(-50%);
      top: -45px;
    }

    .step-icon {
      margin-bottom: 12px;
    }
  }
</style>