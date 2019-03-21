<template>
  <div id="app">
    <div id="nav">
      <router-link class="button is-outlined" to="/">Auth</router-link>
      <router-link  v-if="isAuthenticated" class="button is-outlined" to="/chat">Chat</router-link>
    </div>
    <div v-if="isAuthenticated">
      <h3> Logged In As : {{username}} </h3>
    </div>
    <router-view/>
  </div>
</template>

<style>
  @import "~bootstrap-vue/dist/bootstrap-vue.css";
  @import '~bootstrap/dist/css/bootstrap.min.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isAuthenticated", "getToken", "username"])
  },
  created() {
    this.fetchUser();
  },

  methods: {
    fetchUser() {
      this.$store.dispatch("fetchUser", this.$router);
    }
  }
};
</script>