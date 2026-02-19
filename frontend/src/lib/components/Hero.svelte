<script>
  import { t } from '$lib/i18n/t.js';
</script>

<section class="hero">
  <div class="bg-glow"></div>
  <div class="container fade-in">
    <h1>{$t('hero_title')}</h1>
    <p>{$t('hero_subtitle')}</p>
    <a href="/app" class="cta">{$t('hero_cta')}</a>
  </div>
</section>

<style>
  .hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 1rem;
    background: #000;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: absolute;
    width: 60vw;
    height: 60vh;
    background: radial-gradient(circle, rgba(0, 113, 227, 0.15) 0%, transparent 70%);
    top: -10%;
    filter: blur(80px);
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 850px;
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: #fff;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    color: #86868b;
    margin-bottom: 3rem;
    font-weight: 400;
  }

  .cta {
    display: inline-block;
    background: #fff;
    color: #000;
    padding: 14px 32px;
    border-radius: 980px;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    transition: transform 0.2s ease;
  }

  .cta:hover {
    transform: scale(1.05);
  }

  .fade-in {
    animation: fadeInUp 1.2s cubic-bezier(0.2, 1, 0.3, 1);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
