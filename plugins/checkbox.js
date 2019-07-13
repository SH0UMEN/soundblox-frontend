import Vue from 'vue'
import { globalCheckbox } from '../node_modules/vue-material-checkbox/src/main'

if (process.client) {
  Vue.use(globalCheckbox)
}
