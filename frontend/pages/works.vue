<template>
  <section class="works">
    <h2>{{ t('works.title') }}</h2>
    
    <div class="content">
      <!-- Games Section -->
      <div class="works-section">
        <h3><i class="fas fa-gamepad"></i> {{ t('works.games') }}</h3>
        <div class="game-grid">
          <NuxtLink to="/trial" class="game-card">
            <h4>{{ t('product.trial') }}</h4>
            <p>{{ t('trial.description') }}</p>
          </NuxtLink>
          <NuxtLink to="/unrequited" class="game-card">
            <h4>{{ t('product.unrequited') }}</h4>
            <p>{{ t('unrequited.description') }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Social Section -->
      <div class="works-section">
        <h3><i class="fas fa-share-alt"></i> {{ t('works.social') }}</h3>
        <div class="links-grid">
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

      <!-- Twitter Section -->
      <div class="works-section">
        <h3><i class="fab fa-twitter"></i> {{ t('gallery.twitter') }}</h3>
        <p class="section-description">{{ t('works.twitterDescription') }}</p>
        <div class="twitter-container">
          <a class="twitter-timeline" data-lang="ja" data-height="400" data-dnt="true" href="https://twitter.com/tan_fantazma?ref_src=twsrc%5Etfw">Tweets by tan_fantazma</a>
        </div>
        <div class="external-link-container">
          <a href="https://twitter.com/tan_fantazma" target="_blank" class="external-link">
            <i class="fas fa-external-link-alt"></i> {{ t('works.visitTwitter') }}
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
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/battle1-astralhowl&color=%23f4a6c3&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
          </iframe>
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/noname-1&color=%23f4a6c3&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
          </iframe>
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameborder="no" 
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/cmu6elwlkgep/ksmppmd1aivq&color=%23f4a6c3&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
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
import { onMounted, nextTick } from 'vue'

const { t } = useLocale()

const loadTwitterWidgets = () => {
  // Twitter widgetスクリプトを確実に再実行
  if ((window as any).twttr && (window as any).twttr.widgets) {
    (window as any).twttr.widgets.load()
  }
}

onMounted(async () => {
  // Twitter widget script が既に存在するかチェック
  const existingScript = document.querySelector('script[src*="platform.twitter.com/widgets.js"]')
  
  if (!existingScript) {
    // スクリプトがまだない場合のみ追加
    const twitterScript = document.createElement('script')
    twitterScript.src = 'https://platform.twitter.com/widgets.js'
    twitterScript.async = true
    twitterScript.charset = 'utf-8'
    
    twitterScript.onload = async () => {
      // DOM描画を待ってからwidgetをロード
      await nextTick()
      setTimeout(() => {
        loadTwitterWidgets()
      }, 200)
    }
    
    document.head.appendChild(twitterScript)
  } else {
    // スクリプトが既にある場合は直接ロード
    await nextTick()
    setTimeout(() => {
      loadTwitterWidgets()
    }, 200)
  }
})
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
  background: linear-gradient(135deg, #B8A5C1 0%, #8B7A9F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 3px solid #A695B1;
  padding-bottom: 0.8rem;
  text-shadow: 0 0 8px rgba(184, 165, 193, 0.3);
}

.content {
  max-width: 1000px;
  margin: 0 auto;
}

.works-section {
  background: rgba(45, 43, 74, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(200, 181, 209, 0.3);
  border: 1px solid rgba(200, 181, 209, 0.4);
  transition: all 0.3s ease;
}

.works-section:hover {
  box-shadow: 0 4px 20px rgba(184, 165, 193, 0.4);
  transform: translateY(-2px);
}

.works-section h3 {
  font-size: 1.5rem;
  color: #C8B5D1;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #A695B1;
}

.works-section h3 i {
  margin-right: 0.5rem;
  color: #A695B1;
}

/* Games */
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.game-card {
  display: block;
  padding: 1.2rem;
  background: linear-gradient(135deg, #5e35b1 0%, #7e57c2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(94, 53, 177, 0.25);
}

.game-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(94, 53, 177, 0.4);
}

.game-card h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.game-card p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
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
  background: rgba(45, 43, 74, 0.6);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid rgba(200, 181, 209, 0.3);
  box-shadow: 0 2px 8px rgba(200, 181, 209, 0.15);
  min-height: 100px;
  backdrop-filter: blur(5px);
}

.social-link:hover {
  border-color: #A695B1;
  box-shadow: 0 4px 15px rgba(166, 149, 177, 0.3);
  transform: translateY(-2px);
  background: rgba(56, 53, 82, 0.8);
}

.social-link i {
  font-size: 1.8rem;
  display: block;
  margin-bottom: 0.5rem;
}

.social-link.pixiv i {
  color: #0096fa;
}

.social-link.booth i {
  color: #fc4d50;
}

.social-link.blog i {
  color: #B8A5C1;
}

.social-link strong {
  display: block;
  font-size: 1rem;
  color: #C8B5D1;
  font-weight: 600;
  text-align: center;
}

/* Twitter */
.twitter-container {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
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
  color: #C8B5D1;
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
  background: rgba(45, 43, 74, 0.8);
  color: #C8B5D1;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(184, 165, 193, 0.3);
  border: 1px solid rgba(184, 165, 193, 0.4);
}

.external-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(200, 181, 209, 0.5);
  background: rgba(56, 53, 82, 0.9);
  color: #E8E5F0;
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

  .game-grid,
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
