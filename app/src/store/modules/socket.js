import socketIo from "socket.io-client"; /* eslint-disable */
import URL from "../../config/AppConfig";
import * as types from "../mutation-types";
import Vue from "vue";

const state = {
  webSocket: null,  
  isConnected: false,
  isSocketConnected: false,
  allUsers: [],
  messages: []
};

const getters = {
  webSocket: state => state.webSocket,
  isSocketConnected: state => state.isSocketConnected,
  allCategories: state => state.allCategories,
  allUsers: state => state.allUsers,
  allMessages: state => state.messages
};

const actions = {
  setupChatSocket({ commit, dispatch, state, rootState }) {
    if (!state.webSocket && process.browser) {
      const socketUrl = `${URL.SOCKET_URL}/?token=${encodeURIComponent(
        rootState.auth.token
      )}`;
  
      const socket = socketIo(socketUrl);
      socket.on(`ALL_USERS`, function(data) {

        commit(types.UPDATE_ALL_USERS, data);
      });

      socket.on("ALL_MESSAGES", function (data) {
        commit(types.UPDATE_ALL_MESSAGE, data);
      });

      socket.on("message", function(data) {
        commit(types.UPDATE_MESSAGE_TABLE_ON_RECIEVE, data);
      });

      commit(types.SET_WEBSOCKET, socket);

      socket.on("disconnect", () => {
        commit(types.SET_SOCKET_CONNECTION, false);
      });

      socket.on("connect", () => {
        commit(types.SET_SOCKET_CONNECTION, true);

        socket.emit("join");
      });
    } else if (state.webSocket) {
      state.webSocket.disconnect(true);

      window.setTimeout(() => {
        commit(types.SET_WEBSOCKET, null);
        dispatch("setupChatSocket");
      }, 500);
    }
  },

  handleMessage({ commit, state }, message) {
    if (!state.webSocket) {
      return;
    }

    commit(types.UPDATE_MESSAGE_TABLE_ON_SEND, message);
    state.webSocket.emit(
      "message",
      message
    );
  }
};

const mutations = {
  [types.SET_WEBSOCKET](state, socket) {
    state.webSocket = socket;
  },

  [types.SET_SOCKET_CONNECTION](state, isSocketConnected) {
    state.isSocketConnected = isSocketConnected;
  },

  [types.UPDATE_IS_CONNECTED](state, isConnected) {
    state.isConnected = isConnected;
  },
  [types.UPDATE_ALL_USERS](state, data) {
    state.allUsers = data;
  },
  [types.UPDATE_MESSAGE_TABLE_ON_RECIEVE](state, message) {
    Vue.set(state.messages, state.messages.length, message);
  },

  [types.UPDATE_MESSAGE_TABLE_ON_SEND](state, message) {
    Vue.set(state.messages, state.messages.length, message);
  },

  [types.UPDATE_ALL_MESSAGE] (state, data) {
    state.messages = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
