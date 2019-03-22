<template>
  <b-list-group-item class="card" :class="{ 'active': isSelected}" style="cursor: pointer;" @click="changeSelectedUser()">
    <img
      class="card__img"
      :src="user.profile || 'https://user-images.githubusercontent.com/16608864/35882949-bbe13aa0-0bab-11e8-859c-ceda3b213818.jpeg'"
      alt
    >
    <div class="username">
        {{ user.username }}
    </div>
    <div v-bind:class="{'online-icon': isActive}">
    </div>
  </b-list-group-item>
</template>

<script>
import bListGroupItem from "bootstrap-vue/es/components/list-group/list-group-item";
import { mapGetters } from 'vuex';

export default {
  props: {
    user: {type: Object, required: true},
    isSelected: {type: Boolean, required: false}
    },
  components: {
    "b-list-group-item": bListGroupItem
  },

  computed: {
    ...mapGetters({
      connectedUsers:"connectedUsers"
    }),

    isActive () {
      let index = this.connectedUsers.findIndex(x => x.id === this.user.id);

      return (index > -1 ) ? true : false;
    }
  },

  // mounted () {
  //   setInterval(() => {
  //     let index = this.connectedUsers.findIndex(x => x.id === this.user.id);

  //     let data = this.isActive;

  //     if (index > -1) {
  //       this.isActive = !data;
  //     }
  //   }, 500)
  // },

  methods: {
    changeSelectedUser() {
      this.$store.dispatch("setSelectedUser", this.user);
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  background-color: rgb(125, 160, 224);
}

.username {
  margin-left: 50px;
}

.card {
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-bottom: 1rem;
  min-height:70px;

  &__img {
    width: 2.8rem;
    height:2.8rem;
    border-radius: 1.4rem;
  }
}

.online-icon {
  height: 10px;
  width: 10px;
  background-color: green;
  border-radius: 50%;
  margin-left: auto;
}
</style>
