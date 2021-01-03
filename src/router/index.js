import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index';

import Home from '../views/Home.vue'
import Login from '../views/Login/Login.vue'
import AuthContainer from '../views/AuthContainer.vue'
import ProjectList from '../views/ProjectList/ProjectList.vue'
import ProjectDetail from '../views/ProjectDetail/ProjectDetail.vue'
import ProjectLayout from '../views/ProjectLayout/ProjectLayout.vue'
import Configure from '../views/Configure/Configure.vue'


const checkAuth = async function(to, from, next) {
    const loginStatus = await store.dispatch('getLoginStatus');
    if (loginStatus == null) next({ name: 'Login' });
    next();
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/dash',
    name: 'Auth Dashboard',
    component: AuthContainer,
    beforeEnter: checkAuth,
    children: [
      {
        path: '/',
        name: 'Dash Home',
        component: Home,
      },
      {
        path: 'configure',
        name: 'Configure',
        component: Configure,
      }, {
        path: ':type',
        name: 'Projects',
        component: ProjectList,
      },
      {
        path: ':type/layout',
        name: 'Project Layout',
        component: ProjectLayout,
      },
      {
        path: '/dash/:type/:id',
        name: 'Project Detail',
        component: ProjectDetail,
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  if (to.params.type !== from.params.type) {
    console.log(to.params);
    store.commit('UPDATE_ACTIVE_TYPE', to.params.type)
  }
  next();
});



export default router
