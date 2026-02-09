<script>
  export let currentStep = 1;

  const stepsData = {
    1: {
      title: "Cargar documentos",
      desc: "Paso 1: Sube o arrastra tus documentos en el recuadro de abajo para poder continuar (PDF, DOC, Imagen).",
      progress: 25,
      color: "#38bdf8"
    },
    2: {
      title: "Registrar el Hash",
      desc: "Paso 2: Se creó el Hash Sha-256. Haz clic en 'Registrar en blockchain' para asegurar la integridad de tu archivo.",
      progress: 50,
      color: "#fbbf24"
    },
    3: {
      title: "Validación de documentos",
      desc: "Paso 3: Realiza la validación para confirmar la autenticidad y ganar puntos de reputación.",
      progress: 75,
      color: "#30d158"
    },
    4: {
      title: "Mint Badge NFT",
      desc: "¡Proceso verificado! Procede a mintear tu Badge NFT oficial en el botón inferior.",
      progress: 100,
      color: "#a855f7"
    }
  };
</script>

<div class="jury-panel-card">
  <div class="card-header">
    <div class="header-content">
      <span class="step-badge" style="background: {stepsData[currentStep].color}22; color: {stepsData[currentStep].color}">
        Paso {currentStep} de 4
      </span>
      <h3>{stepsData[currentStep].title}</h3>
      <p>{stepsData[currentStep].desc}</p>
    </div>
    <div class="progress-circle">
       <span class="percentage" style="color: {stepsData[currentStep].color}">{stepsData[currentStep].progress}%</span>
    </div>
  </div>
  
  <div class="progress-container">
    <div class="progress-track">
      <div class="progress-fill" style="width: {stepsData[currentStep].progress}%; background: {stepsData[currentStep].color}"></div>
    </div>
  </div>
</div>

<style>
  .jury-panel-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 16px; /* Bordes más redondeados estilo Apple */
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transition: all 0.4s ease;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .step-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  h3 {
    margin: 0;
    color: #f8fafc;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    color: #94a3b8;
    font-size: 0.95rem;
    margin: 8px 0 0 0;
    line-height: 1.5;
    max-width: 90%;
  }

  .percentage {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .progress-container {
    width: 100%;
  }

  .progress-track {
    height: 8px;
    background: #0f172a;
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); /* Efecto rebote suave */
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
</style>