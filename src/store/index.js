import { createStore } from "vuex";
import { getArtistInfo } from "../services/spotify";
export default createStore({
  state: {
    artist: null,
    isLoading: false,
    error: null,
  },

  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ARTIST(state, artist) {
      state.artist = artist;
      state.error = null;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async fetchArtist(context, artistId) {
      context.commit("SET_LOADING", true);
      try {
        const artist = await getArtistInfo(artistId);
        context.commit("SET_ARTIST", artist);
      } catch (error) {
        context.commit(
          "SET_ERROR",
          error.message || "Failed to fetch artist info"
        );
      } finally {
        context.commit("SET_LOADING", false);
      }
    },
  },
  modules: {},
});
