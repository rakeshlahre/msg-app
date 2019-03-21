import * as types from "../mutation-types";

export const chat = {
  state: {
    selected: null,
  },
  getters: {
    selected: state => state.selected
  },
  mutations: {
    [types.SET_SELECTED_USER](state, user) {
      state.selected = user;
    }
  },
  actions: {
    setSelectedUser ({commit, state} , data) {
      commit(types.SET_SELECTED_USER, data);
    }
  }
};
