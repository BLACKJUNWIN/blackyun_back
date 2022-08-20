import Vuex from "vuex";
import Vue from "vue";
import {Notification} from 'element-ui';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //页面是否加载
    loading:false,
    //页面高度,
    clientHeight:0,
    //文件上传进度
    uploadIndex:0,
    //文件上传总进度
    uploadIndexMax:1,
    //文件md5码
    uploadMd5:"",
    //文件名
    uploadFileName:"",
    //文件上传的路径
    uploadPath:"",
    uploadCancel:false,
    uploadInterrupt:false,
  },
  mutations: {
    tip(state, res) {
      if (res.code === "200") {
        Notification({
          title: "成功",
          message: "操作成功!",
          type: 'success'
        });
      } else if (res.code === "201") {
        Notification({
          title: "成功",
          message: "操作成功!",
          type: 'success'
        });
      } else {
        Notification({
          title: "出现问题",
          message: res.message,
          type: 'warning'
        });
      }
    }
  }
})
