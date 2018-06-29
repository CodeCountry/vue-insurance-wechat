/**
 * Created on 11:17 2018/05/03.
 * file name index
 * by sh01114
 */
import Vue from 'vue'
import Router from 'vue-router'
//
// import chooseBrand from '../components/page/ChooseBrand.vue'
// import main from '../components/page/Main.vue'

Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/chooseBrand',
      component: resolve => require(['../components/page/ChooseBrand.vue'], resolve),
      meta: {
        title: '保障激活'
      }
    },
    {
      path:'/main/:id',
      component: resolve => require(['../components/page/Main.vue'], resolve),
      meta: {
        title: '保障激活'
      }
    },
    {
      path:'/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
      meta: {
        title: '用户登录'
      }
    },
    {
      path:'/activation_finish',
      component: resolve => require(['../components/page/activation_finish.vue'], resolve),
      meta: {
        title: '保障激活'
      }
    },
    {
      path:'/orderList',
      component: resolve => require(['../components/page/OrderList.vue'], resolve),
      meta: {
        title: '保障查询'
      }
    },
    {
      path:'/orderDetail/:insuranceNum',
      component: resolve => require(['../components/page/OrderDetail.vue'], resolve),
      meta: {
        title: '订单详情'
      }
    },
    // 无忧理赔
    {
      path:'/default',
      component: resolve => require(['../components/page/default/default.vue'], resolve),
      meta: {
        title: '理赔指南'
      }
    },
  ],
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router;
