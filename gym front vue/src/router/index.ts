import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
   {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Login.vue'),
    meta: { public: true, initialMode: 'register' }
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue')
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('../pages/Activities.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('../pages/Shop.vue')
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: () => import('../pages/Subscriptions.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'members',
        name: 'Members',
        component: () => import('../pages/Members.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('../pages/Tickets.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'access',
        name: 'AccessControl',
        component: () => import('../pages/AccessControl.vue'),
        meta: { roles: ['admin', 'controller'] }
      },
      {
        path: 'cash-register',
        name: 'CashRegister',
        component: () => import('../pages/CashRegister.vue'),
        meta: { roles: ['admin', 'cashier'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../pages/Users.vue'),
        meta: { roles: ['admin'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const user = authStore.user

  const publicPages = ['Login', 'Register']
  const authRequired = !publicPages.includes(to.name as string)

  if (authRequired && !user) {
    next({ name: 'Login' })
  } else if (to.meta.roles && user) {
    const roles = to.meta.roles as string[]
    if (!roles.includes(user.role)) {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
