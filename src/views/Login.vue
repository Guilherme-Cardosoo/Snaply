<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api.js'

const router = useRouter()

const isSignUp = ref(false)
const fullName = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// 🔹 Função de login
const login = async () => {
  if (!username.value || !password.value) {
    alert('Preencha todos os campos!')
    return
  }

  try {
    const res = await api.post('/token/', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('access', res.data.access)
    localStorage.setItem('refresh', res.data.refresh)

    alert('Login realizado com sucesso!')
    router.push('/home')
  } catch (err) {
    console.error(err)
    alert('Usuário ou senha incorretos!')
  }
}

// 🔹 Função de cadastro
const register = async () => {
  if (!fullName.value || !username.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Preencha todos os campos!')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem!')
    return
  }

  try {
    await api.post('/users/', {
      first_name: fullName.value,
      username: username.value,
      email: email.value,
      password: password.value
})

    alert(`Conta criada com sucesso!\nBem-vindo(a), ${fullName.value}!`)
    isSignUp.value = false
  } catch (err) {
    console.error(err)
    if (err.response?.status === 400 && err.response.data?.username) {
      alert('Este nome de usuário já está em uso. Escolha outro.')
    } else {
      alert('Erro ao criar conta! Verifique os dados e tente novamente.')
    }
  }
}
</script>

<template>
  <div class="login-container">
    <h1 class="social-logo">Snaply</h1>

    <transition name="fade-slide" mode="out-in">
      <!-- 🔹 Tela de login -->
      <form
        v-if="!isSignUp"
        key="login"
        class="login-form"
        @submit.prevent="login"
      >
        <input type="text" placeholder="Email:" v-model="username" required />
        <input type="password" placeholder="Senha:" v-model="password" required />
        <button type="submit">Entrar</button>
        <p class="signup-link">
          Não possui uma conta?
          <a href="#" @click.prevent="isSignUp = true">Cadastre-se</a>
        </p>
      </form>

      <!-- 🔹 Tela de cadastro -->
      <form
        v-else
        key="signup"
        class="login-form"
        @submit.prevent="register"
      >
        <input type="text" placeholder="Nome completo:" v-model="fullName" required />
        <input type="text" placeholder="Nome de usuário:" v-model="username" required />
        <input type="email" placeholder="Email:" v-model="email" required />
        <input type="password" placeholder="Senha:" v-model="password" required />
        <input
          type="password"
          placeholder="Confirmar senha:"
          v-model="confirmPassword"
          required
        />
        <button type="submit">Cadastrar</button>
        <p class="signup-link">
          Já possui uma conta?
          <a href="#" @click.prevent="isSignUp = false">Entrar</a>
        </p>
      </form>
    </transition>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
  color: #000;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
}

.social-logo {
  font-size: 2.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 7px;
  background: #00ff88;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.login-form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form input {
  padding: 14px;
  border-radius: 10px;
  border: 2px solid #00ff88;
  color: #000;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.login-form input::placeholder {
  color: #7a7a7a;
}

.login-form input:focus {
  outline: none;
}

.login-form button {
  padding: 14px;
  background: #00ff88;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
}

.signup-link {
  margin-top: 2rem;
  font-size: 1rem;
  color: #000;
  text-align: center;
}

.signup-link a {
  color: #00ff88;
  text-decoration: none;
  font-weight: bold;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
