<template>
  <div id="app">
    <div v-if="profile">
      <h1>欢迎, {{ profile.display_name }}</h1>
      <img
        v-if="profile.images[0]"
        :src="profile.images[0].url"
        width="200"
        alt="Avatar"
      />
      <p>ID: {{ profile.id }}</p>
      <p>Email: {{ profile.email }}</p>
      <p>
        URI: <a :href="profile.external_urls.spotify">{{ profile.uri }}</a>
      </p>
    </div>
    <div v-else>
      <h1>请登录您的Spotify账号</h1>
      <button @click="handleLogin">使用Spotify登录</button>
    </div>
  </div>
</template>

<script>
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  fetchProfile,
} from "./services/spotify";
export default {
  data() {
    return {
      profile: null,
    };
  },
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      try {
        const accessToken = await getAccessToken(code);
        this.profile = await fetchProfile(accessToken);
        window.history.pushState({}, document.title, "/");
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    }
  },
  methods: {
    handleLogin() {
      redirectToAuthCodeFlow();
    },
  },
};
</script>
<style lang="scss"></style>
