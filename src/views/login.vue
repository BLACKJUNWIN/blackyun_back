<template>
  <div>
    <div style="width:100%;overflow: hidden;background-color: black" :style="fullHeight" v-if="isLogin">
      <img style="width:100%;" src="@/assets/images/6.jpg" alt="背景图片"/>
      <div style="" class="submit" :style="login1">
        <div style="margin-top: 10px">
          <img src="@/assets/images/logo.png" alt="头像"
               style="width:100px;margin-bottom:8px;box-shadow: 0 0 10px black;border-radius: 50%">
          <el-form ref="form" label-width="80px" style="position:relative;left: -30px">
            <el-form-item>
              <div style="font-size: 16px;font-weight: bold">用户名</div>
              <el-input style="width:320px" v-model:value="user.name"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="font-size: 16px;font-weight: bold">密码</div>
              <el-input style="width:320px" show-password v-model:value="user.password"></el-input>
            </el-form-item>
          </el-form>
          <div style="position:relative;left:43px">
            <el-button type="success" style="position: relative;left: -155px" @click="login()">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {login} from "../net/user";

export default {
  name: "login",
  data() {
    return {
      fullHeight: '',
      isLogin: true,
      user: {
        name: '',
        password: ''
      },
      login1: ''
    }
  },
  methods: {
    async login() {
      let res = await login(this.user);
      this.$store.commit("tip", res);
      if (res.code === "200") {
        sessionStorage.setItem("token", res.data);
        sessionStorage.setItem("user", this.user.name);
        await this.$router.push("/home/user");
      }
      this.user = {
        name: '',
        password: ''
      }
    }
  },
  created() {
    this.fullHeight = "height:" + (document.documentElement.clientHeight) + "px";
    sessionStorage.setItem("loading", "true");
  },
  mounted() {
    setTimeout(() => {
      this.login1 = "opacity: 1;top:0;"
    }, 10)
  }
}
</script>

<style scoped>
.submit {
  position: fixed;
  transition: all 1.5s;
  opacity: 0;
  top: -80px;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  float: none;
  display: block;
  margin: auto;
  border-radius: 10% 20%;
  background-image: linear-gradient(120deg, #fccb90 0%, #d57eeb 100%);
  box-shadow: azure 3px 3px 20px;
  width: 490px;
  height: 390px;
  z-index: 10;
  padding: 5px 10px;
}
</style>
