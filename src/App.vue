<template>
  <div id="app">
    <router-view/>
    <!--<keep-alive>-->
      <!--<router-view v-if="$route.meta.keepAlive"></router-view>-->
    <!--</keep-alive>-->
    <!--<router-view v-if="!$route.meta.keepAlive"></router-view>-->
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
<style lang="scss">
  @import "../static/css/common.scss";
  #app{
    height:100%;
    overflow-y: scroll;
    -webkit-scroll-tap:touch;
    /*overflow: hidden;*/
  }
</style>
