<template>
  <div id="app">
    <h1>my spotify-web-player</h1>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "App",

  computer: {
    ...mapState(["isLoading", "error", "artist"]),
  },
  mounted() {
    this.$store.dispatch("fetchArtist", "2CYhavOjsRPhVOjejoA6bT");
  },
};
</script>
<style lang="scss"></style>
