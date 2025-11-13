<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api.js'
import defaultAvatar from '@/assets/imgs/default_avatar.png'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const user = ref({
  first_name: '',
  username: '',
  bio: '',
  profile_picture: '',
  password: '',
  confirm_password: ''
})
const preview = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const token = localStorage.getItem('access')
    const response = await api.get('/users/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = {
      first_name: response.data.first_name || '',
      username: response.data.username || '',
      bio: response.data.bio || '',
      profile_picture: response.data.profile_picture || defaultAvatar,
      password: '',
      confirm_password: ''
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao carregar perfil.'
  } finally {
    loading.value = false
  }
})

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    user.value.profile_picture = file
    preview.value = URL.createObjectURL(file)
  }
}

const saveChanges = async () => {
  // Validação de senha
  if (user.value.password && user.value.password !== user.value.confirm_password) {
    alert('As senhas não coincidem!')
    return
  }

  try {
    const token = localStorage.getItem('access')
    const formData = new FormData()
    formData.append('first_name', user.value.first_name)
    formData.append('username', user.value.username)
    formData.append('bio', user.value.bio)
    if (user.value.password) formData.append('password', user.value.password)
    if (user.value.profile_picture instanceof File)
      formData.append('profile_picture', user.value.profile_picture)

    await api.patch('/users/me/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    alert('Perfil atualizado com sucesso!')
    router.push('/profile')
  } catch (err) {
    console.error(err)
    alert('Erro ao salvar alterações.')
  }
}
</script>

<template>
  <div class="edit-profile-page">
    <!-- 🔙 Seta de voltar -->
    <button class="back-btn" @click="router.push('/profile')">
      <FontAwesomeIcon icon="arrow-left" />
    </button>

    <h1>Editar Perfil</h1>

    <section v-if="loading">Carregando...</section>
    <section v-else-if="error">{{ error }}</section>

    <section v-else class="form-section">
      <div class="image-upload">
        <img
          :src="preview || user.profile_picture"
          alt="Prévia da foto"
          class="profile-preview"
        />
        <label class="upload-btn">
          Alterar foto
          <input type="file" accept="image/*" @change="handleImageUpload" hidden />
        </label>
      </div>

      <input v-model="user.first_name" placeholder="Nome" />
      <input v-model="user.username" placeholder="Usuário" />
      <textarea v-model="user.bio" placeholder="Bio"></textarea>
      <input
        v-model="user.password"
        type="password"
        placeholder="Nova senha (opcional)"
      />
      <input
        v-model="user.confirm_password"
        type="password"
        placeholder="Confirmar nova senha"
      />

      <button @click="saveChanges">Salvar Alterações</button>
    </section>
  </div>
</template>

<style scoped>
.edit-profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 15px;
  position: relative;
}

/* 🔙 Botão de voltar */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: var(--elements);
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.back-btn:hover {
  transform: translateX(-3px);
}

h1 {
  margin-top: 20px;
  margin-bottom: 30px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 80%;
  max-width: 400px;
}

input,
textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid gray;
  background: transparent;
  color: var(--elements);
  font-size: 1rem;
  resize: none;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  background: var(--elements);
  color: var(--page);
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.profile-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 8px;
  object-fit: cover;
  border: 2px solid var(--elements);
}

.upload-btn {
  font-size: 0.9rem;
  color: var(--elements);
  cursor: pointer;
  border: 1px solid var(--elements);
  border-radius: 6px;
  padding: 5px 10px;
}
.upload-btn:hover {
  background: var(--elements);
  color: var(--page);
}
</style>
