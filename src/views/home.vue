<template>
  <div id="home">
    <top-header class="top" :style="top" style="top:-20px"/>
    <div style="display: flex;width: 100%">
      <left-header class="left" :style="left" style="left: -30px;position: relative;flex: none"/>
      <div  class="home" :style="home" style="flex: auto">
        <h1 style="text-align: center">{{$route.name}}</h1>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import leftHeader from "../components/leftHeader/leftHeader";
import topHeader from "../components/topHeader/topHeader";
import filterPlant from "../components/filterPlant/filterPlant";
import FilterPlant from "../components/filterPlant/filterPlant";

export default {
  name: "home",
  data() {
    return {
      top: "",
      left: "",
      home: "",
    }
  },
  components: {
    FilterPlant,
    leftHeader,
    topHeader,
  },
  mounted() {
    this.top = "opacity: 1;top:0";
    this.left = "opacity: 1;left:0";
    setTimeout(() => {
      this.home = "opacity: 1";
    }, 800)
  }
}
</script>

<style scoped>
#home {
  width: 100%;
  min-width: 1200px;
}

.top {
  opacity: 0;
  transition: all 1.5s;
}

.left {
  opacity: 0;
  transition: all 1.5s;
}

.home {
  opacity: 0;
  transition: all 1s;
}
</style>
