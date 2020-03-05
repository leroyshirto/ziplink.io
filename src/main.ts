import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/vue-buefy';
import './plugins/vue-clipboard';
import './plugins/vue-sweetalert';
import './plugins/vue-moment';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
