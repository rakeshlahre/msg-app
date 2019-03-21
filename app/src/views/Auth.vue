<template>
  <div>
    <div class="google">
      <g-signin-button v-if="!isAuthenticated"
        v-bind:style="{ margin: '20px' }"
        :params="googleSignInParams"
        @success="onGoogleSignInSuccess"
        @error="onGoogleSignInError"
        >Sign in with Google</g-signin-button
      >
      <button v-if="isAuthenticated" v-on:click="onGoogleSignOut()">signOut</button>
    </div>
    <div class="facebook">
      <fb-signin-button v-if="!isAuthenticated"
        :params="fbSignInParams"
        @success="onFacebookSignInSuccess"
        @error="onFacebookSignInError"
        >Sign in with Facebook</fb-signin-button
      >
      <!-- <button id="logout" v-on:click="onFacebookSignOut()">Logout</button> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import GSignInButton from "vue-google-signin-button";
import FBSignInButton from "vue-facebook-signin-button";
import { mapGetters } from "vuex";
Vue.use(FBSignInButton);
Vue.use(GSignInButton);

export default {
  name: 'auth',
  data() {
    return {
      googleSignInParams: {
        client_id:
          "631684094252-riivbvb0f9664f5qc2ivnepmf48mdvr9.apps.googleusercontent.com"
      },
      fbSignInParams: {
        scope: "public_profile,email",
        return_scopes: true
      }
    };
  },
  computed: {
    ...mapGetters({
      isSocketConnected: "isSocketConnected",
      isAuthenticated: "isAuthenticated"
    })
  },
  created() {
    this.connectToWebSocket();
  },
  mounted() {
    let googleClientScript = document.createElement("script");
    googleClientScript.setAttribute(
      "src",
      "https://apis.google.com/js/api:client.js"
    );
    document.head.appendChild(googleClientScript);
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "258196488419311",
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse social plugins on this page
        version: "v2.8" // use graph api version 2.8
      });
    };
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
  watch: {
    isAuthenticated() {
      this.connectToWebSocket();
    }
  },
  methods: {
    onGoogleSignInSuccess(googleUser) {
      const router = this.$router;

      // The ID token you need to pass to your backend:
      var idToken = googleUser.getAuthResponse().id_token;
      this.$store.dispatch("onHandleGoogleSignin", { idToken, router });
    },
    onGoogleSignInError(error) {
      console.log("OH NOES", error);
    },
    onGoogleSignOut() {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2 && auth2.isSignedIn.get()) {
        auth2.signOut().then(function() {
          console.log("User signed out.");
        });
      }

      this.$store.dispatch("resetLoggedInUser");
    },
    onFacebookSignInSuccess(response) {
      const router = this.$router;
      try {
        if (response) {
          let accessToken = response.accessToken || response.authResponse.accessToken;
          let userID = response.authResponse.userID;

          this.$store.dispatch("onHandleFacebookSignin", {
            accessToken,
            userID,
            router
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    onFacebookSignInError(error) {
      console.log("OH NOES", error);
    },

    isConnectedToFacebook () {
      return new Promise(resolve => {
        if (typeof window === undefined) {
          return resolve(false);
        }
        const FB = window.FB;
        if (FB) {
          FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
              return resolve(true);
            }
          });
        }
        return resolve(false);
      });
    },

    async onFacebookSignOut() {
      debugger;

      if (await this.isConnectedToFacebook ()) {
        window.FB.logout(function() {
          console.log("User signed out.");
        });
        this.$store.dispatch("resetLoggedInUser");
      }
    },
    connectToWebSocket() {
      this.$store.dispatch("setupChatSocket");
    }
  }
};
</script>

<style>
.g-signin-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}

.fb-signin-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  margin: 0px 20px;
}

.google {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px;
}

.facebook {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px;
  pointer-events: none;
}
</style>
