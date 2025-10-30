<script setup>
import HeaderComponent from '../components/HeaderComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import profilePic from '@/assets/imgs/ProfileTest.jpeg'

const user = {
  name: 'Guilherme Cardoso',
  username: '@guilherme',
  profileImage: profilePic,
  posts: 0,
  followers: 86,
  following: 67,
}
</script>

<template>
  <div class="profile-page">
    <HeaderComponent />
    <section class="profile-header">
      <img :src="user.profileImage" alt="Foto de perfil" class="profile-image" />

      <div class="profile-info">
        <h2 class="name">{{ user.name }}</h2>
        <p class="username">{{ user.username }}</p>

        <div class="stats">
          <div class="stat">
            <span class="number">{{ user.posts }}</span>
            <span class="label">Posts</span>
          </div>
          <div class="stat">
            <span class="number">{{ user.followers }}</span>
            <span class="label">Seguidores</span>
          </div>
          <div class="stat">
            <span class="number">{{ user.following }}</span>
            <span class="label">Seguindo</span>
          </div>
        </div>
      </div>
    </section>

    <hr class="divider" />

    <section class="posts">
      <p class="empty-posts">Nenhum post ainda...</p>  <!-- mudar depois -->
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
  margin-top: 50px;
}

.stats {
  display: flex;
  justify-content: space-around;
  flex: 1;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.number {
  font-weight: 700;
  font-size: 1.3rem;
}

.label {
  font-size: 1rem;
  color: gray;
}

.profile-info {
  margin-top: 13px;
  
}

.name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.username {
  font-size: 1rem;
  color: gray;
  margin: 8px 0 17px;
}

.divider {
  width: 100%;
  margin: 25px 0;
  border: none;
  border-top: 1px solid var(--elements);
  opacity: 0.5;
}

.posts {
  width: 100%;
  text-align: center;
}

.empty-posts {
  color: gray;
  font-size: 1.3rem;
}
</style>

