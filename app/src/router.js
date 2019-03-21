import Vue from 'vue'
import Router from 'vue-router'
import Auth from './views/Auth.vue'
import Chat from './views/Chat.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "auth",
      component: Auth
    },
    {
      path: "/chat",
      name: "chat",
      component: Chat
    }
  ]
})
