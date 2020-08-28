<template>
  <div id="app">
    <div id="nav">
      <app-nav></app-nav>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Nav from "./components/Layout/Nav/Nav";

export default {
  components: {
    'app-nav': Nav
  },
  methods: {
    ...mapActions([
      'getTypes'
    ]),
  },
  mounted: function() {
    this.getTypes();
  }
}
</script>

<style lang="scss">
#nav {
  a {
    //font-weight: bold;
    &.router-link-exact-active {
      // color: #42b983;
    }
  }
}
.vm--modal {
  padding: 15px;
}
</style>
