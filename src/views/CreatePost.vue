<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/stores/user"
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()
const currentUser = ref(null)
const postContent = ref('')

onMounted(() => {
  currentUser.value = userStore.user
})

const goBack = () => {
  router.back()
}

const submitPost = async () => {
  if (!postContent.value.trim()) return
  try {
    await axios.post('http://localhost:8000/api/posts/', {
      content: postContent.value
    }, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    router.push('/feed')
  } catch (err) {
    console.error('Erro ao criar post:', err)
  }
}
</script>

<template>
  <div class="create-post-container">
    <header class="header">
      <button @click="goBack" class="back-btn"> Voltar
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>
      <button 
        :disabled="!postContent.trim()" 
        class="post-btn"
        @click="submitPost"
      >
        Postar
      </button>
    </header>

    <div class="content">
      <img
        v-if="currentUser?.profile_picture"
        :src="currentUser.profile_picture"
        alt="user"
        class="avatar"
      />
      <div class="textarea-wrapper">
        <textarea
          v-model="postContent"
          placeholder="O que está acontecendo?"
          maxlength="280"
        ></textarea>
        <div class="bottom-info">
          <span class="char-count">{{ postContent.length }}/280</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-post-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--page);
  color: var(--text);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid gray;
}

.header h2 {
  font-size: 18px;
  font-weight: 700;
}

.back-btn {
  background: none;
  border: none;
  color: var(--elements);
  font-size: 20px;
}

.post-btn {
  background: var(--elements);
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  color: var(--text2);
  font-weight: 600;
  cursor: pointer;
}

.post-btn:disabled {
  background: var(--elements2);
  cursor: default;
}

.content {
  display: flex;
  padding: 16px;
  gap: 12px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.textarea-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 18px;
  resize: none;
  min-height: 120px;
}

.bottom-info {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

.char-count {
  color: gray;
  font-size: 14px;
}
</style>
