<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const users = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

onMounted(async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }
  await loadUsers()
})

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  const API_BASE = import.meta.env.VITE_API_BASE

  try {
    const response = await axios.get(`${API_BASE}users/`)
    users.value = response.data
  } catch (err) {
    console.error('Erro ao carregar usuários:', err)
    error.value = err.response?.data?.detail || 'Erro ao carregar usuários'
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value
  return users.value.filter(u =>
    u.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleImgError = (e) => {
  e.target.src = '/static/default-avatar.png'
}
</script>

<template>
  <div class="user-list-container">
    <header>
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="Pesquisar usuário..."
        type="text"
      />
    </header>
    <div v-if="loading" class="loading">Carregando usuários...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredUsers.length === 0" class="empty">Nenhum usuário encontrado.</div>
    <div v-else class="users-list">
      <router-link
        v-for="u in filteredUsers"
        :key="u.id"
        :to="`/profile/${u.id}`" || "/static/default-avatar.png"
        class="user-item"
      >
      <!--  <img
          v-else
          src="/static/default-avatar.png"
          class="avatar"
        /> -->
        <div class="user-info">
          <div class="username">{{ u.username }}</div>

          <div class="stats-row">
            <div class="stat">
              <span class="number">{{ u.posts_count || 0 }}</span>
              <span class="label">posts</span>
            </div>
            <div class="stat">
              <span class="number">{{ u.followers_count || 0 }}</span>
              <span class="label">seguidores</span>
            </div>
            <div class="stat">
              <span class="number">{{ u.following_count || 0 }}</span>
              <span class="label">seguindo</span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  width: 90%;
  padding: 12px 16px;
  border-radius: 13px;
  border: 1px solid #c9c9c9;
  background: var(--page);
  color: var(--text);
  font-size: 1rem;
  margin-bottom: 30px;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  outline: none;
  border-color: var(--elements);
}

.user-list-container {
  max-width: 650px;
  margin: 0 auto;
  padding: 25px;
}

.user-item {
  display: flex;
  gap: 18px;
  padding: 18px 10px;
  border-bottom: 1px solid #999;
  text-decoration: none;
  color: var(--text);
}

.user-img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.stats-row {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}

.number {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  color: #888;
}

.error {
  color: #ff4d4d;
}
</style>
