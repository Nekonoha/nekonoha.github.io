<template>
  <article class="works">
    <h1>{{ t('works.title') }}</h1>
    
    <div class="content">
      <!-- Games Section -->
      <section class="works-section" aria-labelledby="games-heading">
        <h2 id="games-heading"><i class="fas fa-gamepad" aria-hidden="true"></i> {{ t('works.games') }}</h2>
        <div class="links-grid">
          <a href="/auto-battler/" class="social-link">
            <i class="fas fa-chess" aria-hidden="true"></i>
            <strong>Auto Battler</strong>
          </a>
          <a href="https://play-board-three.vercel.app" target="_blank" rel="noopener noreferrer" class="social-link">
            <i class="fas fa-gamepad" aria-hidden="true"></i>
            <strong>{{ t('product.playBoard') }}</strong>
          </a>
        </div>
      </section>

      <!-- Fan Games Section -->
      <section class="works-section" aria-labelledby="fangames-heading">
        <h2 id="fangames-heading"><i class="fas fa-heart" aria-hidden="true"></i> {{ t('works.fanGames') }}</h2>
        <div class="links-grid">
          <NuxtLink to="/trial" class="social-link">
            <i class="fas fa-ghost" aria-hidden="true"></i>
            <strong>{{ t('product.trial') }}</strong>
          </NuxtLink>
          <NuxtLink to="/unrequited" class="social-link">
            <i class="fas fa-heart-broken" aria-hidden="true"></i>
            <strong>{{ t('product.unrequited') }}</strong>
          </NuxtLink>
        </div>
      </section>

      <!-- Social Section -->
      <section class="works-section" aria-labelledby="social-heading">
        <h2 id="social-heading"><i class="fas fa-share-alt" aria-hidden="true"></i> {{ t('works.social') }}</h2>
        <div class="links-grid">
          <a href="https://twitter.com/tan_fantazma" target="_blank" rel="noopener noreferrer" class="social-link">
            <i class="fab fa-twitter" aria-hidden="true"></i>
            <strong>Twitter</strong>
          </a>
          <a href="https://pixiv.me/tanfantazma" target="_blank" rel="noopener noreferrer" class="social-link pixiv">
            <i class="fa-brands fa-pixiv" aria-hidden="true"></i>
            <strong>{{ t('link.pixiv') }}</strong>
          </a>
          <a href="https://tanfantazma.booth.pm/" target="_blank" rel="noopener noreferrer" class="social-link booth">
            <i class="fas fa-shopping-bag" aria-hidden="true"></i>
            <strong>{{ t('product.booth') }}</strong>
          </a>
          <a href="http://nekonoha.hatenablog.com/" target="_blank" rel="noopener noreferrer" class="social-link blog">
            <i class="fas fa-blog" aria-hidden="true"></i>
            <strong>{{ t('link.blog') }}</strong>
          </a>
        </div>
      </section>

      <!-- Music Section -->
      <section class="works-section" aria-labelledby="music-heading">
        <h2 id="music-heading"><i class="fab fa-soundcloud" aria-hidden="true"></i> {{ t('works.music') }}</h2>
        <p class="section-description">{{ t('works.musicDescription') }}</p>
        <div class="soundcloud-embeds">
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
            title="Battle1 Astralhowl by cmu6elwlkgep"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/battle1-astralhowl&color=%23B68D40&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
          </iframe>
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
            title="No name 1 by cmu6elwlkgep"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/noname-1&color=%23B68D40&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
          </iframe>
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/ksmppmd1aivq&color=%23B68D40&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
          </iframe>
        </div>
        <div class="external-link-container">
          <a href="https://soundcloud.com/cmu6elwlkgep" target="_blank" class="external-link">
            <i class="fas fa-external-link-alt"></i> {{ t('works.visitSoundcloud') }}
          </a>
        </div>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
const { t } = useLocale()
</script>

<style scoped>
.works {
  animation: fadeIn 0.6s ease-out;
}

.works h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
}

.works-section {
  background: rgba(var(--color-rgb-main), 0.5);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--color-accent);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.works-section:hover {
  box-shadow: 0 8px 24px rgba(var(--color-rgb-accent), 0.25);
  transform: translateY(-2px);
  opacity: 1;
}

.works-section h2 {
  font-size: 1.4rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.works-section h2 i {
  margin-right: 0.5rem;
  color: var(--color-accent);
}

/* Social Links */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(var(--color-rgb-main), 0.8);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid var(--color-accent);
  opacity: 0.8;
  box-shadow: var(--shadow-subtle);
  min-height: 100px;
  backdrop-filter: blur(5px);
}

.social-link:hover {
  border-color: var(--color-sub);
  box-shadow: 0 4px 15px rgba(var(--color-rgb-accent), 0.35);
  transform: translateY(-2px);
  background: rgba(var(--color-rgb-main), 0.95);
  opacity: 1;
}

.social-link i {
  font-size: 1.8rem;
  display: block;
  margin-bottom: 0.5rem;
}

.social-link i {
  color: var(--color-accent);
}

.social-link strong {
  display: block;
  font-size: 1rem;
  color: var(--color-sub);
  font-weight: 600;
  text-align: center;
}

/* SoundCloud Embeds */
.soundcloud-embeds {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.soundcloud-embeds iframe {
  border-radius: 8px;
  overflow: hidden;
}

/* Section Description */
.section-description {
  color: var(--color-sub);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

/* External Link */
.external-link-container {
  margin-top: 1rem;
  text-align: center;
}

.external-link {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: rgba(var(--color-rgb-main), 0.9);
  color: var(--color-sub);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--color-accent);
  opacity: 0.8;
}

.external-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(var(--color-rgb-accent), 0.45);
  background: rgba(var(--color-rgb-main), 0.95);
  color: var(--color-text);
  opacity: 1;
}

.external-link i {
  margin-right: 0.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .works h2 {
    font-size: 2rem;
  }

  .works-section {
    padding: 1.2rem;
  }

  .works-section h3 {
    font-size: 1.3rem;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
