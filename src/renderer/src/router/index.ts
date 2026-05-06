import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@renderer/view/Home.vue'
import setting from '@renderer/view/Setting.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: home },
    { path: '/timeline', component: () => import('@renderer/view/Timeline.vue') },
    { path: '/stopwatch', component: () => import('@renderer/view/Stopwatch.vue') },
    { path: '/timer', component: () => import('@renderer/view/Timer.vue') },
    { path: '/setting', component: setting },
    { path: '/template', component: () => import('@renderer/view/Template.vue') }
  ]
})

export default router
