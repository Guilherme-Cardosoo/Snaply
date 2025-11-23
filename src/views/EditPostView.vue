<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const postId = route.params.id
const form = ref({ content: '' })
const loading = ref(true)
const error = ref('')
const saving = ref(false)

onMounted(async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }
  await authStore.restoreAuth()
  await loadPost()
})

const loadPost = async () => {
  loading.value = true
  error.value = ''
  const API_BASE = import.meta.env.VITE_API_BASE
  try {
    const response = await axios.get(`${API_BASE}posts/${postId}/`)
    if (response.data.author.id !== authStore.user.id) {
      error.value = 'Você só pode editar seus próprios posts'
      router.push(`/post/${postId}`)
      return
    }
    form.value.content = response.data.content
  } catch (err) {
    console.error('Erro ao carregar post:', err)
    error.value = err.response?.data?.detail || 'Erro ao carregar post'
    if (err.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    } else if (err.response?.status === 403) {
      error.value = 'Acesso negado'
    }
  } finally {
    loading.value = false
  }
}

const savePost = async () => {
  if (!form.value.content.trim()) {
    error.value = 'Conteúdo não pode estar vazio'
    return
  }
  saving.value = true
  error.value = ''
  const API_BASE = import.meta.env.VITE_API_BASE
  try {
    const response = await axios.patch(`${API_BASE}posts/${postId}/`, { content: form.value.content.trim() })
    alert('Post atualizado!')
    router.push(`/post/${postId}`)
  } catch (err) {
    console.error('Erro ao salvar post:', err)
    error.value = err.response?.data?.detail || 'Erro ao salvar post'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="edit-post-container">
    <header>      
      <h1>Editar Post</h1>      
    </header>
    <div v-if="loading" class="loading">Carregando post...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <form v-else @submit.prevent="savePost" class="edit-form">
      <textarea 
        v-model="form.content" 
        placeholder="Edite o conteúdo do post..." 
        required 
        rows="5"
      ></textarea>
    </form>
  </div>
  <button class="btn-cancel" @click="$router.go(-1)">Cancelar</button>
  <button class="btn-save" @click="savePost" :disabled="saving">Salvar Alterações</button>
</template>

<style scoped>
.edit-post-container {
  max-width: 600px; 
  margin: 0 auto; 
  padding: 20px; 
}

header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  margin-left: 13.5vh;
  margin-top: 20px; 
  margin-bottom: 6vh;
  color: var(--text);
  font-weight: bold;
  font-size: 1.3rem;
}

button { 
  background: var(--page);  
  padding: 8px 20px; 
  border-radius: 13px;
  margin-left: 50px; 
}

.btn-cancel {
  color: #ec1919;
  border: 1px solid #ec1919;
}

.btn-save {
  color: #0f67cc;
  border: 1px solid #0f67cc;
}

.edit-form textarea { 
  width: 100%; 
  padding: 10px;
  background-color: var(--page);
  color: #fff; 
  border: 1px solid #c9c9c9; 
  border-radius: 13px; 
  box-sizing: border-box; 
  resize: vertical; 
}

.edit-form textarea:focus {
  outline: none;
  border-color: var(--elements);
}

.loading, .error { 
  text-align: center; 
  padding: 40px; 
  color: #666; 
}

.error { 
  color: red; 
}
</style>