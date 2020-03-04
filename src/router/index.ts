import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Download from '@/views/Download.vue';
import NotFoundView from '@/views/NotFoundView.vue';

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
  {
    // not found handler
    path: '*',
    component: NotFoundView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
