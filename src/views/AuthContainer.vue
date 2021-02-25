<template>
    <div class="dash">
      <div id="nav">
        <app-side-nav></app-side-nav>
      </div>
      <div class="page-body">
        <app-tool-nav></app-tool-nav>
        <router-view></router-view>
      </div>
    </div>
</template>
<script>
import SideNav from "@/components/Structure/SideNav/Nav";
import ToolNav from "@/components/Structure/ToolNav/ToolNav";

export default {
  components: {
    "app-side-nav": SideNav,
    "app-tool-nav": ToolNav,
  },
}
</script>
<style lang="scss">
  .dash {
    display: flex;
    height: 100%;
    min-height: 100vh;
    flex-direction: row;
    
    #nav {
      max-width: 200px;
      margin-bottom: 0;
      flex-grow: 1;
      height: 100%;
      > div {
        min-height: 100%;
      }
    }

    .page-body {
      flex-grow: 1;
    }
  }
</style>