import create from "../../Api";
const api = create();
import * as types from "../mutation-types";

export const auth = {
  state: {
    loggedInUser: {},
    isAuthenticated: false,
    token: null,
    username:null,
    userId: null
  },
  getters: {
    isAuthenticated: state => {
      return state.isAuthenticated;
    },
    getToken: state => {
      return state.token;
    },
    userId: state => state.userId,
    username: state => state.username
  },
  mutations: {
    [types.SET_LOGGED_IN_USER] (state, user) {
      state.loggedInUser = user;
      state.userId = user.id;
      state.username = user.username

    },
    [types.RESET_LOGGED_IN_USER](state) {
      state.loggedInUser = {};
      state.userId = null;
      state.username = null;
    },
    [types.SET_IS_AUTHENTICATED](state, payload) {
      state.isAuthenticated = payload;
    },
    [types.SET_TOKEN](state, payload) {
      state.token = payload;
    }
  },
  actions: {
    onHandleGoogleSignin: async (context, payload) => {
      const { idToken, router } = payload;
      const response = await api.onHandleGoogleSignin(idToken);

      try {
        if (response && localStorage) {
          const { token } = response;

          localStorage.setItem("token", token);
          context.commit(types.SET_TOKEN, token);
          delete response.token && delete response.isEmailVerified;
          context.commit(types.SET_LOGGED_IN_USER, response);
          context.commit(types.SET_IS_AUTHENTICATED, true);
          router.push({ path: "/chat" });
        }
      } catch (error) {
        console.log(error);
      }
    },
    onHandleFacebookSignin: async (context, data) => {
      const { router } = data;
      const response = await api.onHandleFacebookSignin(data);

      try {
        if (response && localStorage) {
          const { token } = response;

          localStorage.setItem("token", token);
          context.commit(types.SET_TOKEN, token);
          delete response.token && delete response.isEmailVerified;
          context.commit(types.SET_LOGGED_IN_USER, response);
          context.commit(types.SET_IS_AUTHENTICATED, true);
          router.push({ path: "/chat" });
        }
      } catch (error) {
        console.log(error);
      }
    },
    resetLoggedInUser: async context => {
      context.commit(types.RESET_LOGGED_IN_USER);
      context.commit(types.SET_IS_AUTHENTICATED, false);
      context.commit(types.SET_TOKEN, null);
      const token = localStorage.getItem("token");

      if (token) {
        localStorage.removeItem("token");
      }
    },
    fetchUser: async (context, data) => {
      const { router } = data;
      const token = localStorage.getItem("token");

      context.commit(types.SET_TOKEN, token);

      if (token) {
        try {
          const userData = await api.fetchMe(token);

          context.commit(types.SET_LOGGED_IN_USER, userData);
          context.commit(types.SET_IS_AUTHENTICATED, true);
        } catch (e) {
          console.log(e);
          router.push({ path: "/auth" });
        }
      }
    }
  }
};
