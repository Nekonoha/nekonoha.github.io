<template>
  <section class="works">
    <h2>{{ t('works.title') }}</h2>
    
    <div class="content">
      <!-- Games Section -->
      <div class="works-section">
        <h3><i class="fas fa-gamepad"></i> {{ t('works.games') }}</h3>
        <div class="links-grid">
          <a href="/auto-battler/" class="social-link">
            <i class="fas fa-swords"></i>
            <strong>Auto Battler</strong>
          </a>
          <a href="https://play-board-three.vercel.app" target="_blank" class="social-link">
            <i class="fas fa-gamepad"></i>
            <strong>{{ t('product.playBoard') }}</strong>
          </a>
        </div>
      </div>

      <!-- Fan Games Section -->
      <div class="works-section">
        <h3><i class="fas fa-heart"></i> {{ t('works.fanGames') }}</h3>
        <div class="links-grid">
          <NuxtLink to="/trial" class="social-link">
            <i class="fas fa-ghost"></i>
            <strong>{{ t('product.trial') }}</strong>
          </NuxtLink>
          <NuxtLink to="/unrequited" class="social-link">
            <i class="fas fa-heart-broken"></i>
            <strong>{{ t('product.unrequited') }}</strong>
          </NuxtLink>
        </div>
      </div>

      <!-- Social Section -->
      <div class="works-section">
        <h3><i class="fas fa-share-alt"></i> {{ t('works.social') }}</h3>
        <div class="links-grid">
          <a href="https://twitter.com/tan_fantazma" target="_blank" class="social-link">
            <i class="fab fa-twitter"></i>
            <strong>Twitter</strong>
          </a>
          <a href="https://pixiv.me/tanfantazma" target="_blank" class="social-link pixiv">
            <i class="fa-brands fa-pixiv"></i>
            <strong>{{ t('link.pixiv') }}</strong>
          </a>
          <a href="https://tanfantazma.booth.pm/" target="_blank" class="social-link booth">
            <i class="fas fa-shopping-bag"></i>
            <strong>{{ t('product.booth') }}</strong>
          </a>
          <a href="http://nekonoha.hatenablog.com/" target="_blank" class="social-link blog">
            <i class="fas fa-blog"></i>
            <strong>{{ t('link.blog') }}</strong>
          </a>
        </div>
      </div>

      <!-- Music Section -->
      <div class="works-section">
        <h3><i class="fab fa-soundcloud"></i> {{ t('works.music') }}</h3>
        <p class="section-description">{{ t('works.musicDescription') }}</p>
        <div class="soundcloud-embeds">
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/battle1-astralhowl&color=%23B68D40&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
          </iframe>
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()
</script>

<style scoped>
.works {
  animation: fadeIn 0.6s ease-out;
}

.works h2 {
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-sub) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 3px solid rgba(182, 141, 64, 0.75);
  padding-bottom: 0.8rem;
  text-shadow: 0 0 8px rgba(182, 141, 64, 0.35);
}

.content {
  max-width: 1000px;
  margin: 0 auto;
}

.works-section {
  background: linear-gradient(180deg, rgba(44, 35, 35, 0.88) 0%, rgba(36, 28, 28, 0.94) 100%);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-strong);
  border: 1px solid rgba(182, 141, 64, 0.35);
  transition: all 0.3s ease;
}

.works-section:hover {
  box-shadow: 0 4px 20px rgba(182, 141, 64, 0.4);
  transform: translateY(-2px);
}

.works-section h3 {
  font-size: 1.5rem;
  color: var(--color-sub);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(182, 141, 64, 0.65);
}

.works-section h3 i {
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
  background: rgba(60, 47, 47, 0.65);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid rgba(182, 141, 64, 0.35);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  min-height: 100px;
  backdrop-filter: blur(5px);
}

.social-link:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 15px rgba(182, 141, 64, 0.35);
  transform: translateY(-2px);
  background: rgba(60, 47, 47, 0.8);
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
  background: rgba(44, 35, 35, 0.9);
  color: var(--color-sub);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(182, 141, 64, 0.4);
}

.external-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(182, 141, 64, 0.45);
  background: rgba(60, 47, 47, 0.95);
  color: var(--color-text);
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
