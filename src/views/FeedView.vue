<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const postsStore = usePostsStore()
const authStore = useAuthStore()
const newPostContent = ref('')
const deletingId = ref(null)

onMounted(async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }
  await postsStore.fetchFeed()
})

const createPost = async () => {
  if (!newPostContent.value.trim()) return
  await postsStore.createPost(newPostContent.value)
  newPostContent.value = ''
}

const likePost = (id) => postsStore.likePost(id)

const deletePost = async (id) => {
  if (!confirm('Tem certeza que quer deletar este post?')) return
  deletingId.value = id
  const API_BASE = import.meta.env.VITE_API_BASE
  try {
    await axios.delete(`${API_BASE}posts/${id}/`)
    alert('Post deletado!')
    await postsStore.fetchFeed()
    await nextTick()
  } catch (err) {
    console.error('Erro ao deletar:', err)
    alert('Erro ao deletar post')
  } finally {
    deletingId.value = null
  }
}

const getCommentsCount = (post) => {
  return post.comments ? post.comments.length : 0;
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-BR')

const handleImgError = (event) => {
  event.target.src = '/static/default-avatar.png'
}
</script>

<template>
  <div class="feed-container">
    <div v-if="authStore.loading" class="loading">Entrando...</div>
    <div v-else-if="!authStore.token">
      <p>Faça login pra ver o feed!</p>
      <router-link to="/login">Ir pro Login</router-link>
    </div>
    <div v-else>
      <form @submit.prevent="createPost" class="new-post-form">
        <textarea v-model="newPostContent" placeholder="O que você está pensando hoje?" required></textarea>
        <button type="submit" :disabled="postsStore.loading">Postar</button>
      </form>

      <div v-if="postsStore.loading" class="loading">Carregando posts...</div>
      <div v-else-if="postsStore.error" class="error">{{ postsStore.error }}</div>
      <div v-else-if="postsStore.posts.length === 0" class="empty-feed">
        Nenhum post ainda. Siga usuários ou poste algo!
      </div>
      <div v-else class="posts-list">
        <div v-for="post in postsStore.posts" :key="post.id" class="post-card">
          <router-link :to="`/profile/${post.author?.id || post.id}`" class="profile-link">
            <div class="post-header">
              <div class="post-user-info">
                <img 
                  v-if="post.author?.profile_picture" 
                  :src="post.author.profile_picture"
                  class="author-img"
                  @error="handleImgError"
                />
                <img 
                  v-else 
                  src="/static/default-avatar.png"
                  class="author-img"
                />
                <div class="user-text">
                  <h3>{{ post.author?.username || 'Usuário desconhecido' }}</h3>
                  <small>{{ formatDate(post.created_at) }}</small>
                </div>
              </div>
            </div>
          </router-link>
          <p class="post-content">{{ post.content }}</p>
          <div class="post-actions">
            <button @click="likePost(post.id)" class="icon-btn">
              <i 
                :class="[
                  post.liked_by_user ? 'fas fa-heart liked heart-pop' : 'far fa-heart'
                ]"
              ></i>
            </button>
            <button @click="$router.push(`/post/${post.id}`)" class="icon-btn comment-btn">
              <i class="far fa-comment"></i>
              <span class="comment-count">{{ getCommentsCount(post) }}</span>
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
.userPost{
  display: flex;
  gap: 5px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: var(--text);
}

.post-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15vh;
}

.user-text h3,
.user-text small {
  margin: 0;
  font-size: 1rem;
}

.author-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.post-actions {
  display: flex;
  margin-left: 30px;
  align-items: center;
}

.post-actions .icon-btn {
  margin-right: 25px;
}

.error {
    color: red;
    text-align: center;
    padding: 20px;
}

.warning {
    color: orange;
    font-style: italic;
}

.feed-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.new-post-form textarea {
    width: 93%;
    min-height: 100px;
    padding: 10px;
    background-color: var(--page);
    color: var(--text);
    border: 1px solid #999;
    border-radius: 13px; 
    resize: vertical;   
}

.new-post-form textarea:focus {
  outline: none;
  border-color: var(--elements);
}

.new-post-form button {
    background: var(--page);
    color: var(--elements);
    border: 1px solid var(--elements);
    border-radius: 13px;
    padding: 10px;
    margin-left: 33vh;
    margin-top: 25px;
    margin-bottom: 10px;
}

.post-card {
  border: 1px solid #999;
  border-radius: 13px;
  padding: 15px;
  margin-top: 20px;
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

.profile-link {
  text-decoration: none !important;
  color: inherit;
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

.comment-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.comment-count {
  font-size: 1.1rem;
  color: #999;
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
.empty-feed {
    text-align: center;
    padding: 40px;
    color: #666;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
