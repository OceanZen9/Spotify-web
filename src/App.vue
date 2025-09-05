<template>
  <div id="app">
    <div v-if="isLoggedIn && userProfile" class="profile-container">
      <h1>欢迎, {{ userProfile.display_name }}</h1>
      <img
        v-if="userProfile.images && userProfile.images.length > 0"
        :src="userProfile.images[0].url"
        class="avatar"
        alt="User Avatar"
      />
      <ul>
        <li>用户 ID: {{ userProfile.id }}</li>
        <li>邮箱: {{ userProfile.email }}</li>
        <li>
          Spotify主页:
          <a :href="userProfile.external_urls.spotify" target="_blank">{{
            userProfile.uri
          }}</a>
        </li>
      </ul>
      <button @click="handleLogout" class="button">退出登录</button>
    </div>
    <div v-else-if="isLoading" class="loading-container">
      <h2>正在认证中，请稍候...</h2>
    </div>
    <div v-else-if="error" class="error-container">
      <h2>出现错误</h2>
      <p>{{ error }}</p>
      <button @click="handleLogin" class="button">重试</button>
    </div>
    <div v-else class="login-container">
      <h1>连接您的Spotify账号</h1>
      <p>点击下方按钮，授权本应用读取您的个人信息。</p>
      <button @click="handleLogin" class="button">使用Spotify登录</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const isLoading = computed(() => store.state.isLoading);
const userProfile = computed(() => store.state.userProfile);
const error = computed(() => store.state.error);
const isLoggedIn = computed(() => store.getters.isLoggedIn);

const handleLogin = () => store.dispatch("login");
const handleLogout = () => store.dispatch("logout");
const handleAuthCallback = (code) => store.dispatch("handleAuthCallback", code);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    handleAuthCallback(code);
    window.history.pushState({}, document.title, window.location.pathname);
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
  background-color: #1db954;
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
