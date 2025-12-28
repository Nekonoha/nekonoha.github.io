<template>
  <section class="about">
    <h2>{{ t('about.title') }}</h2>
    <div class="content">
      <p>{{ t('about.intro') }}</p>
      <p>{{ t('about.description') }}</p>
      <h3>{{ t('about.hobbies') }}</h3>
      <ul>
        <li>{{ t('about.hobby1') }}</li>
        <li>{{ t('about.hobby2') }}</li>
        <li>{{ t('about.hobby3') }}</li>
        <li>{{ t('about.hobby4') }}</li>
      </ul>
      <h3>{{ t('about.contact') }}</h3>
      <p>{{ t('about.twitter') }}</p>
    </div>
  </section>
</template>
<script setup lang="ts">
const { t } = useLocale()
</script>
<style scoped>
.about {
  animation: fadeIn 0.6s ease-out;
}
.about h2 {
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
  line-height: 1.8;
  background: rgba(45, 43, 74, 0.7);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(200, 181, 209, 0.25);
  border: 1px solid rgba(200, 181, 209, 0.3);
}
.content p {
  margin-bottom: 1rem;
  color: #E8E5F0;
}
.content h3 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #C8B5D1;
}
.content ul {
  list-style: none;
  margin-left: 2rem;
}
.content li {
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 1.5rem;
  color: #E8E5F0;
  transition: all 0.2s ease;
}
.content li::before {
  content: '\f105';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  position: absolute;
  left: 0;
  color: #A695B1;
}
.content li:hover {
  background: rgba(166, 149, 177, 0.2);
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
