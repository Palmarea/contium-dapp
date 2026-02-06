<script>
  import { onMount, onDestroy } from 'svelte';
  import { ethers } from 'ethers';
  import { browser } from '$app/environment';
  import { NETWORK, CONTRACTS, ABIS } from '$lib/config.js';

  let leaderboard = [];
  let loading = true;
  let userAddress = "";
  let refreshInterval;

  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  async function loadLeaderboard() {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORK.rpcUrl);
      const contract = new ethers.Contract(
        CONTRACTS.documentRegistry, 
        ABIS.documentRegistry, 
        provider
      );
      
      // El contrato devuelve 2 arrays: addresses y scores
      const [topUsers, topScores] = await contract.getTopUsers(10);
      
      // Combinar los arrays en objetos
      leaderboard = topUsers.map((address, i) => ({
        address: address,
        score: Number(topScores[i])
      }));

    } catch (err) {
      console.error("Error al cargar Leaderboard:", err);
      // Mostrar array vacío si hay error
      leaderboard = [];
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    if (browser) {
      const saved = localStorage.getItem('walletConnected');
      if (saved && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts[0]) userAddress = accounts[0].toLowerCase();
      }

      await loadLeaderboard();
      refreshInterval = setInterval(loadLeaderboard, 30000);
    }
  });

  onDestroy(() => {
    if (refreshInterval) clearInterval(refreshInterval);
  });
</script>

<div class="container">
  <header>
    <h1>🏆 Ranking de Validadores</h1>
    <p>Los usuarios con mayor reputación en la red zkSYS</p>
  </header>

  <div class="card">
    {#if loading}
      <div class="message">
        <div class="spinner"></div>
        <p>Cargando datos de la blockchain...</p>
      </div>
    {:else if leaderboard.length === 0}
      <div class="message">
        <p>📭 Aún no hay validadores. ¡Sé el primero!</p>
      </div>
    {:else}
      <table>
        <thead>
          <tr>
            <th># Posición</th>
            <th>Wallet</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {#each leaderboard as user, i}
            <tr class:is-user={user.address.toLowerCase() === userAddress}>
              <td class="rank-cell">
                {#if i === 0}<span class="medal">🥇</span>{/if}
                {#if i === 1}<span class="medal">🥈</span>{/if}
                {#if i === 2}<span class="medal">🥉</span>{/if}
                <span class="rank-num">{i + 1}</span>
              </td>
              <td class="mono">{truncate(user.address)}</td>
              <td class="bold">{user.score} pts</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .container { max-width: 900px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; }
  header { text-align: center; margin-bottom: 40px; }
  h1 { color: #1a73e8; font-size: 2.5rem; margin-bottom: 8px; }
  header p { color: #5f6368; }
  
  .card { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; }
  
  table { width: 100%; border-collapse: collapse; text-align: left; }
  th { background: #f8f9fa; padding: 20px; color: #5f6368; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
  td { padding: 18px 20px; border-bottom: 1px solid #f0f0f0; }

  tr:nth-child(1) .rank-num { color: #d4af37; font-weight: 800; }
  tr:nth-child(2) .rank-num { color: #aaa9ad; font-weight: 800; }
  tr:nth-child(3) .rank-num { color: #cd7f32; font-weight: 800; }

  .is-user { background: #e8f0fe !important; border-left: 5px solid #1a73e8; }
  
  .mono { font-family: 'JetBrains Mono', monospace; color: #1a73e8; font-weight: 500; }
  .bold { font-weight: 700; color: #202124; }
  .rank-cell { display: flex; align-items: center; gap: 10px; }
  .medal { font-size: 1.4rem; }
  
  .message { padding: 60px; text-align: center; color: #5f6368; }
  
  .spinner { 
    width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1a73e8; 
    border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>