import Vue from 'vue';
import App from './App.vue';
import router from './router';

import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/components/icon.min.css';

Vue.config.productionTip = false;

Vue.prototype.$confirm = (message, title, options) => {
    return new Promise((resolve, reject) => {
        if (window.confirm(message)) {
            resolve(true);
        } else {
            reject(false);
        }
    });
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
