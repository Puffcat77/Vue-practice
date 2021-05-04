import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from 'vue-i18n';

Vue.use(i18n);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
