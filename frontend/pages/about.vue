<template>
  <article class="about">
    <h1>{{ t('about.title') }}</h1>
    <section class="content" aria-labelledby="about-intro">
      <p id="about-intro">{{ t('about.intro') }}</p>
      <p>{{ t('about.description') }}</p>
      
      <section aria-labelledby="hobbies-title">
        <h2 id="hobbies-title">{{ t('about.hobbies') }}</h2>
        <ul>
          <li>{{ t('about.hobby1') }}</li>
          <li>{{ t('about.hobby2') }}</li>
          <li>{{ t('about.hobby3') }}</li>
          <li>{{ t('about.hobby4') }}</li>
        </ul>
      </section>
      
      <section aria-labelledby="contact-title">
        <h2 id="contact-title">{{ t('about.contact') }}</h2>
        <p>{{ t('about.twitter') }}</p>
      </section>
    </section>
  </article>
</template>
<script setup lang="ts">
const { t } = useLocale()
</script>
<style scoped>
.about {
  animation: fadeIn 0.6s ease-out;
}

.about h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.content {
  line-height: 1.8;
  background: rgba(var(--color-rgb-main), 0.5);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--color-accent);
  opacity: 0.9;
}

.content > p {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.content section {
  margin-top: 2rem;
}

.content h2 {
  margin-bottom: 1.25rem;
  margin-top: 2rem;
  font-size: 1.4rem;
  color: var(--color-text);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.content ul {
  list-style: none;
  margin-left: 2rem;
}

.content li {
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 1.5rem;
  color: var(--color-sub);
  transition: all 0.2s ease;
}

.content li::before {
  content: '\f105';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  position: absolute;
  left: 0;
  color: var(--color-accent);
}

.content li:hover {
  background: rgba(var(--color-rgb-accent), 0.15);
  transform: translateX(5px);
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
</style>
