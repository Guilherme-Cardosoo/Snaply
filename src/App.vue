<script setup>
import { useRoute } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import { useThemeStore } from './stores/theme'

const route = useRoute()

const themeStore = useThemeStore()
themeStore.initTheme()
</script>

<template>
  <HeaderComponent v-if="route.name !== 'Login' && route.name !== 'Profile'" />
  <router-view />
  <FooterComponent v-if="route.name !== 'Login' && route.name !== 'Profile'" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background-color: var(--page);
  color: var(--elements);
}
</style>

