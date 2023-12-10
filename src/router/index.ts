import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
      path: '/',
      name: 'Login',
      component: ()=> import('@/views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'Home',
      component: ()=> import('@/views/HomeView.vue'),
    },
    // Add other routes as needed
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;