import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Direction from 'vue-direction-key'
import axios from 'axios'
import qs from 'qs'
// import moment from 'moment'

Vue.prototype.$axios = axios
// Vue.prototype.$moment = moment
Vue.prototype.$qs = qs
Vue.use(Direction)
Vue.use(VueClipboard)
Vue.use(ElementUI);
Vue.config.productionTip = false

// Vue.http.interceptors.push(function (request, next) {
//   //拦截器
//   // 跨域携带cookie
//   request.credentials = true;
//   next();
// });eturn VueRouterPush.call(this, to).catch(err => err)

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')

