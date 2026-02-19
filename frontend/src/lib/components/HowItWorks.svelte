<script>
  import { t } from '$lib/i18n/t.js';
</script>

<section class="how">
  <div class="container">
    <h2>{$t('how_title')}</h2>
    <p>{$t('how_desc')}</p>
  </div>
</section>

<style>
  .how {
    background: #f5f5f7;
    padding: 120px 20px;
    text-align: center;
    color: #1d1d1f;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    color: #000;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.5rem;
    line-height: 1.4;
    color: #424245;
    font-weight: 500;
  }
</style>
