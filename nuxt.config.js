module.exports = {
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  modules: [
    'nuxt-fullpage.js',
    '@nuxtjs/axios',
  ],

  axios: {
    proxy: true
  },

  proxy: {
    '/api': 'http://noilprod-test.ru.xsph.ru/wp-admin/admin-ajax.php',
  },

  plugins: [
    {src: '~/plugins/perfect-scrollbar.js', ssr: false},
    {src: '~/plugins/awesome-swiper.js', ssr: false}
  ],

  css: [
    'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.min.css',
    'swiper/dist/css/swiper.css'
  ],

  build: {
    /*
    ** Run ESLint on save
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
    */
  }
}

