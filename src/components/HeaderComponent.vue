<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'

const showMenu = ref(false)
const showThemes = ref(false)
const themeStore = useThemeStore()

function toggleMenu() {
  showMenu.value = !showMenu.value
  showThemes.value = false
}

function openThemes() {
  showThemes.value = true
}

function backToMainMenu() {
  showThemes.value = false
}

function selectTheme(theme) {
  themeStore.setTheme(theme)
}

const selectedTheme = computed(() => themeStore.theme)
</script>

<template>
  <header class="header">

    <h1 class="logo">Snaply</h1>

    <button class="menu-btn" @click="toggleMenu">
      <i class="fa-solid fa-bars"></i>
    </button>

    <div class="side-menu" :class="{ 'side-menu--open': showMenu }">
      <ul v-if="!showThemes">
        <li @click="openThemes" class="menu-link">Temas</li>
      </ul>

      <ul v-else>
        <li class="back" @click="backToMainMenu">Voltar</li>

        <li
          v-for="theme in [
            { name: 'Claro', key: 'claro' },
            { name: 'Escuro', key: 'escuro' },
            { name: 'Dark', key: 'dark' }
          ]"
          :key="theme.key"
          class="theme-item"
          @click="selectTheme(theme.key)"
        >
          <span>{{ theme.name }}</span>
          <span class="circle" :class="{ selected: selectedTheme === theme.key }"></span>
        </li>
      </ul>
    </div>

    <div v-if="showMenu" class="overlay" @click="toggleMenu"></div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.header::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--elements);
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 7px;
  color: var(--elements);
  margin-top: 2.4rem;
}

.menu-btn {
  position: absolute;
  left: 330px;
  top: 65%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--elements);
  font-size: 2.1rem;
}

.side-menu {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100%;
  background-color: var(--page);
  color: var(--elements);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease;
  padding-top: 20px;
  z-index: 1001;
}

.side-menu--open {
  right: 0;
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu li {
  padding: 15px 20px;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-link {
  color: var(--elements);
  text-decoration: none;
}

.menu-link:hover {
  text-decoration: underline;
}

.back {
  font-size: 1.2rem;
  color: var(--elements);
  cursor: pointer;
  margin-bottom: 10px;
}

.theme-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle {
  width: 18px;
  height: 18px;
  border: 2px solid var(--elements);
  border-radius: 50%;
  transition: 0.2s ease;
}

.circle.selected {
  background-color: var(--elements);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
