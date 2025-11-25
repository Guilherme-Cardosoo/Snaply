<script setup>
import { ref, onMounted, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const API_BASE = import.meta.env.VITE_API_BASE

const conversation = ref(null)
const otherUser = ref(null)
const newMessage = ref("")
const loading = ref(true)
const sending = ref(false)

const messagesContainer = ref(null)

onMounted(() => {
  if (!authStore.token) {
    router.push("/login")
    return
  }
  loadConversation()
})

const loadConversation = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      `${API_BASE}conversations/${route.params.id}/`,
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )

    conversation.value = res.data
    otherUser.value = res.data.participants.find(
      p => p.id !== authStore.user.id
    )

    await nextTick()
    scrollToBottom()

  } catch (err) {
    console.error("Erro ao carregar conversa:", err)
    alert("Conversa não encontrada.")
    router.push("/directs")
  } finally {
    loading.value = false
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  sending.value = true

  try {
    const res = await axios.post(
      `${API_BASE}conversations/${route.params.id}/send/`,
      { content: newMessage.value },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )

    conversation.value = res.data
    newMessage.value = ""

    await nextTick()
    scrollToBottom()

  } catch (err) {
    console.error("Erro ao enviar mensagem:", err)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="chat-container">

    <header class="chat-header">
      <button class="back-btn" @click="$router.push('/directs')">
        <i class="fas fa-arrow-left"></i>
      </button>
      <img
        v-if="otherUser?.profile_picture"
        :src="otherUser.profile_picture"
        class="avatar"
      />
      <img v-else src="/static/default-avatar.png" class="avatar" />

      <h2 class="username">{{ otherUser?.username }}</h2>
    </header>

    <div class="messages" ref="messagesContainer">
      <div v-if="loading" class="loading">Carregando mensagens...</div>

      <div
        v-else
        v-for="msg in conversation.messages"
        :key="msg.id"
        :class="['message', msg.author.id === authStore.user.id ? 'sent' : 'received']"
      >
        <p class="content">{{ msg.content }}</p>
        <small class="time">
          {{ new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) }}
        </small>
      </div>
    </div>

    <footer class="chat-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Mensagem..."
        @keyup.enter="sendMessage"
        :disabled="sending"
      />
      <button class="send-btn" @click="sendMessage" :disabled="sending">
        Enviar
      </button>
    </footer>

  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #c9c9c9;
  background: var(--page);
}

.back-btn {
  background: none;
  border: none;
  font-size: 26px;
  margin-right: 10px;
  color: var(--elements);
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.username {
  font-size: 1.2rem;
  color: var(--text);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: var(--page);
}

.message {
  max-width: 70%;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
}

.sent {
  background: var(--elements);
  color: var(--text2);
  margin-left: auto;
}

.received {
  background: #e9e9e9;
  color: black;
  margin-right: auto;
}

.time {
  font-size: 0.75rem;
  margin-top: 3px;
  opacity: 0.7;
}

.chat-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #c9c9c9;
  background: var(--page);
  overflow: hidden;
  touch-action: none;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border-radius: 13px;
  border: 1px solid #c9c9c9;
  background: var(--page);
  color: var(--text);
  outline: none;

}

.chat-input input:focus {
  border-color: var(--elements);

}

.send-btn {
  margin-left: 10px;
  padding: 12px 18px;
  background: var(--elements);
  border: none;
  border-radius: 13px;
  color: var(--text2);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
