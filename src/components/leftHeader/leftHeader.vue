<template>
  <div style="left: 0;right: 0;">
    <el-row class="tac">
      <el-col :span="5" style="max-width: 230px;min-width: 200px;font-weight: bold;">
        <el-menu :style="fullHeight"
          :default-active="leftHeader"
          router
          class="el-menu-vertical-demo"
          @select="handleOpen"
          background-color="rgba(0,0,0,.003)">
          <el-menu-item index="1" route="/home/user">
            <i class="el-icon-user-solid size" ></i>
            <span slot="title" class="size">用户管理</span>
          </el-menu-item>
          <el-menu-item index="3" route="/home/category">
            <i class="el-icon-menu size"></i>
            <span slot="title" class="size">分类管理</span>
          </el-menu-item>
          <el-menu-item index="4" route="/home/software">
            <i class="el-icon-sunny size"></i>
            <span slot="title" class="size">软件管理</span>
          </el-menu-item>
          <el-menu-item index="5" route="/home/evaluation">
            <i class="el-icon-s-marketing size"></i>
            <span slot="title" class="size">评价管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  name: "leftHeader",
  data(){
    return {
      fullHeight:'',
      leftHeader:"1"
    }
  },
  watch:{
    clientHeight(newValue) {
      if(newValue) {
        this.fullHeight="height:"+newValue+"px"
      }
    },
  },
  mounted() {
    this.fullHeight="height:"+(document.documentElement.clientHeight-80)+"px"
  },
  methods: {
    handleOpen(key) {
      sessionStorage.setItem("leftHeader",key);
    },
  },
  created() {
    let item = sessionStorage.getItem("leftHeader");
    if(item){
      this.leftHeader=item;
    }
  }
}
</script>

<style scoped>
.leftHeader div{
  text-align: center;
  margin:0 0;
}

.leftHeader button{
  width:160px;
  height: 60px;
}
.size{
  font-size: 1em;
}
</style>
