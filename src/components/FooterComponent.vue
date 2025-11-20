<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <footer class="bottom-nav">
    <router-link to="/feed" class="nav-item">
      <i class="fa-solid fa-house"></i>
    </router-link>

    <router-link to="/users" class="nav-item">
      <i class="fa-solid fa-users"></i>
    </router-link>

    <router-link to="/directs" class="nav-item">
      <i class="fa-solid fa-paper-plane"></i>
    </router-link>

    <router-link :to="`/profile/${authStore.user?.id}`" class="nav-item">
      <i class="fa-solid fa-user"></i>
    </router-link>
  </footer>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: var(--page);
  border-top: 1px solid var(--elements);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-item {
  font-size: 20px;
  color: var(--elements);
}
</style>
