import { createRouter, createWebHistory } from 'vue-router';

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
      ]
    },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;