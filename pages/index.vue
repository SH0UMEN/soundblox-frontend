<template>
  <div>
    <app-header :hidden="header.hide" :theme="header.theme">
    </app-header>
    <main>
      <transition name="popup">
        <popup v-if="popup.isShown" :text="popup.text" :title="popup.title"></popup>
      </transition>
      <full-page ref="fullpage" :options="options" id="fullpage">
        <!-- Section 1 -->

        <section class="section main-screen">
          <span class="instruction">Scroll down</span>
          <main-slider :settings="mainSlider"></main-slider>
        </section>

        <!-- Section 2 -->

        <section class="section our-products">
          <span class="section-title">Our products</span>
          <div class="content">
            <div class="content-top">
              <main-select class="select">Utilization</main-select>
              <main-select class="select">Acoutsic</main-select>
              <main-select class="select">Thickness</main-select>
            </div>
            <div class="content-main">
              <div class="item-card">
                <div class="item-image">
                  <img src="/img/item-image.png" alt="">
                </div>
                <div class="item-content">
                  <span class="item-title">Product name</span>
                  <p class="item-desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam cumque cupiditate debitis ducimus earum eligendi et maiores, minus nisi placeat quisquam, voluptate. Debitis deleniti excepturi sunt? Modi quasi rerum tempore!</p>
                  <div class="item-props">
                    <div class="item-prop">
                      <span class="item-prop-title">Acoustique</span>
                      <span class="item-prop-value">RA = 54 dB / aw=0,6</span>
                    </div>
                    <div class="item-prop">
                      <span class="item-prop-title">Acoustique</span>
                      <span class="item-prop-value">RA = 54 dB / aw=0,6</span>
                    </div>
                    <div class="item-prop">
                      <span class="item-prop-title">Acoustique</span>
                      <span class="item-prop-value">RA = 54 dB / aw=0,6</span>
                    </div>
                  </div>
                  <div class="item-panel">
                    <main-button class="item-panel-button" theme="light">Order</main-button>
                    <div class="item-panel-tags">
                      <span class="item-panel-tag">Technical sheet</span>
                      <span class="item-panel-tag">Re acoustics</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-card">
                <div class="item-image">
                  <img src="/img/item-image.png" alt="">
                </div>
                <div class="item-content">
                  <span class="item-title">Product name</span>
                  <p class="item-desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam cumque cupiditate debitis ducimus earum eligendi et maiores, minus nisi placeat quisquam, voluptate. Debitis deleniti excepturi sunt? Modi quasi rerum tempore!</p>
                  <div class="item-props">
                    <div class="item-prop">
                      <span class="item-prop-title">Acoustique</span>
                      <span class="item-prop-value">RA = 54 dB / aw=0,6</span>
                    </div>
                    <div class="item-prop">
                      <span class="item-prop-title">Acoustique</span>
                      <span class="item-prop-value">RA = 54 dB / aw=0,6</span>
                    </div>
                    <div class="item-prop">
                      <span class="item-prop-title">Acoustique</span>
                      <span class="item-prop-value">RA = 54 dB / aw=0,6</span>
                    </div>
                  </div>
                  <div class="item-panel">
                    <main-button class="item-panel-button" theme="light">Order</main-button>
                    <div class="item-panel-tags">
                      <span class="item-panel-tag">Technical sheet</span>
                      <span class="item-panel-tag">Re acoustics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3 -->

        <section class="section our-references">
          <span class="section-title">Our references</span>
          <div class="content">
            <div class="content-top">
              <perfect-scrollbar>
                <button v-for="(works, cat) in references.refs['Categories']" @click="references.curCategory = cat; references.curProject = 0" :key="cat" :class="{'active': references.curCategory == cat}">
                  {{ cat }}
                </button>
              </perfect-scrollbar>
            </div>
            <div class="content-main">
              <div class="content-display">
                <transition-group name="category-display">
                  <div v-for="cat in references.refs['Categories']" v-show="references.curCategory == cat" :key="cat" class="content-display-category">
                    <div v-for="(project, i) in references.refs['References'][references.curCategory]" v-show="references.curProject == i" :key="i" class="content-display-project">
                      <swiper class="swiper" :options="swiperOption">
                        <swiper-slide v-for="pres in project.files" class="swiper-slide">
                          <span class="slide-desc">{{ pres.title }}</span>
                          <img :src="pres.file" class="slide-img">
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                        <div class="swiper-button-prev" slot="button-prev"></div>
                        <div class="swiper-button-next" slot="button-next"></div>
                      </swiper>
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
          </div>
        </section>
      </full-page>
    </main>
  </div>
</template>

<script>
import AppHeader from '~/components/header/Header.vue'
import MainButton from '~/components/ui-components/Button.vue'
import AddButton from '~/components/ui-components/AddButton.vue'
import MainSelect from '~/components/ui-components/Select.vue'
import MainSlider from '~/components/main-slider/MainSlider.vue'
import Popup from '~/components/Popup.vue'

export default {
  components: {
    AppHeader,
    MainButton,
    AddButton,
    MainSelect,
    MainSlider,
    Popup
  },
  data() {
    return {
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

      // Fullpage

      options: {
        anchors: ['main', 'our-products', 'our-references'],
        menu: 'nav.nav>ul',
        onLeave: this.onLeave,
        normalScrollElements: '.our-products .content, .our-products .content .items',
        scrollOverflow: true,
        afterRender: this.headerControl
      },

      // Slider

      mainSlider: {
        slides: [
          {
            image: "/img/slide-1.png",
            mainText: "Excellent acoustic performance"
          },
          {
            image: "/img/slide-2.png",
            mainText: "Many architectural possibilities"
          },
          {
            image: "/img/slide-3.png",
            mainText: "Threesome"
          },
        ]
      },

      // References

      references: {
        curCategory: 'All',
        curProject: 0,
        refs: {}
      },
    }
  },
  mounted() {
    if(window.innerWidth <= 1024) {
      this.isTablet = true;
    }

    window.addEventListener('resize', ()=>{
      if(window.innerWidth <= 1024) {
        this.isTablet = true;
      } else {
        this.isTablet = false;
      }
    })

    // Init

    this.$axios.get('/api?action=get-references').then((res)=>{
      console.log(res.data);
      this.references.refs = Object.assign({},this.references.refs, res.data);
      this.references.refs['Categories'] = Object.assign({'All': 'All'}, this.references.refs['Categories']);
      this.extractAllReferences();
    });
  },
  watch: {
    isTablet() {
      if(this.isTablet == true) {
        setTimeout(this.headerControl, 1000);
      }
    }
  },
  methods: {
    // Our references

    extractAllReferences() {
      let allReferences = [];
      for(let category in this.references.refs['References']) {
        allReferences = allReferences.concat(this.references.refs['References'][category]);
      }
      this.references.refs['References'] = Object.assign({'All': allReferences}, this.references.refs['References']);
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
    },
    headerControl() {
      for(let elem of document.querySelectorAll('.fp-scrollable')) {
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

