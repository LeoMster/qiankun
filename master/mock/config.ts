export default {
  '/api/config': {
    apps: [
      {
        name: 'app1',
        entry: '//localhost:9001',
      },
      {
        name: 'app2',
        entry: '//localhost:9002',
      },
    ],
    routes: [
      {
        name: 'sub-app-1',
        path: '/sub-app-1',
      },
    ],
  },
};