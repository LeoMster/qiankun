// export const qiankun = {
//   // 应用加载之前
//   async bootstrap(props) {
//     console.log('app1 bootstrap', props);
//   },
//   // 应用 render 之前触发
//   async mount(props) {
//     console.log('app1 mount', props);
//   },
//   // 应用卸载之后触发
//   async unmount(props) {
//     console.log('app1 unmount', props);
//   },
// };

// 从接口中获取子应用配置，export 出的 qiankun 变量是一个 promise
export const qiankun = fetch('/api/config')
  .then((res) => {
    return res.json();
  })
  .then(({ apps }) => {
    console.log(apps)
    return Promise.resolve({
      // 注册子应用信息
      apps,
      // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
      lifeCycles: {
        afterMount: (props) => {
          console.log(props);
        },
      },
      // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
    });
  });