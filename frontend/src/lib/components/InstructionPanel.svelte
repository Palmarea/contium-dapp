<script>
  import { t } from '$lib/i18n/t.js';

  export let currentStep = 1;

  const colors    = { 1: "#38bdf8", 2: "#fbbf24", 3: "#30d158", 4: "#a855f7" };
  const progress  = { 1: 25,        2: 50,        3: 75,        4: 100 };
  const titleKeys = { 1: 'step1_title', 2: 'step2_title', 3: 'step3_title', 4: 'step4_title' };
  const descKeys  = { 1: 'step1_desc',  2: 'step2_desc',  3: 'step3_desc',  4: 'step4_desc'  };
</script>

<div class="jury-panel-card">
  <div class="card-header">
    <div class="header-content">
      <span class="step-badge" style="background: {colors[currentStep]}22; color: {colors[currentStep]}">
        {$t('step_badge')} {currentStep} {$t('step_of')} 4
      </span>
      <h3>{$t(titleKeys[currentStep])}</h3>
      <p>{$t(descKeys[currentStep])}</p>
    </div>
    <div class="progress-circle">
      <span class="percentage" style="color: {colors[currentStep]}">{progress[currentStep]}%</span>
    </div>
  </div>

  <div class="progress-container">
    <div class="progress-track">
      <div class="progress-fill" style="width: {progress[currentStep]}%; background: {colors[currentStep]}"></div>
    </div>
  </div>
</div>

<style>
  .jury-panel-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 16px;
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
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
</style>
