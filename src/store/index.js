import Vuex from "vuex";
import Vue from "vue";
import { Notification } from 'element-ui';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading:false,
  },
  mutations: {
    tip(state,res) {
      if (res.code === "200") {
        if((typeof res.data)==="string"){
          Notification({
            title: "成功",
            message: res.data,
            type: 'success'
          });
        }else{
          Notification({
            title: "成功",
            message: res.status,
            type: 'success'
          });
        }
      } else {
        Notification({
          title: "出现问题",
          message: res.status,
          type: 'warning'
        });
      }
    }
  }
})
