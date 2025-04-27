import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Problems from '../pages/Problems.vue'
import Editor from '../pages/Editor.vue'
import NotFound from '../pages/NotFound.vue'
import Profile from '../pages/Profile.vue'
import Admin from '../pages/Admin.vue'
import CreateProblems from '../pages/CreateProblems.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/Home', component: Home },
  { path: '/Login', component: Login },
  { path: '/Register', component: Register },
  { path: '/Profile', component: Profile },
  { path: '/Problems', component: Problems },
  { path: '/Admin', component: Admin },
  { path: '/CreateProblems', component: CreateProblems },
  { path: '/Editor/:id', component: Editor, props: true },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router