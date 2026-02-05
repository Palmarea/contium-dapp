<!-- Después del <div class="test-container"> -->
<div class="dev-banner">
  🧪 PÁGINA DE DESARROLLO - Solo para testing interno
</div>

<script>
  import MintBadgeButton from '$lib/components/MintBadgeButton.svelte';

  // Estados de prueba - cambia estos valores para ver diferentes errores
  let testHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  let isRegistered = false;
  let isValidated = false;
  let hasBadge = false;
</script>

<div class="test-container">
  <h1>🧪 Test: MintBadgeButton</h1>

  <div class="controls">
    <h3>Controles de prueba:</h3>
    
    <label>
      <input type="checkbox" bind:checked={isRegistered} />
      Documento Registrado
    </label>
    
    <label>
      <input type="checkbox" bind:checked={isValidated} />
      Documento Validado
    </label>
    
    <label>
      <input type="checkbox" bind:checked={hasBadge} />
      Ya tiene Badge
    </label>
  </div>

  <div class="component-preview">
    <h3>Componente:</h3>
    <MintBadgeButton 
      documentHash={testHash}
      {isRegistered}
      {isValidated}
      {hasBadge}
    />
  </div>
</div>

<style>
  .test-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    font-family: system-ui, sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
  }

  .controls {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
  }

  .controls h3 {
    margin-top: 0;
  }

  label {
    display: block;
    margin: 10px 0;
    cursor: pointer;
  }

  input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.2);
  }

  .component-preview {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 2px dashed #ccc;
  }

  .component-preview h3 {
    margin-top: 0;
    color: #666;
  }

  .dev-banner {
  background: #ff9800;
  color: white;
  text-align: center;
  padding: 8px;
  font-weight: bold;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>