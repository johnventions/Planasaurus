<template>
  <div id="app">
    <div id="nav">
      <app-nav></app-nav>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import Nav from "./components/Structure/Nav/Nav";

export default {
  components: {
    "app-nav": Nav,
  },
  methods: {
    ...mapMutations({
      startFindMode: "START_FIND_MODE",
    }),
    ...mapActions(["getTypes"]),
  },
  computed: {
    ...mapGetters([
          'activeType',
    ])
  },
  mounted: function () {
    this.getTypes();

    // CTRL+F Listener
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();
        this.startFindMode();
      }
    });

    // return to LIST after perfoming search
    this.$store.subscribe((mutation) => {
      if (mutation.type == "SET_LIST") {
        let type = this.activeType;
        if (this.$route.name != "Projects") {
          this.$router.push({ path: `/dash/${ type.codename }` , query: { search: '1' } }) 
        }
      }
    });
  },
};
</script>

<style lang="scss">
#nav {
  margin-bottom: 10px;
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
