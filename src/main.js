import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios';

import VModal from 'vue-js-modal';
import DropdownMenu from '@innologica/vue-dropdown-menu';

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlusSquare,
  faSearch,
  faAngleDoubleLeft,
  faEdit,
  faFileUpload,
  faLocationArrow,
  faCog,
  faSignInAlt,
  faAngleLeft,
  faAngleRight,
  faFont,
  faHashtag,
  faCalendarAlt,
  faToggleOn,
  faCaretSquareDown,
  faLayerGroup,
  faFile,
  faArrowsAlt,
  faCaretDown,
  faCaretRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faPlusSquare,
  faSearch,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faEdit,
  faFileUpload,
  faLocationArrow,
  faCog,
  faSignInAlt,
  faFont,
  faHashtag,
  faCalendarAlt,
  faToggleOn,
  faCaretSquareDown,
  faLayerGroup,
  faFile,
  faArrowsAlt,
  faCaretDown,
  faCaretRight
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('dropdown-menu', DropdownMenu);

import './registerServiceWorker'

Vue.prototype.$http = Axios;

Axios.interceptors.request.use(function (config) {
  const workspace = store.state.activeWorkspace || -1;
  config.headers['Pterobyte-Workspace'] = workspace;
  return config;
});
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
