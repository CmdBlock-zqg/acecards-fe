import { createRouter, createWebHashHistory } from 'vue-router'

import db from './plugins/db.js'

const routes = [
  {
    path: '/',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/study',
    component: () => import('./views/study/List.vue')
  }
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.beforeEach(async (to, from, next) => {
  if (to.path === '/' || await db.data.get('token')) next()
  else next('/')
})

export default router
