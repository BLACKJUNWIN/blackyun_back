<template>
  <div class="plant">
    <b style="font-size: 26px">筛选:</b>
    <div>
      <el-form label-position="top">
      <slot name="filters"/>
      </el-form>
    </div>
    <div style="display:flex;position: absolute;bottom: 20px;right: 50px">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "filterPlant",
  props: {height:String},
  created() {

  }
}
</script>

<style scoped>
 .plant{
   width: 80%;
   box-shadow: 0 0 6px rgba(51, 51, 51, 0.3);
   border-radius: 1em;
   margin: 10px auto;
   padding:30px 50px;
   height: 180px;
   position: relative;
 }
</style>
