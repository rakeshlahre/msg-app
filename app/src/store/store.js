import Vue from "vue";
import Vuex from "vuex";
import { auth } from "./modules/auth";
import socket from "./modules/socket";
import { chat } from "./modules/chat";


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    socket,
    chat
  }
});

export default store;
