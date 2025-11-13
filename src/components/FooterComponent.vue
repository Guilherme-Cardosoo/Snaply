<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const newPostActive = ref(false)

function toggleNewPost() {
  newPostActive.value = !newPostActive.value

}
</script>

<template>
  <footer class="footer">
    <router-link
      to="/home"
      class="icon"
      :class="{ active: $route.path === '/home' }"
    >
      <i v-if="$route.path !== '/home'" class="fa-regular fa-house"></i>
      <i v-else class="fa-solid fa-house"></i>
    </router-link>

    <button
      class="icon new-post"
      :class="{ active: newPostActive }"
      @click="toggleNewPost"
      aria-label="Novo post"
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <router-link
      to="/messages"
      class="icon"
      :class="{ active: $route.path === '/messages' }"
    >
      <i v-if="$route.path !== '/messages'" class="fa-regular fa-comment-dots"></i>
      <i v-else class="fa-solid fa-comment-dots"></i>
    </router-link>

    <router-link
      to="/profile"
      class="icon"
      :class="{ active: $route.path === '/profile' }"
    >
      <i v-if="$route.path !== '/profile'" class="fa-regular fa-user"></i>
      <i v-else class="fa-solid fa-user"></i>
    </router-link>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: var(--page);
  border-top: 1px solid var(--elements);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1002;
}

.icon {
  color: var(--elements);
  font-size: 1.8rem;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, color 0.15s ease, text-shadow 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.new-post {
  font-size: 2.4rem;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.new-post i {
  line-height: 1;
}

.new-post.active {
  transform: scale(1.05);
  color: var(--accent, #00ff88);
}

.new-post.active i {
  text-shadow:
    0 0 0.6px currentColor,
    0 0 1.2px currentColor,
    0 0 1.8px currentColor;
  transform: scale(1.05);
}

.icon.active {
  color: var(--accent, var(--elements));
  transform: scale(1.12);
}

@media (max-width: 420px) {
  .new-post { font-size: 2.2rem; width: 52px; height: 52px; }
  .icon { font-size: 1.6rem; }
}
</style>
