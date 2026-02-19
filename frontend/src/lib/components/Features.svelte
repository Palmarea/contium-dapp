<script>
  import { t } from '$lib/i18n/t.js';
</script>

<section class="features">
  <div class="container">
    <h2>{$t('feat_title')}</h2>

    <div class="vertical-stack">
      <div class="feature-card">
        <div class="content">
          <h3>{$t('feat_blockchain_title')}</h3>
          <p>{$t('feat_blockchain_desc')}</p>
        </div>
        <div class="check-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>

      <div class="feature-card">
        <div class="content">
          <h3>{$t('feat_zerotrust_title')}</h3>
          <p>{$t('feat_zerotrust_desc')}</p>
        </div>
        <div class="check-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>

      <div class="feature-card">
        <div class="content">
          <h3>{$t('feat_ai_title')}</h3>
          <p>{$t('feat_ai_desc')}</p>
        </div>
        <div class="check-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .features {
    background: #ffffff;
    padding: 120px 20px;
    text-align: center;
  }

  .container {
    max-width: 850px;
    margin: 0 auto;
  }

  h2 {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    font-weight: 800;
    color: #1d1d1f;
    margin-bottom: 60px;
    letter-spacing: -0.04em;
  }

  .vertical-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .feature-card {
    width: 100%;
    background: #f5f5f7;
    border-radius: 32px;
    padding: 40px 50px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .feature-card:hover {
    transform: scale(1.03) translateY(-5px);
    background: #ffffff;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
    border-color: #0071e3;
  }

  .content {
    flex: 1;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1d1d1f;
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }

  .feature-card:hover h3 {
    color: #0071e3;
  }

  p {
    font-size: 1.3rem;
    color: #86868b;
    margin: 0;
    transition: color 0.3s ease;
  }

  .feature-card:hover p {
    color: #424245;
  }

  .check-icon {
    width: 40px;
    height: 40px;
    background: #0071e3;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateX(20px) scale(0.5);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .check-icon svg {
    width: 24px;
    height: 24px;
  }

  .feature-card:hover .check-icon {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  .feature-card:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    .feature-card {
      padding: 30px;
      border-radius: 24px;
    }

    h3 { font-size: 1.5rem; }
    p { font-size: 1.1rem; }

    .check-icon {
      width: 32px;
      height: 32px;
    }
  }
</style>
