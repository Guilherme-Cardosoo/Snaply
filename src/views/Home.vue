<template>
  <div class="home-container">
    <main class="home-content">
      <h2>Feed</h2>
      <p>Ainda não tem feed, faz o L</p>
    </main>
  </div>
</template>

<script setup>
import HeaderComponent from '../components/HeaderComponent.vue'
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  color: var(--text);
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.home-content {
  padding: 20px;
}
</style>
