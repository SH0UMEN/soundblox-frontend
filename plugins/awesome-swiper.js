import Vue from 'vue'
import AwesomeSwiper from 'vue-awesome-swiper'

if (process.client) {
  Vue.use(AwesomeSwiper)
}
