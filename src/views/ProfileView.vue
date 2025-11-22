<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()

const userId = route.params.id
const user = ref(null)
const userPosts = ref([])
const loading = ref(true)
const error = ref('')
const isFollowing = ref(false)

const handleImgError = (e) => {
  e.target.src = '/static/default-avatar.png'
}

onMounted(async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }
  await authStore.restoreAuth()
  await loadProfile()
})

const loadProfile = async () => {
  loading.value = true
  error.value = ''
  const API_BASE = import.meta.env.VITE_API_BASE
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    const [userRes, postsRes] = await Promise.all([
      axios.get(`${API_BASE}users/${userId}/`, { headers }),
      axios.get(`${API_BASE}posts/?author=${userId}`, { headers })
    ])

    user.value = userRes.data

    userPosts.value = postsRes.data.map(p => ({
      ...p,
      liked_by_user: p.liked_by_user || false
    }))

    if (!authStore.user?.following_count) {
      authStore.user.following_count = 0
    }
    if (user.value.id === authStore.user?.id) {
      authStore.user.following_count = user.value.following_count || 0
    }

    if (user.value.id !== authStore.user?.id && authStore.user) {
      try {
        const statusRes = await axios.get(`${API_BASE}users/${userId}/is_following/`, { headers })
        isFollowing.value = statusRes.data.is_following
      } catch (statusErr) {
        console.warn('Erro ao checar follow status:', statusErr)
        isFollowing.value = false
      }
    }
  } catch (err) {
    console.error('Erro ao carregar perfil:', err)
    if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      authStore.logout()
      router.push('/login')
    } else if (err.response?.status === 404) {
      error.value = 'Usuário não encontrado'
    } else {
      error.value = err.response?.data?.detail || 'Erro ao carregar perfil'
    }
  } finally {
    loading.value = false
  }
}

