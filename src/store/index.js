import { createStore } from "vuex";
import {
  getAccessToken,
  redirectToAuthCodeFlow,
  fetchProfile,
} from "../services/spotify";
export default createStore({
  state: {
    accessToken: localStorage.getItem("accessToken") || null,
    userProfile: null,
    isLoading: false,
    error: null,
  },

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ACCESS_TOKEN(state, token) {
      state.accessToken = token;
      localStorage.setItem("spotify_token", token);
    },
    SET_USER_PROFILE(state, profile) {
      state.userProfile = profile;
      state.error = null;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    LOGOUT(state) {
      state.accessToken = null;
      state.userProfile = null;
      localStorage.removeItem("spotify_token");
    },
  },

  actions: {
    login() {
      redirectToAuthCodeFlow();
    },
    async handleAuthCallback({ commit }, code) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const token = await getAccessToken(code);
        commit("SET_ACCESS_TOKEN", token);
        const profile = await fetchProfile(token);
        commit("SET_USER_PROFILE", profile);
      } catch (error) {
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  modules: {},
});
