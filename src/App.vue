<template>
  <v-app>
    <app-side-nav v-if="authenticated" 
      ref="sidenav"></app-side-nav>
    <app-tool-nav v-if="authenticated"
      v-on:drawertoggle="$refs.sidenav.drawer = !$refs.sidenav.drawer"></app-tool-nav>
    <app-brand-nav v-if="!authenticated"></app-brand-nav>
    <v-main class="app-main grey lighten-2">
      <v-container>
        <router-view />
      </v-container>
      <v-btn
        class="app-menu d-block d-lg-none"
        fab
        dark
        color="primary"
        @click="$refs.sidenav.drawer = !$refs.sidenav.drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

import SideNav from "@/components/Structure/SideNav/SideNav";
import ToolNav from "@/components/Structure/ToolNav/ToolNav";
import BrandNav from "@/components/Structure/BrandNav/BrandNav";

export default {
  components: {
    "app-brand-nav": BrandNav,
    "app-side-nav": SideNav,
    "app-tool-nav": ToolNav,
  },
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
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'authenticated'
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
  .app-menu {
    position: fixed;
    bottom: 15px;
    right: 20px;
  }
  .v-main__wrap {
    padding-bottom: 100px;
  }
  a, a:hover {
    text-decoration: none;
  }
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
