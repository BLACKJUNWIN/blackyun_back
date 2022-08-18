import axios from "axios";
import store from "../store/index";
export function request(config){
  const instance=axios.create({
    // baseURL:'https://blackjun.cn/bookStore',
    baseURL:'http://localhost:8088',
    method:'post',
    timeout:5000
  })

  instance.interceptors.request.use(config=>{
    const token = sessionStorage.getItem("token");
    store.state.loading=true;
    if (token) {
      config.headers['Authorization'] = "Bearer "+token;
      return config
    }
    return config;
  },error => {
    console.log(error);
  })

  instance.interceptors.response.use(res=>{
    store.state.loading=false;
    return res.data;
  },error => {
    console.log(error);
  })

  return instance(config);
}
