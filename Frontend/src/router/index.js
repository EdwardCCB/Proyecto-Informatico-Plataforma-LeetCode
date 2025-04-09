import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Problems from '../pages/Problems.vue'
import Editor from '../pages/Editor.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/Home', component: Home },
  { path: '/Login', component: Login },
  { path: '/Register', component: Register },
  { path: '/Problems', component: Problems },
  { path: '/Editor/:id', component: Editor, props: true },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router