const likePost = async (id) => {
  const headers = { Authorization: `Bearer ${authStore.token}` }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE}posts/${id}/like/`,
      {},
      { headers }
    )

    const post = userPosts.value.find(p => p.id === id)
    if (!post) return

    if (response.data.message === 'Curtiu!') {
      post.likes_count++
      post.liked_by_user = true
    } else {
      post.likes_count = Math.max(0, post.likes_count - 1)
      post.liked_by_user = false
    }

  } catch (error) {
    console.error('Erro ao curtir no profile:', error)
  }
}


const toggleFollowUser = async () => {
  const previousIsFollowing = isFollowing.value
  const API_BASE = import.meta.env.VITE_API_BASE
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    const response = await axios.post(`${API_BASE}users/${userId}/toggle_follow/`, {}, { headers })
    isFollowing.value = response.data.is_following
    user.value.followers_count = response.data.followers_count

    if (authStore.user) {
      const newFollowingCount = response.data.following_count
      authStore.user.following_count = newFollowingCount
      if (user.value.id === authStore.user.id) {
        user.value.following_count = newFollowingCount
      }
    }

  } catch (err) {
    console.error('Erro no toggle follow:', err)
    isFollowing.value = previousIsFollowing
    alert('Erro ao alterar follow')
  }
}

const startDM = async (targetUserId) => {
  if (!targetUserId || targetUserId === authStore.user?.id) {
    alert('Não pode enviar mensagem pra si mesmo!')
    return
  }
  const API_BASE = import.meta.env.VITE_API_BASE
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    const res = await axios.post(`${API_BASE}conversations/create/${targetUserId}/`, {}, { headers })
    router.push(`/directs/${res.data.id}`)
  } catch (err) {
    console.error('Erro ao iniciar DM:', err)
    if (err.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    } else {
      alert('Erro ao iniciar DM')
    }
  }
}

const deletePost = async (id) => {
  if (!confirm('Tem certeza que quer deletar este post?')) return
  const API_BASE = import.meta.env.VITE_API_BASE
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    await axios.delete(`${API_BASE}posts/${id}/`, { headers })
    userPosts.value = userPosts.value.filter(p => p.id !== id)
    alert('Post deletado com sucesso!')
  } catch (err) {
    console.error('Erro ao deletar post:', err)
    alert('Erro ao deletar post.')
  }
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-BR')
</script>


<template>
  <div class="profile-container">
    <div v-if="loading" class="loading">Carregando perfil...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!user" class="not-found">
      Usuário não encontrado!
    </div>
    <div v-else class="profile">
      <div class="profile-header">
        <img 
          v-if="user.profile_picture" 
          :src="user.profile_picture" 
          alt="Foto de Perfil" 
          class="profile-img" 
          @error="handleImgError"
        />
        <img 
          v-else 
          src="/static/default-avatar.png" 
          alt="Avatar Padrão" 
          class="profile-img" 
        />
        <h2>{{ user.username }}</h2>
        <p class="bio">{{ user.bio || '' }}</p>
        <div class="stats">
          <span>{{ userPosts.length }} posts</span>
          <span>{{ user.followers_count || 0 }} seguidores</span>
          <span>{{ user.following_count || 0 }} seguindo</span>
        </div>
        
        <div v-if="user.id !== authStore.user?.id" class="profile-actions">
          <button 
            @click="toggleFollowUser" 
            :class="['follow-btn', { 'unfollow': isFollowing }]">
            {{ isFollowing ? 'Deixar de seguir' : 'Seguir' }}
          </button>
          <button @click="startDM(user.id)" class="dm-btn">Mensagem</button>
        </div>
        
        <div v-else class="profile-actions">
          <router-link to="/edit-profile" class="edit-profile-btn">Editar Perfil</router-link>
        </div>
      </div>
      <div v-if="userPosts.length === 0" class="empty-posts">
        Nenhum post ainda.
      </div>
      <div v-else class="posts-list">
        <div v-for="post in userPosts" :key="post.id" class="post-card">
          <div class="post-header">
            <h3>{{ post.author?.username || user.username }}</h3>
            <small>{{ formatDate(post.created_at) }}</small>
          </div>
          <p class="post-content">{{ post.content }}</p>
          <div class="post-actions">
            <button @click="likePost(post.id)" class="icon-btn">
              <i 
              :class="[
                post.liked_by_user ? 'fas fa-heart liked heart-pop' : 'far fa-heart'
              ]"
              ></i>
            </button>
            <button @click="$router.push(`/post/${post.id}`)" class="icon-btn">
              <i class="far fa-comment"></i>
            </button>
            <template v-if="post.author?.id === authStore.user?.id">
              <button @click="$router.push(`/post/${post.id}/edit`)" class="icon-btn">
                <i class="far fa-edit"></i>
              </button>
              <button @click="deletePost(post.id)" class="icon-btn delete">
                <i class="far fa-trash-alt"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-img {
  width: 115px;
  height: 115px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid var(--elements);
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

button {
  padding: 10px 23px;
}

.profile-header {
  text-align: center;
  border-bottom: 1px solid #999;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.profile-header h2 {
  color: var(--text);
  margin-top: 10px;
  margin-bottom: 20px;
}

.bio {
  color: var(--text);
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
  color: var(--text);
}

.follow-btn {
  background: transparent;
  color: #00ff88;
  border: 1px solid #00ff88;
  padding: 8px 16px;
  border-radius: 13px;
}

.follow-btn.unfollow {
  background: transparent;
  color: #ec1919;
  border: 1px solid #ec1919;
  padding: 8px 16px;
  border-radius: 13px;
}

.profile-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}

.dm-btn {
  background: transparent;
  color: #0f67cc;
  border: 1px solid #0f67cc;
  padding: 8px 16px;
  border-radius: 13px;
}

.edit-profile-btn {
  background: var(--page);
  color: var(--elements);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 13px;
  border: 1px solid var(--elements);
}

.post-card {
  border: 1px solid #999;
  border-radius: 13px;
  padding: 15px;
  margin-bottom: 15px;
  color: var(--text);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text);
  margin-bottom: 15px;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 1.3rem;
  color: #999;
  display: flex;
  align-items: center;
}

.icon-btn .liked {
  color: #ec1919;
}

.delete i {
  color: #ec1919;
}

.post-actions {
  display: flex;
  gap: 18px;
  margin-top: 20px;
  align-items: center;
}

.loading,
.error,
.not-found,
.empty-posts {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error { 
  color: red;
}

.heart-pop {
  animation: pop 0.25s ease;
}

@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.35); }
  100% { transform: scale(1); }
}
</style>