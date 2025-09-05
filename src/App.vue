<template>
  <div id="app">
    <h1>my spotify-web-player</h1>
  </div>
</template>
<script>
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  fetchProfile,
  populateUI,
} from "./services/spotify";
export default {
  data() {
    return {};
  },
  async mounted() {
    const clientId = process.env.clientId; // Replace with client ID
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await getAccessToken(clientId, code);
      const profile = await fetchProfile(accessToken);
      populateUI(profile);
    }
  },
};
</script>
<style lang="scss"></style>
