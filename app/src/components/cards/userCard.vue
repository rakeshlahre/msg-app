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
  </b-list-group-item>
</template>

<script>
import bListGroupItem from "bootstrap-vue/es/components/list-group/list-group-item";

export default {
  props: {
    user: {type: Object, required: true},
    isSelected: {type: Boolean, required: false}
    },
  components: {
    "b-list-group-item": bListGroupItem
  },

  data () { 
    return {
      isActive:false,
      active1: {
        "background-color" : "yellow"
      }
    }
  },

  methods: {
    changeSelectedUser() {
      this.isActive = true;
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
</style>
