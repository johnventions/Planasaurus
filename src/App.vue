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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
