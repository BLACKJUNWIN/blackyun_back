<template>
  <div id="app" v-loading="$store.state.loading">
    <router-view/>
    <speed-tip/>
  </div>
</template>

<script>
import SpeedTip from "./components/speedTip/speedTip";
export default {
  name: 'App',
  components: {SpeedTip}
}
</script>

<style>
@import "assets/css/base.css";
</style>
