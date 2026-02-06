<script>
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  import FileUpload from '$lib/components/FileUpload.svelte';
  import RegisterButton from '$lib/components/RegisterButton.svelte';
  import ValidateButton from '$lib/components/ValidateButton.svelte';
  import MintBadgeButton from '$lib/components/MintBadgeButton.svelte';

  let walletAddress = "";
  let isConnected = false;
  let documentHash = "";

  // Stats (por ahora estáticos, luego del contrato)
  let docsCount = 0;
  let validatedCount = 0;
  let score = 0;
</script>

<div class="dashboard-container">
  <header class="header">
    <div class="logo">
      <span class="logo-icon">🛡️</span> <strong>CONTIUM</strong>
    </div>
    <div class="wallet-section">
      <WalletConnect bind:address={walletAddress} bind:isConnected={isConnected} />
    </div>
  </header>

  <section class="stats-bar">
    <div class="stat-item">📄 Docs Subidos: <strong>{docsCount}</strong></div>
    <div class="stat-item">✅ Validados: <strong>{validatedCount}</strong></div>
    <div class="stat-item trophy">🏆 Score: <strong>{score} pts</strong></div>
  </section>

  <div class="grid-layout">
    <main class="main-content">
      <div class="upload-card">
        <h2>Verificación Documental</h2>
        <p>Sube tu documento para generar hash y registrar en blockchain.</p>
        
        {#if isConnected}
          <FileUpload bind:hash={documentHash} />
          
          {#if documentHash}
            <div class="hash-display">
              <p><strong>Hash SHA-256:</strong></p>
              <code>0x{documentHash}</code>
            </div>
            
            <div class="actions">
              <RegisterButton hash={documentHash} />
              <ValidateButton hash={documentHash} />
              <MintBadgeButton hash={documentHash} />
            </div>
          {/if}
        {:else}
          <div class="lock-screen">
            <p>🔒 Por favor, conecta tu wallet para subir documentos.</p>
          </div>
        {/if}
      </div>
    </main>

    <aside class="sidebar">
      <h3>¿Cómo funciona?</h3>
      <ol class="steps-list">
        <li>📤 Sube tu documento</li>
        <li>🔐 Se genera el hash SHA-256</li>
        <li>⛓️ Registra el hash en blockchain</li>
        <li>✅ Valida para ganar puntos</li>
        <li>🏆 Mintea tu badge NFT</li>
      </ol>
      <a href="/leaderboard" class="leaderboard-link">Ver Leaderboard →</a>
    </aside>
  </div>

  <footer class="footer">
    <div class="footer-links">
      <a href="https://explorer-pob.dev11.top" target="_blank">Explorer</a>
      <a href="https://github.com/Contium" target="_blank">GitHub</a>
    </div>
    <p>© 2025 Contium - zkSYS Hackathon</p>
  </footer>
</div>

<style>
  :global(body) { margin: 0; font-family: 'Inter', sans-serif; background-color: #0f172a; color: #e5e7eb; }
  
  .dashboard-container { display: flex; flex-direction: column; min-height: 100vh; }
  
  .header { background: #1e293b; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; }
  .logo { font-size: 1.25rem; display: flex; align-items: center; gap: 8px; color: #38bdf8; }
  
  .stats-bar { display: flex; justify-content: space-around; background: #1e293b; padding: 1rem; margin: 1rem 2rem; border-radius: 12px; }
  .stat-item { font-size: 0.95rem; }
  .trophy { color: #fbbf24; }
  
  .grid-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; padding: 0 2rem; flex: 1; }
  
  .main-content { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; }
  
  .upload-card h2 { margin-top: 0; color: #f8fafc; }
  .upload-card p { color: #94a3b8; }
  
  .hash-display { background: #0f172a; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
  .hash-display code { color: #38bdf8; font-size: 0.8rem; word-break: break-all; }
  
  .actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; }
  
  .lock-screen { background: #0f172a; border: 2px dashed #334155; padding: 4rem; text-align: center; border-radius: 12px; color: #64748b; margin: 2rem 0; }
  
  .sidebar { background: #1e293b; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; }
  .sidebar h3 { margin-top: 0; color: #f8fafc; }
  
  .steps-list { padding-left: 1.2rem; color: #94a3b8; }
  .steps-list li { margin-bottom: 0.8rem; }
  
  .leaderboard-link { display: block; margin-top: 1.5rem; color: #38bdf8; text-decoration: none; font-weight: 600; }
  .leaderboard-link:hover { text-decoration: underline; }
  
  .footer { text-align: center; padding: 2rem; color: #64748b; font-size: 0.9rem; }
  .footer-links { display: flex; justify-content: center; gap: 2rem; margin-bottom: 0.5rem; }
  .footer-links a { text-decoration: none; color: #38bdf8; }
  
  @media (max-width: 768px) { 
    .grid-layout { grid-template-columns: 1fr; } 
    .stats-bar { flex-direction: column; gap: 10px; text-align: center; } 
  }
</style>