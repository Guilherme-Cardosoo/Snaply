<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const credentials = ref({ username: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const password = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  const result = await authStore.login(credentials.value)
  if (result) loading.value = false

  if (result.success) {
    router.push('/feed')
  } else if (result.error) {
    const backendError = result.error
    if (backendError.non_field_errors) {
      error.value = backendError.non_field_errors.join(', ')
    } else if (backendError.username) {
      error.value = backendError.username[0]
    } else if (backendError.password) {
      error.value = backendError.password[0]
    } else {
      error.value = backendError.detail || 'Credenciais inválidas. Tenta de novo!'
    }
  } else {
    error.value = 'Falha no login. Verifica username/senha?'
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <h1 class="social-logo">SNAPLY</h1>
      <input v-model="credentials.username" type="text" placeholder="Usuário" required autocomplete="username"/>
      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          v-model="credentials.password"
          class="password-input"
        />
        <i
          :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          class="toggle-password-icon"
          @click="showPassword = !showPassword"
        ></i>
      </div>
      <p class="signup-link">
        Não possui uma conta?
        <router-link to="/register">Cadastre-se aqui</router-link>
      </p>
      <button type="submit">Entrar</button>
      <div v-if="loading" class="spinner"></div>
      <p v-if="loading" class="text-gray-600 text-center max-w-sm">
        ⏳ O servidor está iniciando... isso pode levar até <strong>2 minutos</strong> no primeiro acesso.
      </p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>

.social-logo {
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: 8px;
  background: var(--elements);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--page);
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
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
  color: var(--text);
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

input::placeholder {
  color: #7a7a7a;
}

input:focus {
  border-color: var(--elements);
  outline: none;
}

.signup-link {
  font-size: 0.95rem;
  text-align: center;
  color: var(--text);
}

.signup-link a {
  color: var(--elements);
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

button {
  width: 100%;
  padding: 14px;
  background: var(--elements);
  color: var(--text2);
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

.spinner {
  width: 18px;
  height: 18px;
  border: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>