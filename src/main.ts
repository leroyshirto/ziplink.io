import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/vue-buefy';
import './plugins/vue-clipboard';
import './plugins/vue-sweetalert';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
