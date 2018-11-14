export default [
  // Refresh
  {
    path: '/refresh',
    component: './Refresh',
  },
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
            component: './Workplace/NodeManager',
          },
          {
            path: '/workplace/query',
            name: 'query',
            icon: 'dashboard',
            component: './Workplace/NodeQuery',
          },
          {
            path: '/workplace/edit',
            name: 'edit',
            icon: 'dashboard',
            component: './Workplace/EditPanel',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/export',
        name: 'export',
        icon: 'warning',
        routes: [
          {
            name: 'setting',
            path: '/export/setting',
            component: './Export/Setting',
          },
          {
            name: 'task',
            path: '/export/task',
            component: './Export/Task',
          },
        ],
      },
      {
        path: '/deploy',
        name: 'deploy',
        icon: 'profile',
        component: './Temp/Temp',
      },
      {
        path: '/tag',
        name: 'tag',
        icon: 'check-circle-o',
        component: './Project/ProjectTag',
      },
      {
        path: '/member',
        icon: 'form',
        name: 'member',
        component: './Project/Member',
      },
      {
        path: '/settings',
        name: 'settings',
        icon: 'dashboard',
        component: './Temp/Temp',
      },
      {
        component: '404',
      },
    ],
  },
];
