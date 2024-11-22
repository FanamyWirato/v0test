import { createRouter, createWebHistory } from 'vue-router';
import { useConnectionStore } from "@/unauthorized/stores/connection";
import Home from "@/authorized/views/Home.vue";
import About from "@/authorized/views/About.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const connectionStore = useConnectionStore();
  if (to.path.startsWith('/authorized') && !connectionStore.isAuthorized) {
    next('/unauthorized');
  } else {
    next();
  }
});

export default router;