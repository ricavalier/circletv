
const routes = [
  {
    path: '/',
    component: () => import('layouts/CTVLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') }
    ]
  }, {
    path: '*/',
    component: () => import('layouts/CTVLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/Index.vue') },
      { path: 'detalhes/:id', component: () => import('pages/Detalhes.vue') },
      { path: 'favoritos', component: () => import('pages/Favoritos.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
