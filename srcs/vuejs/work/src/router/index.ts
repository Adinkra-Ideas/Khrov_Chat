import { createRouter, createWebHistory } from 'vue-router'
import Test_YellowView from '../views/TestYellowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Test_YellowView
    },
    {
      path: '/blue',
      name: 'blue',
      component: () => import('../views/TestBlueView.vue')
    },
    {
      path: '/grey',
      name: 'grey',
      component: () => import('../views/TestGreyView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: 'chaty',
          component: () => import('../views/ChatyView.vue')
        },
      ]
    },

  ]
})

export default router
