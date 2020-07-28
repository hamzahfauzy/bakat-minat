import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import CKEditor from 'ckeditor4-vue'
import 'sweetalert2/src/sweetalert2.scss'

Vue.config.productionTip = false

Vue.use(CKEditor)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
