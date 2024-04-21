import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from "@/stores/user";

const routes = [
    {
      path: '/',
      name: 'Login',
      component: ()=> import('@/views/LoginView.vue'),
      meta: {
        title: '',
        login: false,
        logout: true,
      },
    },
    {
      path: '/Jasmin',
      name: 'Jasmin',
      component: ()=> import('@/views/Header.vue'),
      meta: {
        title: '',
        login: true,
      },
      children:[
        {
          path: '/home',
          name: 'Home',
          component: ()=> import('@/views/HomeView.vue'),
          meta: {
            title: 'home',
            login: true,
          },
        },
        {
          path: '/map',
          name: 'Map',
          component: ()=> import('@/views/MapView.vue'),
          meta: {
            title: 'map',
            login: true,
          },
        },
        {
          path: '/about',
          name: 'About',
          component: ()=> import('@/views/AboutView.vue'),
          meta: {
            title: 'about',
            login: true,
          },
        },
      ]
    },
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

// 設定路由 title 為 meta 的 title
  router.afterEach((to, from) => {
    document.title = to.meta.title; 
  });

  // 設定路由權限
  router.beforeEach(async (to, from, next) => {
    const { initLoginData } = useUserStore();
    const storedUserName = sessionStorage.getItem("userName");
    
    // 如果使用者已登入
    if (to.meta.login && storedUserName !== null && storedUserName !== '') {
      next();
    } else {
      // 如果使用者未登入 並嘗試訪問其他頁面
      if (to.name !== 'Login') {
        console.log(111)
        initLoginData();
        next({ name: 'Login' });
      } else {
        // 如果使用者未登入且已經在登入頁面
        next();
      }
    }
  });

  export default router;