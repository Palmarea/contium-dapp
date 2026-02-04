<script>
  const explorerUrl = "https://explorer.pob.dev11.top";
  const githubUrl = "https://github.com/Palmarea/contium-dapp";
</script>

<footer class="footer">
  <div class="grid">
    <div class="col">
      <img src="/logo.png" alt="Contium Logo" class="logo" />
      <p>Verificación Documental</p>
    </div>

    <div class="col">
      <h4>Links</h4>
      <a href={explorerUrl} target="_blank">Explorer</a>
      <a href={githubUrl} target="_blank">GitHub</a>
      <a href="/docs">Docs</a>
    </div>

    <div class="col">
      <p>Built for zkSYS Proof-of-Builders Hackathon 2025</p>
    </div>
  </div>

  <div class="credits">
    © 2025 Team: Manzana, Michael, Jesús, André, Josué, Kimberly
  </div>
</footer>

<style>
  .footer {
    background-color: #1a1a1a;
    color: white;
    padding: 2rem 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .logo {
    width: 60px;
  }

  a {
    color: white;
    text-decoration: none;
  }

  a:hover {
    color: #1a73e8;
  }

  .credits {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.9rem;
    border-top: 1px solid #333;
    padding-top: 1rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .col {
      align-items: center;
    }
  }
</style>
