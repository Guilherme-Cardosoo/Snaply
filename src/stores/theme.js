import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'claro')

  function setTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)

    document.body.className = ''
    document.body.classList.add(newTheme)
  }

  setTheme(theme.value)

  return {
    theme,
    setTheme
  }
})
