module.exports = {
  loading: false,

  /*
  ** Headers of the page
  */
  head: {
    title: 'soundblox-frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Soundblox frontend via nuxt.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'}
    ]
  },
  /*
  ** Build configuration
  */
  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    proxy: true
  },

  proxy: {
    '/api/': { target: 'http://noilprod-test.ru.xsph.ru/wp-admin/admin-ajax.php', pathRewrite: {'^/api/': ''} },
    '/rest-api/': { target: 'http://noilprod-test.ru.xsph.ru/wp-json/wp/v2', pathRewrite: {'^/rest-api/': ''} },
  },

  plugins: [
    {src: '~/plugins/perfect-scrollbar.js', mode: 'client'},
    {src: '~/plugins/awesome-swiper.js', ssr: false},
    {src: '~/plugins/checkbox.js', ssr: false},
  ],

  css: [
    'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.min.css',
    'swiper/dist/css/swiper.css',
    '~/static/libs/block-library/style.min.css'
  ],
}

