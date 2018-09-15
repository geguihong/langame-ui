export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Project/Dashboard',
      },
      {
        path: '/workplace',
        icon: 'table',
        name: 'workplace',
        routes: [
          {
            path: '/workplace/overview',
            name: 'overview',
            icon: 'dashboard',
            component: './Workplace/MainWorkplace',
          },
          {
            path: '/workplace/query',
            name: 'query',
            icon: 'dashboard',
            component: './Workplace/Query',
          },
        ],
      },
      {
        path: '/deploy',
        name: 'deploy',
        icon: 'profile',
        component: './Profile/BasicProfile',
      },
      {
        name: 'export',
        icon: 'warning',
        path: '/exception',
        component: './Exception/403',
      },
      {
        path: '/tag',
        name: 'tag',
        icon: 'check-circle-o',
        component: './Result/Success',
      },
      {
        path: '/member',
        icon: 'form',
        name: 'member',
        component: './Forms/BasicForm',
      },
      {
        path: '/settings',
        name: 'settings',
        icon: 'dashboard',
        component: './Dashboard/Workplace',
      },
      {
        component: '404',
      },
    ],
  },
];
