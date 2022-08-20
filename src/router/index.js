import Vue from 'vue';
import VueRouter from 'vue-router';
let home =()=>import("../views/home")
let category =()=>import("../views/homeItem/category")
let evaluation =()=>import("../views/homeItem/evaluation")
let software =()=>import("../views/homeItem/software")
let user =()=>import("../views/homeItem/user")

Vue.use(VueRouter)
const router=new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home/user'
    },
    {
      path: '',
      redirect: '/home/user'
    },
    {
      path:'/home',
      component:home,
      children:[{
        path:"category",
        name:"分类管理",
        component:category
      }
      ,{
        path:"evaluation",
        name:"评价管理",
        component:evaluation
      },{
          path:"software",
          name:"软件管理",
          component:software
        },{
          path:"user",
          name:"用户管理",
          component:user
        }]
    },
    {
      path:'/login',
      name:'登录',
      component:()=>import("@/views/login")
    }

  ]
});
  router.beforeEach((to,from,next)=>{
  if(sessionStorage.getItem("token")||to.name==="登录"){
      return next();
  }else{
    return next("/login");
  }
});

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err);
// };
export default router
