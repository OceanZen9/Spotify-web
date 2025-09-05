<template>
  <div id="app">
    <div v-if="isLoggedIn && userProfile" class="profile-container">
      <h1>欢迎, {{ userProfile.display_name }}</h1>
      <img
        v-if="profile.images && userProfile.images.length > 0"
        :src="profile.images[0].url"
        class="avatar"
        alt="User Avatar"
      />
      <ul>
        <li><strong>用户名:</strong> {{ userProfile.id }}</li>
        <li>
          <strong>邮箱:{{ userProfile.email }}</strong>
        </li>
        <li>
          Spotify主页：
          <a href="userProfile.external_urls.spotify" target="_blank">{{
            userProfile.url
          }}</a>
        </li>
      </ul>
      <button @click="handleLogout" class="button">退出登陆</button>
    </div>

    <div v-else-if="isLoading" class="loading-container">
      <h2>正在认证，请稍后</h2>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>出现错误</h2>
      <p>{{ error }}</p>
      <button @click="handleLogin" class="button">重试</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isLoading = computed(() => store.state.isLoading);
const isLoggedIn = computed(() => store.state.isLoggedIn);
const userProfile = computed(() => store.state.userProfile);
const error = computed(() => store.state.error);

const handleLogin = () => {
  store.dispatch("login");
};
const handleLogout = () => {
  store.dispatch("logout");
};
const handleAuthCallback = (code) => {
  store.dispatch("handleAuthCallback", code);
};

onMounted(() => {
  const parms = new URLSearchParams(window.location.search);
  const code = parms.get("code");
  if (code) {
    handleAuthCallback(code);
    window.history.pushState({}, document.title, window.location.pathname);
  }
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  justify-content: center;
}
.profile-container,
.login-container,
.loading-container,
.error-container {
  border: 1px solid #ccc;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
}
.avatar {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin: 1rem 0;
}
ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
}
li {
  padding: 0.5rem 0;
}
.button {
  background-color: #1db954; /* Spotify Green */
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}
.button:hover {
  background-color: #1ed760;
}
</style>
