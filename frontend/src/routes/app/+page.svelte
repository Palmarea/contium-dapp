<script>
  // Variables de estado sugeridas para los componentes
  let walletAddress = "0xEC72...Eb45"; // Ejemplo de la wallet del equipo Chainport
  let docsCount = 5;
  let validatedCount = 3;
  let score = 50;

  let activities = [
    { id: 1, action: "Factura Validada", hash: "0x123...abc", time: "hace 2m" },
    { id: 2, action: "Minted Compliance Badge", hash: "0x456...def", time: "hace 15m" },
    { id: 3, action: "Upload: Factura_001.pdf", hash: "0x789...ghi", time: "hace 1h" }
  ];

  function connectWallet() {
    // Lógica para conectar (Web3Modal/Ethers)
  }
</script>

<div class="dashboard-container">
  <header class="header">
    <div class="logo">
      <span class="logo-icon">🛡️</span> <strong>CONTIUM</strong>
    </div>
    <div class="wallet-section">
      {#if walletAddress}
        <span class="address">{walletAddress}</span>
        <button class="btn-disconnect">Disconnect</button>
      {:else}
        <button class="btn-primary" on:click={connectWallet}>Connect Wallet</button>
      {/if}
    </div>
  </header>

  <section class="stats-bar">
    <div class="stat-item">📄 Docs Subidos: <strong>{docsCount}</strong></div>
    <div class="stat-item">✅ Validados: <strong>{validatedCount}</strong></div>
    <div class="stat-item trophy">🏆 Score: <strong>{score} XP</strong></div>
  </section>

  <div class="grid-layout">
    <main class="main-content">
      <div class="upload-card">
        <h2>Verificación Documental</h2>
        <p>Sube tu Factura Comercial para análisis de IA y registro en Syscoin.</p>
        <div class="dropzone">
          <span class="icon">📁</span>
          <p>Arrastra documentos aquí o haz clic para buscar</p>
          <input type="file" id="fileInput" hidden />
        </div>
        <div class="actions">
          <button class="btn-primary">Validar Documento</button>
          <button class="btn-secondary">Mintear Badge (NFT)</button>
        </div>
      </div>
    </main>

    <aside class="sidebar">
      <h3>Actividad Reciente</h3>
      <ul class="activity-list">
        {#each activities as act}
          <li>
            <div class="act-info">
              <span class="act-action">{act.action}</span>
              <span class="act-hash">{act.hash}</span>
            </div>
            <span class="act-time">{act.time}</span>
          </li>
        {/each}
      </ul>
    </aside>
  </div>

  <footer class="footer">
    <div class="footer-links">
      <a href="https://explorer.syscoin.org" target="_blank">Explorer</a>
      <a href="https://github.com/Contium" target="_blank">GitHub</a>
      <a href="/docs">Docs</a>
    </div>
    <p>© 2026 Contium - RegTech on Syscoin</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  .dashboard-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Header */
  .header {
    background: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
  }

  .logo { font-size: 1.25rem; display: flex; align-items: center; gap: 8px; }
  .address { font-family: monospace; background: #eee; padding: 0.4rem; border-radius: 4px; }

  /* Stats */
  .stats-bar {
    display: flex;
    justify-content: space-around;
    background: #fff;
    padding: 1rem;
    margin: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .trophy { color: #f39c12; }

  /* Grid Layout */
  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
    padding: 0 2rem;
    flex: 1;
  }

  /* Main & Upload */
  .main-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .dropzone {
    border: 2px dashed #1a73e8;
    border-radius: 8px;
    padding: 3rem;
    text-align: center;
    margin: 2rem 0;
    background: #f8fbff;
    cursor: pointer;
  }

  .actions { display: flex; gap: 1rem; }

  /* Sidebar */
  .sidebar {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .activity-list { list-style: none; padding: 0; }
  .activity-list li {
    padding: 0.8rem 0;
    border-bottom: 1px solid #eee;
    font-size: 0.85rem;
  }
  .act-hash { display: block; color: #666; font-size: 0.75rem; }

  /* Buttons */
  .btn-primary { background: #1a73e8; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 4px; cursor: pointer; }
  .btn-secondary { background: white; color: #1a73e8; border: 1px solid #1a73e8; padding: 0.7rem 1.5rem; border-radius: 4px; cursor: pointer; }
  .btn-disconnect { background: #ff4d4d; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; margin-left: 10px; cursor: pointer;}

  /* Footer */
  .footer {
    text-align: center;
    padding: 2rem;
    color: #666;
    font-size: 0.9rem;
  }
  .footer-links { display: flex; justify-content: center; gap: 2rem; margin-bottom: 0.5rem; }
  .footer-links a { text-decoration: none; color: #1a73e8; }

  /* Responsive */
  @media (max-width: 768px) {
    .grid-layout { grid-template-columns: 1fr; }
    .stats-bar { flex-direction: column; gap: 10px; text-align: center; }
  }
</style>