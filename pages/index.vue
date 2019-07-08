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
            <div class="filters">
              <main-select class="select">Utilization</main-select>
              <main-select class="select">Acoutsic</main-select>
              <main-select class="select">Thickness</main-select>
            </div>
            <div class="items">
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
                    <main-button theme="light">Order</main-button>
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
                    <main-button theme="light">Order</main-button>
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
                    <main-button @click="showPopup('Hello!', 'Lorem ipsum')" theme="light">Order</main-button>
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

        <section class="section main-screen">
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
        anchors: ['main', 'our-products'],
        menu: 'nav.nav>ul',
        onLeave: this.onLeave,
        normalScrollElements: '.our-products .content, .our-products .content .items',
        scrollOverflow: true,
        afterRender: this.afterRender
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
      }
    }
  },
  methods: {
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
    afterRender() {
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

