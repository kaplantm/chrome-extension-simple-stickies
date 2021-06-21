import Vue from 'vue';
import App from './App.vue';

let hasInit = false;
chrome.runtime.onMessage.addListener(async () => {
  console.log('init?');
  if (!hasInit) {
    console.log('initing');
    hasInit = true;
    const id = 'simpleStickiesChromeApp';
    const elem = document.createElement('div');
    elem.id = id;
    document.body.appendChild(elem);

    Vue.config.productionTip = false;

    // eslint-disable-next-line no-new
    new Vue({
      el: `#${id}`,
      render: (h) => h(App),
    });
  }
});
