<template>
  <b-container>	
    <div class="row">
      <div class="col-md-4 col-sm-12">
        <b-list-group class="user-card">
          <user-card v-for="user in allUsers" :key="user.id" :user="user" :isSelected="selected && selected.id === user.id"></user-card>
        </b-list-group>
      </div>
      <div class="chat-area col-md-8 col-sm-12" v-if="selected">
        <div id="msg-area" class="msg-area">
          <div v-bind:class="{'right':isRight(item), 'left':isleft(item)}" v-for="item of messages" :key="item.id">
          {{item.message}}
          </div>
        </div>
        <b-form  v-on:submit.prevent="onSubmit" class="container2">
          <b-form-group class="chat-input">
            <b-form-input id="chat-submit" name="message" v-model="message" />
          </b-form-group>

          <div class="submit-buttons">
            <button class="btn btn-success" type="submit">send</button>
          </div>
        </b-form>
      </div>
    </div>
  </b-container>
</template>

<script>
import bContainer from "bootstrap-vue/es/components/layout/container";
import bListGroup from "bootstrap-vue/es/components/list-group/list-group";
// import bListGroupItem from "bootstrap-vue/es/components/list-group/list-group-item";
import userCard from "../components/cards/userCard";
import { mapGetters } from "vuex";
import bForm from 'bootstrap-vue/es/components/form/form';
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group';
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';

export default {
  name: 'chat',
  components: {
    "b-container": bContainer,
    "b-list-group": bListGroup,
    // "b-list-group-item": bListGroupItem,
    "user-card": userCard,
    'b-form': bForm,
    'b-form-group': bFormGroup,
    'b-form-input': bFormInput,
  },

  data: () => ({
    message: null
  }),

	computed: {
		...mapGetters({
        allUsers: "allUsers",
        selected: "selected",
        allMessages: "allMessages",
        userId: "userId",
        username: "username"
    }),

    messages () {
      this.$nextTick(function () {
        let a = document.getElementById("msg-area");
        a.scrollTop = a.scrollHeight;
      });

      return this.allMessages.filter(x => {return (x.toUserId === this.selected.id) || (x.fromUserId === this.selected.id)})
    }
  },

  created () {
    this.connectToWebSocket();
  },

  methods: {
    onSubmit () {
      this.$store.dispatch("handleMessage", {fromUserId: this.userId, message:this.message, toUserId: this.selected.id, fromUserName: this.username, toUserName: this.selected.username});
      this.message="";
      this.$nextTick(function () {
        let a = document.getElementById("msg-area");
        a.scrollTop = a.scrollHeight;
      });
    },

    isleft (item) {
      return item.fromUserId === this.selected.id;
    },
    isRight (item) {
      return item.toUserId === this.selected.id;
    },
    connectToWebSocket() {
      this.$store.dispatch("setupChatSocket");
    }
  }
}
</script>
<style lang="scss">
  .left {
    text-align: left;
  }
  .right {
    text-align: right;
    padding-right:20px;
  }
  .container2 {
    display: flex;
  }
  .chat-input {
    flex:1;
  }
  .msg-area {
    overflow-y: scroll;
    height: 280px;
    background-color:rgb(192, 236, 233);
  }
  .chat-area {
    position:relative;
    height:320px;

    @media (max-width: 768px) {
      margin-top: 20px;
    }
  }
  .user-card {
    height:320px;
    overflow-y: scroll;
  }
</style>


