import './firebase';
import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'

import Router from 'vue-router'


Vue.use(firestorePlugin);

Vue.use(Router);

new Vue({
  el: '#app',
  render: h => h(App)
});

