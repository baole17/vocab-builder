import Vue from 'vue';
import App from './App.vue';
import routers from './routers';

import 'semantic-ui-css/semantic.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h =>(App)
}).$mount('#app');
