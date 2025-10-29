import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'claro',
  }),

  actions: {
    setTheme(theme) {
      const validThemes = ['claro', 'escuro', 'dark']
      if (!validThemes.includes(theme)) {
        console.warn(`Tema inválido: ${theme}`)
        return
      }

      this.theme = theme
      localStorage.setItem('theme', theme)

      document.body.classList.remove('claro', 'escuro', 'dark')

      document.body.classList.add(theme)
    },

    initTheme() {
      this.setTheme(this.theme)
    },
  },
})

