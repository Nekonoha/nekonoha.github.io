<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">{{ locale === 'ja' ? '本文へ移動' : 'Skip to content' }}</a>
    <Header />
    <main id="main-content"><slot /></main>
    <Footer />
  </div>
</template>
<script setup lang="ts">
const { locale } = useLocale()
useHead(() => ({ htmlAttrs: { lang: locale.value } }))
</script>
<style src="~/assets/css/site.css"></style>
