<template>
  <div>
    <app-header :hidden="header.hide" :theme="header.theme">
    </app-header>
    <main>
      <transition name="popup">
        <popup v-if="popup.isShown" :text="popup.text" :title="popup.title"></popup>
      </transition>
      <div ref="fullpage" id="fullpage">
        <!-- Section 1 -->

        <section class="section main-screen">
          <span class="instruction">Scroll down</span>
          <main-slider :settings="mainSlider"></main-slider>
        </section>

        <!-- Section 2 -->

        <section class="section our-products">
          <span class="section-title">Our products</span>
          <perfect-scrollbar class="content">
            <span class="content-section-title">Our products</span>
            <div class="content-top" v-if="products.products['filters']">
              <main-select @input="filterProducts" v-model="products.filtersValues.utilization" :options="products.products['filters']['utilization']" class="select">Utilization</main-select>
              <main-select @input="filterProducts" v-model="products.filtersValues.acoustic" :options="products.products['filters']['acoustic']" class="select">Acoutsic</main-select>
              <main-select @input="filterProducts" v-model="products.filtersValues.thickness" :options="products.products['filters']['thickness']" class="select">Thickness</main-select>
            </div>
            <div class="content-main">
              <span v-if="productLoading">Loading ...</span>
              <span v-else-if="products.products['product_list'] && products.products['product_list'].length == 0">No products found</span>
              <div v-else v-for="(product, p) in products.products['product_list']" :key="p" class="item-card">
                <div class="item-image">
                  <img :src="product.acf.picture" alt="">
                </div>
                <div class="item-content">
                  <span class="item-title">{{ product.post_title }}</span>
                  <p class="item-desc">{{ product.acf.description }}</p>
                  <div class="item-props">
                    <div v-for="(prop, k) in product.acf.properties" :key="k" class="item-prop">
                      <span class="item-prop-title">{{ prop.label }}</span>
                      <span class="item-prop-value">{{ prop.value }}</span>
                    </div>
                  </div>
                  <div class="item-panel">
                    <main-button class="item-panel-button" theme="light">Order</main-button>
                    <div class="item-panel-tags">
                      <span v-for="tag in product.acf.tags" class="item-panel-tag">{{ tag.tag }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </section>

        <!-- Section 3 -->

        <section class="section our-references">
          <span class="section-title">Our references</span>
          <perfect-scrollbar class="content">
            <span class="content-section-title">Our references</span>
            <div class="content-top">
              <perfect-scrollbar>
                <button v-for="(works, cat) in references.refs['Categories']" @click="references.curCategory = cat;references.curProject = 0" :key="cat" :class="{'active': references.curCategory == cat}">
                  {{ cat }}
                </button>
              </perfect-scrollbar>
            </div>
            <div class="content-main">
              <div class="content-display">
                <transition-group name="category-display" mode="out-in">
                  <div v-for="cat in references.refs['Categories']" v-if="references.curCategory == cat" :key="cat" class="content-display-category">
                    <div v-for="(project, i) in references.refs['References'][references.curCategory]" v-if="references.curProject == i" :key="i" class="content-display-project">
                      <div v-swiper:mySwiper="swiperOption" class="swiper">
                        <div class="swiper-wrapper">
                          <div v-for="(pres, k) in project.files" :key="cat+pres+k" class="swiper-slide">
                            <span class="slide-desc">{{ pres.title }}</span>
                            <img :src="pres.file" class="slide-img">
                          </div>
                        </div>
                        <div class="swiper-pagination" slot="pagination"></div>
                        <div class="swiper-button-prev" slot="button-prev"></div>
                        <div class="swiper-button-next" slot="button-next"></div>
                      </div>
                    </div>
                    <div v-if="references.refs['References'][references.curCategory][references.curProject]" class="control-panel">
                      <span class="project-counter">
                        <span class="pr">Projects</span>{{ references.curProject+1 }}/{{ references.refs['References'][references.curCategory].length }}
                      </span>
                      <span class="project-title">{{ references.refs['References'][references.curCategory][references.curProject].title }}</span>
                      <span class="project-desc">{{ references.refs['References'][references.curCategory][references.curProject].description }}</span>
                      <div class="project-switchers">
                        <button @click="(references.curProject == 0) ? (references.curProject=references.refs['References'][references.curCategory].length-1) : (references.curProject--)">Prev</button>
                        <button @click="(references.curProject == references.refs['References'][references.curCategory].length-1) ? (references.curProject=0) : (references.curProject++)">Next</button>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
          </perfect-scrollbar>
        </section>

        <!-- Section 4 -->

        <section class="section news">
          <div class="section-title">
            <span>News</span>
            <form class="subscribe" @submit.prevent="checkSubscribe">
              <div class="row">
                <text-input :error="subscribe.error" :placeholder="subscribe.placeholder" v-model="subscribe.email" class="email">Subscribe</text-input>
                <main-button type="submit" theme="light">Subscribe</main-button>
              </div>
              <div class="row">
                <no-ssr><checkbox v-model="subscribe.accept" color="#3432FF" class="checkbox">I agree with terms and conditions</checkbox></no-ssr>
              </div>
            </form>
          </div>
          <perfect-scrollbar class="content">
            <span class="content-section-title">News</span>
            <div class="content-top">
              <main-select @input="filterNews" v-model="curTag" :object="true" :options="news.tags" class="select">Categories</main-select>
            </div>
            <div class="content-main">
              <span v-if="newsLoading">Loading ...</span>
              <span v-else-if="news['news_list'] && news['news_list'].length == 0">News with this tag doesn't exist</span>
              <div v-else v-for="(row, i) in news.news_rows" :key="i" class="row">
                <div v-for="news in row" class="news">
                  <nuxt-link :to="'posts/'+news.post_name" class="news-wrap">
                    <span class="date">{{(new Date(news.post_date)).getDate() }}.{{(new Date(news.post_date)).getMonth()+1 }}.{{(new Date(news.post_date)).getFullYear() }}</span>
                    <img :src="news.thumbnail" alt="">
                    <span class="title">{{ news.post_title }}</span>
                  </nuxt-link>
                </div>
                <div v-if="((i+1)%3 == 0 || i == news.news_rows.length-1) && isTablet" class="sub">
                  <form class="subscribe" @submit.prevent="checkSubscribe">
                    <div class="row">
                      <text-input :error="subscribe.error" :placeholder="subscribe.placeholder" v-model="subscribe.email" class="email">Subscribe</text-input>
                      <main-button type="submit" theme="light">Subscribe</main-button>
                    </div>
                    <div class="row">
                      <no-ssr>
                        <checkbox v-model="subscribe.accept" color="#3432FF" class="checkbox">I agree with terms and conditions</checkbox>
                      </no-ssr>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </section>
      </div>
    </main>
    <script src="libs/fullpage.min.js"></script>
  </div>
</template>

<script>
import AppHeader from '~/components/header/Header.vue'
import MainButton from '~/components/ui-components/Button.vue'
import AddButton from '~/components/ui-components/AddButton.vue'
import MainSelect from '~/components/ui-components/Select.vue'
import MainSlider from '~/components/main-slider/MainSlider.vue'
import TextInput from '~/components/ui-components/TextInput.vue'
import Popup from '~/components/Popup.vue'
import axios from '@nuxtjs/axios'


export default {
  components: {
    AppHeader,
    MainButton,
    AddButton,
    MainSelect,
    MainSlider,
    Popup,
    TextInput,
  },
  data() {
    return {
      // Interactive

      productLoading: false,
      newsLoading: false,

      // Swiper

      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },

      // Common

      isTablet: false,
      isMobile: false,

      // Header

      header: {
        theme: 'dark',
        hide: false
      },

      // Popup

      popup: {
        title: "",
        text: "",
        isShown: false
      },

      // Slider

      mainSlider: {
        slides: [
        ]
      },

      references: {
        refs: {}
      },

      // Products

      products: {
        products: {}
      },

      // News

      subscribe: {
        placeholder: "Enter your email",
        email: '',
        error: '',
        accept: false
      },
      curTag: {name: 'All', slug: ''},
      news: {
        tags: [],
        news_rows: []
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.get('api/?action=init').then((res)=>{
      let result = {
        products: {
          products: res.data['Products'],
          filtersValues: {
            utilization: 'Dont matter',
            acoustic: 'Dont matter',
            thickness: 'Dont matter'
          },
        },
        news: res.data['News'],
        mainSlider: {
          slides: res.data['Slides']
        },
        references: {
          curCategory: 'All',
          curProject: 0,
          refs: res.data['References']
        }
      };

      result.references.refs['Categories'] = Object.assign({'All': 'All'}, result.references.refs['Categories']);

      let allReferences = [];

      for(let category in result.references.refs['References']) {
        allReferences = allReferences.concat(result.references.refs['References'][category]);
      }
      result.news = Object.assign({'news_rows': []}, result.news);
      result.references.refs['References'] = Object.assign({'All': allReferences}, result.references.refs['References']);

      return result;

    });
  },
  mounted() {
    if(window.innerWidth <= 1024) {
      this.isTablet = true;
    }

    if(window.innerWidth <= 768) {
      this.isMobile = true;
    }

    window.addEventListener('resize', ()=>{
      if(window.innerWidth <= 1024) {
        this.isTablet = true;
      } else {
        this.isTablet = false;
      }

      if(window.innerWidth <= 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    this.newsToRows();

    setTimeout(()=>{
      new fullpage('#fullpage', {
        anchors: ['main', 'our-products', 'our-references', 'news'],
        menu: 'nav.nav>ul',
        normalScrollElements: '.our-products .content',
        afterRender: this.headerControl,
        onLeave: this.onLeave
      })
    }, 500);
  },
  watch: {
    isTablet() {
      if(this.isTablet == true) {
        setTimeout(this.headerControl, 1500);
      }

      this.newsToRows();
    },
    isMobile() {
      this.newsToRows();
    }
  },
  methods: {
    // Log

    log(mes) {
      console.log(mes)
    },

    // Products

    filterProducts() {
      let query = '',
          filters = this.products.filtersValues;

      this.productLoading = true;

      for(let k in filters) {
        if(filters[k] != 'Dont matter') {
          query+='&'+k+'='+filters[k];
        }
      }

      this.$axios.get('api/?action=get-products'+query).then((res)=>{
        this.products.products['product_list'] = res.data;
        this.productLoading = false;
      });
    },

    // News

    newsToRows() {
      let newsRows = [],
          newsInRow = 4,
          curItem = 0,
          row = [],
          news = this.news.news_list;

      if(this.isMobile) {
        newsInRow = 1;
      } else if(this.isTablet) {
        newsInRow = 3;
      }

      for(let i = 0; i < news.length; i++) {
        if(curItem != newsInRow && i < news.length - 1) {
          row.push(news[i]);
          curItem++;
        } else if(i == news.length-1) {
          if(curItem == newsInRow) {
            newsRows.push(row);
            row = [];
          }

          row.push(news[i]);
          newsRows.push(row);
        } else if(curItem == newsInRow) {
          newsRows.push(row);
          row = [];
          curItem = 0;
          row.push(news[i]);
          curItem++;
        }
      }

      this.news['news_rows'] = newsRows;
    },

    checkSubscribe() {
      let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!emailRegex.test(this.subscribe.email)) {
        this.subscribe.error = "Incorrect email";
      } else if(!this.subscribe.accept) {
        this.subscribe.error = "Confirm your agree";
      } else {
        this.subscribe.error = "";

        let fd = new FormData();
        fd.append('email', this.subscribe.email);
        fd.append('action', 'sub')

        this.$axios.post('api/', fd).then(res=>{
          if(res.data == 0) {
            this.subscribe.error = "You're subscribed already";
          } else {
            this.showPopup('You have subscribed', 'Thank you for your trust. </br> We will keep you updated.');
          }
        });
      }
    },

    filterNews() {
      this.newsLoading = true;

      this.$axios.get('api/?action=get-news'+((this.curTag.name!='All') ? '&tag=' + this.curTag.slug : '')).then((res)=>{
        this.news.news_list = res.data;
        this.newsToRows();
        this.newsLoading = false;
      });
    },

    showPopup(title, text) {
      this.popup.title = title;
      this.popup.text = text;
      this.popup.isShown = true;

      setTimeout(()=>{
        this.popup.isShown = false;
      }, 3000);
    },
    onLeave(origin, destination, direction) {
      (destination.anchor == 'main') ? (this.header.theme = 'dark') : (this.header.theme = 'light');

      setTimeout(()=>{
        if(destination.anchor != 'our-products') {
          this.header.hide = false;
        }
      }, 500);
    },
    headerControl() {
      for(let elem of document.querySelectorAll('.content.ps')) {
        elem.addEventListener('wheel', (e) => {
          if(e.deltaY > 0) {
            this.header.hide = true;
          } else if (e.deltaY < 0) {
            this.header.hide = false;
          }
        })
      }
    }
  }
}
</script>

<style lang="sass">
  @import '../assets/sass/index'
</style>

