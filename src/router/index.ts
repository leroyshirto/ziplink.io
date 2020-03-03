import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Download from '@/views/Download.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/download/:skylink',
    name: 'Download',
    component: Download,
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
