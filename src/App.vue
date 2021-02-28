<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

export default {
  methods: {
    ...mapMutations({
      startFindMode: "START_FIND_MODE",
    }),
    ...mapActions(["getTypes", "updateProject"]),
    signIn: function() {
      Vue.googleAuth().signIn(this.onSignInSuccess, this.onSignInError);
    },
    onSignInSuccess: function(authorizationCode) {
      console.log(authorizationCode);
      axios.get(`/api/verify?auth=${authorizationCode}`).then(x => console.log(x));
    },
    onSignInError: function(error) {
      console.log(error);
    }
  },
  computed: {
    ...mapState([
    ]),
    ...mapGetters([
          'activeProjectType',
    ])
  },
  mounted: function () {
    this.$store.dispatch('getLoginStatus');

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.keyCode === 70) {
        // CTRL+F Listener
        e.preventDefault();
        this.startFindMode();
      }
    });

    // return to LIST after perfoming search
    this.$store.subscribe((mutation) => {
      if (mutation.type == "SET_LIST") {
        let type = this.activeProjectType;
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
img {
  max-width: 100%;
}
</style>
