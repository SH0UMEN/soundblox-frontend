import Vue from 'vue'
import Fullpage from 'vue-fullpage.js'
import 'fullpage.js/dist/fullpage.css'

if (process.client) {
  Vue.use(Fullpage)
}
