import { createRouter, createWebHashHistory } from 'vue-router'
import LayOut from '../views/LayOut/LayOut' 
import store from "../store/index.js"
// 路由配置
const routes = [
  // 登陆页面
  {
    path:"/login",
    name:"login",
    component:()=>import("../views/pages/login.vue")
  },
 {
    path:"/",
    name:"layout",
    component:LayOut,
    redirect:"/index",
    // 子路由/嵌套路由
    children:[
      {
        path:"/index",
        name:"index",
        component:()=>import("../views/pages/index.vue")
      },
      {
        path:"/face",
        name:"face",
        component:()=>import("../views/pages/face.vue")
      },
      {
        path:"/user",
        name:"user",
        component:()=>import("../views/pages/users.vue")
      },
    ]
 }
]
// 生成hash路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to,form,next)=>{
  /**
   * to:从哪个页面
   * from:到哪个页面
   * next:只有执行next()页面才会进行跳转
   */
  // 判断用户是否登录
  const uInfo = store.state.uInfo.userInfo
  if(!uInfo.token){
    // 未登录,跳转到login 
    if(to.path==="/login"){
      next()
      return
    }
    next("/login")
  }else{
    next()
  }

})
// 暴露路由对象
export default router
