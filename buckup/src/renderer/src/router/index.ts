import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@renderer/view/Home.vue'
import timeLine from '@renderer/view/Timeline.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: home },
    { path: '/timeline', component: timeLine },
    { path: '/stopwatch', component: () => import('@renderer/view/Stopwatch.vue') },
    { path: '/timer', component: () => import('@renderer/view/Timer.vue') },
    { path: '/setting', component: () => import('@renderer/view/Setting.vue') },
    { path: '/template', component: () => import('@renderer/view/Template.vue') }
  ]
})

export default router
