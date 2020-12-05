import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios';
import VModal from 'vue-js-modal';

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlusSquare,
  faSearch,
  faAngleDoubleLeft,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faPlusSquare,
  faSearch,
  faAngleDoubleLeft,
  faEdit
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import './registerServiceWorker'

Vue.prototype.$http = Axios;

Vue.config.productionTip = false

Vue.use(VModal, {
  dynamicDefaults: {
    draggable: true,
    resizable: true,
    height: 'auto'
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
