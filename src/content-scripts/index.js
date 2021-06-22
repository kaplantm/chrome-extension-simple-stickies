import Vue from 'vue';
import App from './App.vue';

const id = 'simpleStickiesChromeAppWrapper';

const hasEl = document.getElementById(id);

if (!hasEl) {
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
