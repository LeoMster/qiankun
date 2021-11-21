import { defineConfig } from 'umi';

export default defineConfig({
  devServer: {
    port: 9001
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none'
  }
});