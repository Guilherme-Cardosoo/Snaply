<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const authStore = useAuthStore()

const API_BASE = import.meta.env.VITE_API_BASE

const search = ref("")
const users = ref([])
const filteredUsers = ref([])
const loading = ref(true)

onMounted(async () => {
  if (!authStore.token) {
    router.push("/login")
    return
  }
  await loadUsers()
})

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE}users/`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = res.data
    filteredUsers.value = res.data
  } catch (err) {
    console.error("Erro ao carregar usuários:", err)
  } finally {
    loading.value = false
  }
}

const filterUsers = () => {
  const term = search.value.toLowerCase()
  filteredUsers.value = users.value.filter(u =>
    u.username.toLowerCase().includes(term)
  )
}

const openChat = async (userId) => {
  try {
    const res = await axios.post(
      `${API_BASE}conversations/create/${userId}/`,
      {},
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )

    const conversationId = res.data.id
    router.push(`/directs/${conversationId}`)
  } catch (err) {
    console.error("Erro ao abrir conversa:", err)
    alert("Erro ao abrir conversa")
  }
}
</script>

<template>
  <div class="directs-container">
    <input
      v-model="search"
      @input="filterUsers"
      class="search-input"
      type="text"
      placeholder="Pesquisar usuário..."
    />

    <div v-if="loading" class="loading">Carregando usuários...</div>

    <div v-else class="users-list">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="user-item"
        @click="openChat(user.id)"
      >
        <img
          v-if="user.profile_picture"
          :src="user.profile_picture"
          class="avatar"
        />
        <img
          v-else
          src="/static/default-avatar.png"
          class="avatar"
        />

        <span class="username">{{ user.username }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.directs-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 15px;
}

.search-input {
  width: 93%;
  padding: 12px;
  border-radius: 13px;
  background: var(--page);
  color: var(--text);
  border: 1px solid #c9c9c9;
  margin-bottom: 30px;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--elements)
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 13px;
  color: var(--text);
  border: 1px solid #c9c9c9;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 1.1rem;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
