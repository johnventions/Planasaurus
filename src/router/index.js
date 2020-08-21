import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ProjectList from '../views/ProjectList/ProjectList.vue'
import ProjectDetail from '../views/ProjectDetail/ProjectDetail.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    name: 'Dash',
    component: Home
  },
	{
		path: '/dash/:type',
		name: 'Projects',
    component: ProjectList
	},
	{
		path: '/dash/:type/:id',
		name: 'Project Detail',
    component: ProjectDetail
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
