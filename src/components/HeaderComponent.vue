<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const showMenu = ref(false)
const menuScreen = ref('main')
const selectedTheme = ref('claro')
const authStore = useAuthStore()
const router = useRouter()

function toggleMenu() {
  showMenu.value = !showMenu.value
  if (!showMenu.value) {
    menuScreen.value = 'main'
  }
}

function goToThemes() {
  menuScreen.value = 'themes'
}

function goBack() {
  menuScreen.value = 'main'
}

function logout() {
  authStore.logout()
  router.push('/login')
}

watch(selectedTheme, (newTheme) => {
  document.body.className = ''
  document.body.classList.add(newTheme)
})

</script>

<template>
  <div class="header">
    <h1 class="logo">SNAPLY</h1>
    <button class="menu-btn" @click="toggleMenu">
      <i class="fa-solid fa-bars"></i>
    </button>
    <div
    v-if="showMenu"
    class="overlay"
    @click="toggleMenu"
    ></div>
    <nav :class="['side-menu', { open: showMenu }]">
      <ul v-if="menuScreen === 'main'">
        <li @click="goToThemes" class="clickable">Temas</li>
        <li @click="logout" class="clickable">Sair</li>
      </ul>
      <ul v-if="menuScreen === 'themes'">
        <li @click="goBack" class="back">Voltar</li>
        <li class="theme-item" @click="selectedTheme = 'claro'">
          <span class="dot" :class="{ active: selectedTheme === 'claro' }"></span>
          Claro
        </li>
        <li class="theme-item" @click="selectedTheme = 'escuro'">
          <span class="dot" :class="{ active: selectedTheme === 'escuro' }"></span>
          Escuro
        </li>
        <li class="theme-item" @click="selectedTheme = 'dark'">
          <span class="dot" :class="{ active: selectedTheme === 'dark' }"></span>
          Dark
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

.logo {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 8px;
  background: var(--elements);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.menu-btn {
  position: absolute;
  right: 15px;
  top: 44%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--elements);
  font-size: 2.1rem;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}

.side-menu {
  position: fixed;
  top: 0;
  right: -300px;
  width: 250px;
  height: 100vh;
  background: var(--page);
  padding: 2rem 1.5rem;
  transition: right 0.3s ease;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.side-menu.open {
  right: 0; 
}

.side-menu ul {
  margin-top: 60px;
}

.side-menu li {
  font-size: 1.6rem;
  color: var(--elements);
  padding: 1rem 0;
}

.menu-btn {
  z-index: 1000000;
}

.back {
  color: var(--elements);
  font-weight: bold;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 13px;
  cursor: pointer;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--elements);
  display: inline-block;
}

.dot.active {
  background: var(--elements);
}

</style>
