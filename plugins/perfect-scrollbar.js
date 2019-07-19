import Vue from 'vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'

if (process.browser) {
  Vue.use(PerfectScrollbar);
}
