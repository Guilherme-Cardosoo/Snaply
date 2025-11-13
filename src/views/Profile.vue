<script setup>
import { ref, onMounted } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import defaultAvatar from '@/assets/imgs/default_avatar.png'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import api from '@/api/api.js'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const token = localStorage.getItem('access')
  if (!token) {
    console.error('Usuário não autenticado')
    error.value = 'Usuário não autenticado'
    loading.value = false
    return
  }

  try {
    const response = await api.get('/users/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // 🟢 garante que o perfil sempre tenha imagem e campos padronizados
    user.value = {
      first_name: response.data.first_name || '',
      username: response.data.username || response.data.email?.split('@')[0],
      email: response.data.email || '',
      bio: response.data.bio || '',
      profile_picture: response.data.profile_picture || defaultAvatar,
      followers_count: response.data.followers_count || 0,
      following_count: response.data.following_count || 0,
      posts_count: response.data.posts_count || 0
    }

  } catch (err) {
    console.error('Erro ao carregar perfil:', err)
    error.value = 'Erro ao carregar informações do perfil.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile-page">
    <HeaderComponent />

    <!-- 🔹 Estado de carregamento -->
    <section v-if="loading" class="loading">Carregando...</section>

    <!-- 🔹 Estado de erro -->
    <section v-else-if="error" class="error">{{ error }}</section>

    <!-- 🔹 Exibe o perfil somente quando user existir -->
    <section v-else-if="user" class="profile-header">
      <img
        :src="user.profile_picture"
        alt="Foto de perfil"
        class="profile-image"
      />

      <div class="profile-info">
        <div class="name-section">
          <h2 class="name">{{ user.first_name || 'Guilherme Cardoso' }}</h2>
          <button class="edit-btn" @click="$router.push('/edit-profile')">
            <FontAwesomeIcon icon="pen" />
          </button>
        </div>

        <p class="username">@{{ user.username || 'usuario' }}</p>

        <div class="stats">
          <div class="stat">
            <span class="number">{{ user.posts_count }}</span>
            <span class="label">Posts</span>
          </div>
          <div class="stat middle">
            <span class="number">{{ user.followers_count }}</span>
            <span class="label">Seguidores</span>
          </div>
          <div class="stat">
            <span class="number">{{ user.following_count }}</span>
            <span class="label">Seguindo</span>
          </div>
        </div>
        <div class="bio">
          <span class="label">bio teste</span>
        </div>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--page);
  color: var(--elements);
  min-height: 100vh;
  box-sizing: border-box;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--elements);
  margin-top: 60px;
  object-fit: cover;
}

.name-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.edit-btn {
  background: none;
  border: none;
  color: var(--elements);
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}
.edit-btn:hover {
  transform: scale(1.1);
}

.stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;  
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
} 

.stat.middle {
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  padding: 0 20px;
  margin: 0 -15px;
}

.number {
  font-weight: 700;
  font-size: 1.3rem;
}

.label {
  font-size: 1.2rem;
  color: gray;
}

.profile-info {
  margin-top: 13px;
}

.name {
  font-size: 1.4rem;
  font-weight: 700;
}

.username {
  font-size: 1rem;
  color: gray;
  margin: -13px 1px 30px;
  position: relative;
  padding-bottom: 20px;
  text-align: center;
}

.username::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  height: 1px;
  background-color: gray;
}

.loading,
.error {
  margin-top: 50px;
  font-size: 1.2rem;
  color: gray;
}

.bio {
  position: relative;
  margin-top: 40px;
  padding-bottom: 20px;
  text-align: center;
}

.bio::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  height: 1px;
  background-color: gray;
}

</style>
