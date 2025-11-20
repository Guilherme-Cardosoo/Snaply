<template>
  <div id="app">
    <HeaderComponent v-if="!$route.meta.hideLayout" />
    <router-view />
    <FooterComponent v-if="!$route.meta.hideLayout" />
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>
