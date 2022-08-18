<template>
  <div id="app" v-loading="$store.state.loading">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "assets/css/base.css";
</style>
