
      let options = {"masterHistoryType":"browser","base":"/","apps":[{"name":"app1","entry":"//localhost:9001"},{"name":"app2","entry":"//localhost:9002"}]};
      export const getMasterOptions = () => options;
      export const setMasterOptions = (newOpts) => options = ({ ...options, ...newOpts });
      