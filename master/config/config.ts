import { defineConfig } from 'umi';

export default defineConfig({
  layout: {
    title: '主应用',
    siderWidth: 200,
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { 
      path: '/app1', 
      name: 'app1',
      microApp: 'app1'
    },
    { 
      path: '/app2', 
      name: 'app2',
      microApp: 'app2' 
    },
  ],
  devServer: {
    port: 9000
  },
  qiankun: {
    master: {
      // 注册子应用信息
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
    },
  },
});