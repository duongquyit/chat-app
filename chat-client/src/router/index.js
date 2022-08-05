import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/signin',
    name: 'signin',
    component: () => import('@/views/Signin.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
