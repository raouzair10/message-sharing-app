import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
// import store from '../store'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach(async (to, from) => {

//   try {
//     if (from.name === 'login' && to.name === 'signup') {
//       await store.dispatch('goToSignup')
//     }
//   } catch (error) {
//     console.log(error)
//     return { name: 'login'}
//   }
//   try {
//     if (from.name === 'signup' && to.name === 'login') {
//       await store.dispatch('goToLogin')
//     }
//   } catch (error) {
//     console.log(error)
//     return { name: 'signup'}
//   }  

//   const isAuthenticated = store.getters.isAuthenticated
//   if ((to.name === 'login' || to.name === 'signup') && isAuthenticated) {
//     return { name: 'home' }
//   } else if (to.name === 'home' && !isAuthenticated) {
//     return { name: 'login' }
//   } else {
//     return
//   }
// })

export default router
