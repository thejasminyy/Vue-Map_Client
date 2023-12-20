import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
      path: '/',
      name: 'Login',
      component: ()=> import('@/views/LoginView.vue'),
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
        },
        {
          path: '/map',
          name: 'Map',
          component: ()=> import('@/views/MapView.vue'),
        },
        {
          path: '/about',
          name: 'About',
          component: ()=> import('@/views/AboutView.vue'),
        },
      ]
    },
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  
  export default router;