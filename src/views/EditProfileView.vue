<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ bio: '' })
const profilePictureInput = ref(null)
const profilePictureFile = ref(null)
const profilePictureUrl = ref('')
const loading = ref(true)
const error = ref('')
const saving = ref(false)

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
  try {
    const response = await axios.get(`${API_BASE}users/me/`)
    form.value.bio = response.data.bio || ''
    if (response.data.profile_picture) {
      profilePictureUrl.value = response.data.profile_picture
    }
  } catch (err) {
    console.error('Erro ao carregar perfil:', err)
    if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      authStore.logout()
      router.push('/login')
    } else {
      error.value = err.response?.data?.detail || 'Erro ao carregar perfil'
    }
  } finally {
    loading.value = false
  }
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    profilePictureFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => { profilePictureUrl.value = e.target.result }
    reader.readAsDataURL(file)
  } else {
    profilePictureFile.value = null
    profilePictureUrl.value = ''
  }
}

const saveProfile = async () => {
  saving.value = true
  error.value = ''
  const API_BASE = import.meta.env.VITE_API_BASE
  try {
    const formData = new FormData()
    formData.append('bio', form.value.bio.trim() || '')  
    if (profilePictureFile.value) {
      formData.append('profile_picture', profilePictureFile.value) 
    }
    
    // Debug: Log FormData contents
    console.log('Enviando FormData:', { bio: formData.get('bio'), hasFile: !!profilePictureFile.value })
    
    const response = await axios.patch(`${API_BASE}users/me/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    authStore.user = { ...authStore.user, ...response.data }
    profilePictureUrl.value = response.data.profile_picture || ''
    alert('Perfil atualizado com sucesso!')
    router.push(`/profile/${authStore.user.id}`)
  } catch (err) {
    console.error('Erro ao salvar:', err)
    console.log('Erro response:', err.response?.data)  
    if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      authStore.logout()
      router.push('/login')
    } else if (err.response?.status === 400) {
      const backendError = err.response.data
      if (backendError.profile_picture) {
        error.value = backendError.profile_picture[0]
      } else if (backendError.bio) {
        error.value = backendError.bio[0]
      } else {
        error.value = backendError.detail || 'Erro de validação. Verifique os campos.'
      }
    } else {
      error.value = err.response?.data?.detail || 'Erro ao salvar perfil'
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="edit-profile-page">
    <section v-if="loading" class="loading">Carregando...</section>
    <section v-else-if="error" class="error">{{ error }}</section>
    <section v-else class="form-section">
      <div class="image-upload">
        <div class="profile-wrapper">
          <img
            :src="profilePictureUrl || '/default-profile.png'"
            alt="Foto atual"
            class="profile-preview"
          />
        </div>
        <label class="upload-btn">
          Alterar foto
          <input 
            ref="profilePictureInput"
            type="file"
            accept="image/*"
            hidden
            @change="onFileChange"
          />
        </label>
      </div>
      <label class="label">Nova Bio</label>
      <textarea
        v-model="form.bio"
        maxlength="60"
        placeholder="Fale um pouco sobre você..."
      ></textarea>
      <small class="bio-counter">{{ form.bio.length }}/60</small>
      <div class="buttons">
        <button class="cancel-btn" type="button" @click="$router.go(-1)">
          Cancelar
        </button>
        <button class="save-btn" type="submit" @click.prevent="saveProfile" :disabled="saving">
          Salvar
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.edit-profile-page {
  margin-left: 21px;
  flex-direction: column;
  align-items: center;
  padding: 19vh 18px;
  position: relative;
}

.loading {
  margin-top: 0px;
  color: var(--text-secondary);
}
.error {
  margin-top: 50px;
  color: red;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 290px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.profile-wrapper {
  margin-left: 20px;
  width: 115px;
  height: 115px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--elements);
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  margin-left: 20px;
  margin-top: 24px;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--elements);
  padding: 9px 19px;
  border: 1px solid var(--elements);
  border-radius: 13px;
}

.label {
  font-size: 1.2rem;
  margin-left: 13.5vh;
  color: var(--elements);
}

textarea {
  width: 100%;
  padding: 12px;
  border-radius: 13px;
  border: 1px solid var(--elements);
  background: var(--page);
  color: var(--text);
  min-height: 100px;
  font-size: 1rem;
}

textarea::placeholder {
  color: #999;
}

textarea:focus {
  border-color: var(--elements); 
  outline: none;               
  box-shadow: none;             
}

.bio-counter {
  margin-left: 14px;
  font-size: 1rem;
  margin-top: -35px;
  color: #999;
}

.buttons {
  display: flex;
  margin-left: 33px;
  gap: 50px;
  margin-top: 20px;
}

.cancel-btn {
  background: var(--page);
  color: #d42929;
  padding: 13px 20px;
  border-radius: 13px;
  border: 1px solid #d42929;
  font-weight: 600;
}

.save-btn {
  background: var(--page);
  color: #00ff88;
  padding: 13px 20px;
  border-radius: 13px;
  border: 1px solid #00ff88;
  font-weight: 600;
}

</style>


