<template>
  <footer class="footer">
    <router-link to="/home" class="icon">
      <i class="fa-solid fa-house"></i>
    </router-link>

    <button class="icon new-post">
      <i class="fa-solid fa-plus"></i>
    </button>

    <router-link to="/profile" class="icon">
      <i class="fa-solid fa-user"></i>
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
}

.new-post {
  font-size: 2.4rem;
}
</style>
