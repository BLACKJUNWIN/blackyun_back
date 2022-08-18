<template>
  <div id="top" style="width:100%;position:relative;top:0;right: 0;left: 0;z-index: 10">
    <div style="width:100%;height:80px;background-color: #e3f2fd;line-height: 80px;display: flex;justify-content: space-between">
      <strong style="font-size:21px;margin-left: 20px">黑盘后台管理系统</strong>
      <div style="margin-right: 20px;">
        <a href="https://blackjun.cn/book" style="text-decoration: none;color: white"><strong style="padding:5px 10px;background-color: #67c23a">前往书城</strong></a>
        <span style="font-size:20px">
                欢迎您的到来:&nbsp<strong style="background-color: #17a2b8;color:white;padding:5px 10px;border-radius: .5em">{{user}}</strong>
        </span>
        <span style="font-size:20px;margin-top:2px;margin-right: 10px;margin-left: 10px">
            <strong class="badge badge-secondary" @click="exit()" style="cursor: pointer">退出</strong>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "topHeader",
  data(){
    return {
      user:sessionStorage.getItem("user")
    }
  },
  methods:{
    exit(){
      sessionStorage.clear();
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
#top{
  min-width: 1200px;
  width: 100%;
}
</style>
