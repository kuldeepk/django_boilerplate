// import mixpanel from 'mixpanel-browser';
// mixpanel.init('6cdf3d47de7bc9e009f5f6d9079a195e');

// //let env_check = process.env.NODE_ENV === 'production';
// let env_check = true;

// let actions = {
//   identify: (id) => {
//     if (env_check) mixpanel.identify(id);
//   },
//   alias: (id) => {
//     if (env_check) mixpanel.alias(id);
//   },
//   track: (name, props?: any) => {
//     if (env_check) mixpanel.track(name, props);
//   },
//   people: {
//     set: (props) => {
//       if (env_check) mixpanel.people.set(props);
//     },
//   },
// };

// export let Mixpanel = actions;