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

const postId = route.params.id
const post = ref(null)
const comments = ref([])
const loading = ref(true)
const error = ref('')
const newComment = ref('')
const submitting = ref(false)

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
    const [postRes, commentsRes] = await Promise.all([
      axios.get(`${API_BASE}posts/${postId}/`),
      axios.get(`${API_BASE}posts/${postId}/comments/`)
    ])
    post.value = postRes.data
    comments.value = commentsRes.data
  } catch (err) {
    console.error('Erro ao carregar post:', err)
    error.value = err.response?.data?.detail || 'Erro ao carregar post'
    if (err.response?.status === 404) error.value = 'Post não encontrado'
    if (err.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

const likePost = async () => {
  await postsStore.likePost(postId)

  // Atualiza o post local para refletir a mudança
  post.value.liked_by_user = !post.value.liked_by_user
  if (post.value.liked_by_user) {
    post.value.likes_count++
  } else {
    post.value.likes_count--
  }
}


const addComment = async () => {
  if (!newComment.value.trim()) return
  submitting.value = true
  const API_BASE = import.meta.env.VITE_API_BASE
  try {
    const response = await axios.post(`${API_BASE}posts/${postId}/comments/`, {
      content: newComment.value
    })
    comments.value.push(response.data)
    newComment.value = ''
  } catch (err) {
    console.error('Erro ao comentar:', err)
    alert('Erro ao adicionar comentário')
  } finally {
    submitting.value = false
  }
}

const deletePost = async (id) => {
  if (!confirm('Tem certeza que quer deletar este post?')) return
  const API_BASE = import.meta.env.VITE_API_BASE
  try {
    await axios.delete(`${API_BASE}posts/${id}/`)
    alert('Post deletado!')
    router.push('/feed')
  } catch (err) {
    console.error('Erro ao deletar:', err)
    alert('Erro ao deletar post')
  }
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-BR')
</script>

<template>
  <div class="post-detail-container">
    <button @click="$router.go(-1)" class="back-btn">
      <i class="fas fa-arrow-left"></i>
    </button>
    <div v-if="loading" class="loading">Carregando post...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!post" class="not-found">Post não encontrado!</div>
    <div v-else class="post-detail">
      <div class="post-header">
        <div class="post-top">
          <h2 class="post-user">{{ post.author.username }}</h2>
          <small class="post-date">{{ formatDate(post.created_at) }}</small>
        </div>
        <p class="post-content">{{ post.content }}</p>
      </div>
      <div class="post-actions">
        <button @click="likePost" class="icon-btn">
          <i :class="[post.liked_by_user ? 'fas fa-heart liked heart-pop' : 'far fa-heart']"></i>
          <span>{{ post.likes_count || 0 }}</span>
        </button>
          <button class="icon-btn">
            <i class="far fa-comment"></i>
            <span>{{ comments.length }}</span>
          </button>
        <button 
          v-if="post.author.id === authStore.user.id" 
          @click="$router.push(`/post/${post.id}/edit`)" 
          class="icon-btn"
        >
          <i class="far fa-edit"></i>
        </button>
        <button 
          v-if="post.author.id === authStore.user.id" 
          @click="deletePost(post.id)" 
          class="icon-btn delete"
        >
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
      <form @submit.prevent="addComment" class="comment-form">
        <textarea v-model="newComment" placeholder="Adicione um comentário..." required></textarea>
        <button type="submit" :disabled="submitting">Comentar</button>
      </form>
      <div v-if="comments.length === 0" class="empty-comments">Nenhum comentário ainda. Seja o primeiro!</div>
      <div v-else class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-top">
            <strong class="comment-user">{{ comment.author.username }}</strong>
            <small class="comment-date">{{ formatDate(comment.created_at) }}</small>
          </div>
          <p class="comment-content">
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.back-btn {
  background: none;
  border: none;
  color: var(--elements);
  font-size: 1.7rem;
  padding: 20px;
  margin-bottom: 60px;
}

.post-header {
  color: var(--text);
}

.post-detail {
  padding: 0 20px;
}

.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-user {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.post-date {
  font-size: 0.9rem;
}

.post-content {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.post-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7vh;
  margin-top: 4vh;
  margin-bottom: 30px;
  border-bottom: 1px solid #c9c9c9;
  padding-bottom: 15px;
}

.icon-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.liked {
  color: #ec1919;
}

.heart-pop {
  animation: pop 0.25s ease;
}

@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.35); }
  100% { transform: scale(1); }
}


.delete {
  color: #ec1919;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-form textarea {
  min-height: 90px;
  border: 1px solid #c9c9c9;
  border-radius: 13px;
  padding: 12px;
  resize: vertical;
  font-size: 1rem;
  color: var(--text);
  background: var(--page);
  outline: none;
}

.comment-form textarea:focus {
  border-color: var(--elements);
}

.comment-form button {
  align-self: flex-end;
  background: var(--page);
  color: var(--elements);
  border: 1px solid var(--elements);
  border-radius: 13px;
  font-size: 1.1rem;
  height: 30px;
}

.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #c9c9c9;
  color: var(--text);
}

.comment-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-user {
  font-weight: bold;
  font-size: 1rem;
}

.comment-date {
  font-size: 0.9rem;
}

.comment-content {
  margin-top: 10px;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--text);
}

.loading, 
.error, 
.not-found, 
.empty-comments { 
  text-align: center; 
  padding: 40px; 
  color: #666; 
}

.error { 
  color: red; 
}
</style>
