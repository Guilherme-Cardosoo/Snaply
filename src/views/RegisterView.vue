<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const loading = ref(false)
const registering = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  if (credentials.value.password.length < 6) {
    error.value = 'Senha deve ter pelo menos 6 caracteres.'
    loading.value = false
    return
  }

  if (credentials.value.password !== credentials.value.confirmPassword) {
    error.value = 'As senhas não coincidem.'
    loading.value = false
    return
  }

  try {
    registering.value = true

    const response = await axios.post(`${API_BASE}users/`, {
      username: credentials.value.username,
      email: credentials.value.email,
      password: credentials.value.password
    })

    if (response) loading.value = false

    await authStore.login({
      username: credentials.value.username,
      password: credentials.value.password
    })

    if (authStore.user) {
      router.push('/feed')
    } else {
      error.value = 'Cadastro ok, mas login falhou.'
    }
  } catch (err) {
    console.error('Erro no cadastro:', err)

    const backend = err.response?.data || {}

    error.value =
      backend.username?.[0] ||
      backend.email?.[0] ||
      backend.password?.[0] ||
      backend.detail ||
      'Erro no cadastro.'
  } finally {
    registering.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <form @submit.prevent="handleRegister">
      <h1 class="social-logo">SNAPLY</h1>

      <input v-model="credentials.username" type="text" placeholder="Usuário" required />

      <input v-model="credentials.email" type="email" placeholder="E-mail" required />

      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          v-model="credentials.password"
        />
        <i
          :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          class="toggle-password-icon"
          @click="showPassword = !showPassword"
        ></i>
      </div>

      <div class="password-wrapper">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirmar senha"
          v-model="credentials.confirmPassword"
        />
        <i
          :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          class="toggle-password-icon"
          @click="showConfirmPassword = !showConfirmPassword"
        ></i>
      </div>

      <button type="submit" :disabled="registering">Cadastrar</button>

      <div v-if="loading" class="spinner"></div>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="signup-link">
        Já tem conta?
        <router-link to="/login">Faça Login</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

.social-logo {
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: 8px;
  background: var(--elements);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--page);
  font-family: 'Poppins', sans-serif;
}

form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
}

input {
  width: 100%;
  padding: 14px;
  border-radius: 13px;
  border: 2px solid #c9c9c9;
  color: var(--darktext);
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:focus {
  border-color: var(--elements);
  outline: none;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  padding-right: 45px;
}

.toggle-password-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #7a7a7a;
  font-size: 1rem;
  padding: 4px 6px;
}

button {
  width: 100%;
  padding: 14px;
  background: var(--elements);
  color: var(--messagetext);
  border: none;
  border-radius: 13px;
  font-size: 1.5rem;
  font-weight: 600;
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

.signup-link {
  font-size: 0.95rem;
  text-align: center;
  color: var(--text);
}

.signup-link a {
  color: var(--elements);
  font-weight: 600;
  text-decoration: none;
}
</style>
