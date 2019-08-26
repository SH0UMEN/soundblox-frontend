<template>
  <div>
    <app-header :links="{ facebook: settings.facebook, linkedin: settings.linkedin }" :is-tablet="isTablet" @to-contact-page="showInfo = false" :info-page="showInfo" :hidden="header.hide" :index-page="$route.name == 'index'" :theme="($route.name != 'index') ? 'light' : header.theme">
    </app-header>
    <main>
      <transition name="popup">
        <popup v-if="popup.isShown" :text="popup.text" :title="popup.title"></popup>
      </transition>
      <nuxt-child></nuxt-child>
      <div ref="fullpage" id="fullpage">
        <!-- Section 1 -->

        <section class="section main-screen">
          <main-slider :settings="mainSlider"></main-slider>
        </section>

        <!-- Section 2 -->

        <section class="section our-products">
          <span class="section-title">Nos produits</span>
          <perfect-scrollbar class="content">
            <span class="content-section-title">Nos produits</span>
            <div class="content-top" v-if="products.products['filters']">
              <main-select @input="filterProducts" v-model="products.filtersValues.utilization" :options="products.products['filters']['utilization']" class="select">Utilisation</main-select>
              <main-select @input="filterProducts" v-model="products.filtersValues.acoustic" :options="products.products['filters']['acoustic']" class="select">Acoustique</main-select>
              <main-select @input="filterProducts" v-model="products.filtersValues.thickness" :options="products.products['filters']['thickness']" class="select">Épaisseur</main-select>
            </div>
            <div class="content-main">
              <span v-if="productLoading">Loading ...</span>
              <span v-else-if="products.products['product_list'] && products.products['product_list'].length == 0">No products found</span>
              <div v-else v-for="(product, p) in products.products['product_list']" :key="p" class="item-card">
                <div class="item-image">
                  <img v-if="!productLoaded" :data-src="product.acf.picture" alt="">
                  <img v-else :src="product.acf.picture" alt="">
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
                    <main-button class="item-panel-button" @click="moveTo('contacts');contactForm.productName = product.post_title" theme="light">Commander</main-button>
                    <div class="item-panel-tags">
                      <add-button v-for="att in product.acf.attachments" type="link" :href="att.file" class="item-panel-tag">{{ att.label }}</add-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </section>

        <!-- Section 3 -->

        <section class="section our-references">
          <span class="section-title">Nos références</span>
          <perfect-scrollbar class="content">
            <span class="content-section-title">Nos références</span>
            <div class="content-top">
              <no-ssr>
                <perfect-scrollbar>
                  <button v-for="(works, cat) in references.refs['Categories']" @click="references.curCategory = cat;references.curProject = 0" :key="cat" :class="{'active': references.curCategory == cat}">
                    {{ cat }}
                  </button>
                </perfect-scrollbar>
              </no-ssr>
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
                        <button @click="(references.curProject == 0) ? (references.curProject=references.refs['References'][references.curCategory].length-1) : (references.curProject--)">Précédent</button>
                        <button @click="(references.curProject == references.refs['References'][references.curCategory].length-1) ? (references.curProject=0) : (references.curProject++)">Suivant</button>
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
            <span>Nous suivre</span>
            <form class="subscribe" @submit.prevent="checkSubscribe">
              <div class="row">
                <text-input :error="subscribe.error" :placeholder="subscribe.placeholder" v-model="subscribe.email" class="email">Souscrire</text-input>
                <main-button type="submit" theme="light">Souscrire</main-button>
              </div>
              <div class="row">
                <no-ssr><checkbox v-model="subscribe.accept" color="#3432FF" class="checkbox"><span @click.prevent.stop="showInfo = true;moveTo('contacts')">Je suis d'accord avec les termes et les conditions</span></checkbox></no-ssr>
              </div>
            </form>
          </div>
          <perfect-scrollbar class="content">
            <span class="content-section-title">Nous suivre</span>
            <div class="content-top">
              <main-select @input="filterNews" v-model="curTag" :object="true" :options="news.tags" class="select">Catégories</main-select>
            </div>
            <div class="content-main">
              <span v-if="newsLoading">Loading ...</span>
              <span v-else-if="news['news_list'] && news['news_list'].length == 0">News with this tag doesn't exist</span>
              <div v-else v-for="(row, i) in news.news_rows" :key="i" class="row">
                <div v-for="news in row" class="news">
                  <nuxt-link :to="{ name: 'index-posts-id', params: { id: news.ID }}" class="news-wrap">
                    <span class="date">{{(new Date(news.post_date)).getDate() }}.{{(new Date(news.post_date)).getMonth()+1 }}.{{(new Date(news.post_date)).getFullYear() }}</span>
                    <img v-if="!newsLoaded" :data-src="news.thumbnail" alt="">
                    <img v-else :src="news.thumbnail" alt="">
                    <span class="title">{{ news.post_title }}</span>
                  </nuxt-link>
                </div>
                <div v-if="((i+1)%3 == 0 || i == news.news_rows.length-1) && isTablet" class="sub">
                  <form class="subscribe" @submit.prevent="checkSubscribe">
                    <div class="row">
                      <text-input :error="subscribe.error" @focus="vhFix" @blur="vhFix" :placeholder="subscribe.placeholder" v-model="subscribe.email" class="email">Souscrire</text-input>
                      <main-button type="submit" theme="light">Subscribe</main-button>
                    </div>
                    <div class="row">
                      <no-ssr>
                        <checkbox v-model="subscribe.accept" color="#3432FF" class="checkbox"><span @click.prevent.stop="showInfo = true;moveTo('contacts')">Je suis d'accord avec les termes et les conditions</span></checkbox>
                      </no-ssr>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </section>
        <section class="section customer-opinion">
          <div class="section-title">
            <span>Avis<br>clients</span>
            <main-button class="to-feedback" tag="link" :to="{ name: 'index-leave-feedback' }" theme="light">Laisser un commentaire</main-button>
          </div>
          <perfect-scrollbar class="content without-title">
            <div class="content-section-title">
              <span>Avis clients</span>
              <main-button class="to-feedback" tag="link" :to="{ name: 'index-leave-feedback' }" theme="light">Laisser un commentaire</main-button>
            </div>
            <div class="content-top">
              <!-- nothing here -->
            </div>
            <div class="content-main">
              <span class="title">Nos partenaires</span>
              <perfect-scrollbar class="partners" ref="partners">
                <div v-for="row in partners_rows" class="row">
                  <div v-for="(partner, i) in row" :key="i" class="partner">
                    <img :data-src="partner.acf.logo" alt="">
                  </div>
                </div>
              </perfect-scrollbar>
              <span class="title">Avis clients</span>
              <div class="feedbacks">
                <div v-for="fb in feedbacks" class="feedback">
                  <div class="feedback-inner">
                    <div class="feedback-title">
                      <span class="cus-name">{{ fb.acf.name }}</span>
                      <span class="company">{{ fb.acf.enterprise }}</span>
                    </div>
                    <div class="feedback-content">
                      {{ fb.acf.message }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </section>
        <section class="section contacts">
          <div class="section-title">
            Some text here © Soundblox. All rights reserved.
            <span class="info" @click="showInfo = true">Conditions générales</span>
            <div class="links">
              <add-button class="link" type="link" :href="settings.linkedin">Linkedin</add-button>
              <add-button class="link" type="link" :href="settings.facebook">Facebook</add-button>
            </div>
          </div>
          <transition-group name="contacts">
            <perfect-scrollbar :key="1" v-show="showInfo" class="content info">
              <div class="content-top">
                <add-button class="back-btn" @click="showInfo = false">Back to contact page</add-button>
              </div>
              <div class="content-main">
                <span class="title">{{ info.post_title }}</span>
                <div class="info-content" v-html="info.post_content"></div>
              </div>
            </perfect-scrollbar>
            <perfect-scrollbar :key="2" v-show="!showInfo" class="content without-title">
              <div class="content-main">
                <span class="title">Contacts</span>
                <div class="contacts-list">
                  <div class="contact">
                    <span class="label">Numéro</span>
                    <span class="value">{{ settings.phone }}</span>
                  </div>
                  <div class="contact">
                    <span class="label">E-mail</span>
                    <span class="value">{{ settings.email }}</span>
                  </div>
                  <div class="contact">
                    <span class="label">Adresse</span>
                    <span class="value">{{ settings.adress }}</span>
                  </div>
                </div>
                <form @submit.prevent="" class="form">
                  <div class="col-3">
                    <main-select :preselected-first="true" v-model="contactForm.topic" :options="topics">Objet</main-select>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" placeholder="Entrez votre nom" v-model="contactForm.name" :error="contactFormErrors.name">Nom</text-input>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" placeholder="Entrez le nom de votre entreprise" v-model="contactForm.enterprise" :error="contactFormErrors.enterprise">Enterprise</text-input>
                  </div>
                  <div class="col-3">
                    <main-select placeholder="Sélectionner un produit" v-model="contactForm.productName" :options="productLabels">Nom de produit</main-select>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" placeholder="Entrez votre e-mail" v-model="contactForm.email" :error="contactFormErrors.email">E-mail</text-input>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" placeholder="Entrez votre numéro de téléphone" v-model="contactForm.phone" :error="contactFormErrors.phone">Numéro de téléphone</text-input>
                  </div>
                  <div class="col-12">
                    <text-input class="t-input ta" type="text-area" v-model="contactForm.message" placeholder="Entrez votre message ici">Message</text-input>
                  </div>
                  <no-ssr>
                    <div class="accept">
                      <checkbox class="checkbox" color="#3432FF" v-model="contactForm.accept"><span @click.prevent.stop="showInfo = true">Je suis d'accord avec les termes et les conditions</span></checkbox>
                      <span class="accept-error" :class="{ 'hide': contactFormErrors.accept.length == 0 }">{{ contactFormErrors.accept }}</span>
                    </div>
                  </no-ssr>
                  <main-button class="confirm" theme="light" @click="checkContactForm">Confirmer</main-button>
                </form>
                <div class="section-title section-title-dub">
                  <div class="left">
                    Some text here © Soundblox. All rights reserved.
                    <span class="info" @click="showInfo = true">Information officielle</span>
                  </div>
                  <div class="links">
                    <add-button class="link" type="link" :href="settings.linkedin">Linkedin</add-button>
                    <add-button class="link" type="link" :href="settings.facebook">Facebook</add-button>
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </transition-group>
        </section>
      </div>
    </main>
    <script src="/libs/fullpage.min.js"></script>
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
    TextInput
  },
  data() {
    return {
      // Interactive

      productLoading: false,
      productLoaded: false,
      newsLoading: false,
      newsLoaded: false,
      height: 0,

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
      emailRegex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

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
        placeholder: "Entrer votre email",
        email: '',
        error: '',
        accept: false
      },
      curTag: {name: 'Tous', slug: ''},
      news: {
        tags: [],
        news_rows: []
      },
      // Contact

      showInfo: false,

      contactFormErrors: {
        topic: '',
        name: '',
        enterprise: '',
        productName: '',
        email: '',
        phone: '',
        message: '',
        accept: ''
      },

      contactForm: {
        topic: '',
        name: '',
        enterprise: '',
        productName: '',
        email: '',
        phone: '',
        message: '',
        accept: false
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.get('api/?action=init').then((res)=>{
      let result = {
        products: {
          products: res.data['Products'],
          filtersValues: {
            utilization: 'Tous',
            acoustic: 'Tous',
            thickness: 'Tous'
          },
        },
        news: res.data['News'],
        all_news: res.data['News'],
        mainSlider: {
          slides: res.data['Slides']
        },
        references: {
          curCategory: 'Tous',
          curProject: 0,
          refs: res.data['References']
        },
        feedbacks: res.data['Feedbacks'],
        partners_all: res.data['Partners'],
        partners_rows: [],
        topics: res.data['Topics'],
        productLabels: [],
        settings: res.data['Settings'],
        info: res.data['Info']
      },
        allReferences = [],
        productLabels = [];

      for(let prod of result.products.products['product_list']) {
        productLabels.push(prod.post_title)
      }

      result['productLabels'] = productLabels;

      result.references.refs['Categories'] = Object.assign({'Tous': 'Tous'}, result.references.refs['Categories']);

      for(let category in result.references.refs['References']) {
        allReferences = allReferences.concat(result.references.refs['References'][category]);
      }

      result.news = Object.assign({'news_rows': []}, result.news);
      result.references.refs['References'] = Object.assign({'Tous': allReferences}, result.references.refs['References']);

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
      this.vhFix();
      this.$nextTick(this.fixHeight);

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
        anchors: ['main', 'our-products', 'our-references', 'news', 'customer-opinion', 'contacts'],
        menu: 'nav.nav>ul',
        normalScrollElements: '.section .content, .scroll-content',
        afterRender: this.headerControl,
        onLeave: this.onLeave,
        animateAnchor: false
      });

      fullpage_api.setAllowScrolling(false);
      fullpage_api.setKeyboardScrolling(false);
    }, 500);

    this.partnersToRows();
    this.$nextTick(this.fixHeight);

    // Fixing vh

    this.vhFix();
  },
  watch: {
    isTablet() {
      if(this.isTablet == true) {
        setTimeout(this.headerControl, 1500);
      }

      this.newsToRows();
      this.partnersToRows();
      this.$nextTick(this.fixHeight);
    },
    isMobile() {
      this.newsToRows();
      this.partnersToRows();
      this.$nextTick(this.fixHeight);
    }
  },
  beforeRouteUpdate(to, from, next) {
    if(from.query['showInfo'] == true) {
      setTimeout(()=>{
        this.showInfo = true;
        this.moveTo('contacts');
      }, 100);
    }
    next()
  },
  methods: {
    // Log

    log(mes) {
      console.log(mes)
    },

    // Partners

    partnersToRows() {
      let partnersInRow = 8;

      if(this.isMobile) {
        partnersInRow = 3;
      } else if(this.isTablet) {
        partnersInRow = 6;
      }

      if(this.partners_all.length <= partnersInRow) {
        this.partners_rows[0] = this.partners_all;
      } else if (this.partners_all.length <= partnersInRow*2) {
        this.partners_rows[0] = this.partners_all.slice(0, partnersInRow);
        this.partners_rows[1] = this.partners_all.slice(partnersInRow, this.partners_all.length);
      } else {
        let mid = Math.round(this.partners_all.length/2);
        this.partners_rows[0] = this.partners_all.slice(0, mid);
        this.partners_rows[1] = this.partners_all.slice(mid, this.partners_all.length);
      }
    },

    fixHeight() {
      let partners = document.querySelectorAll('.partner'),
          height = 0;

      for(let i = 0; i < partners.length; i++) {
        let loopH = partners[i].clientWidth;
        if(loopH > height) {
          height = loopH;
        }
      }

      for(let i = 0; i < partners.length; i++) {
        partners[i].style.height = height+'px';
      }
    },

    // Products

    filterProducts() {
      let query = '',
          filters = this.products.filtersValues;

      this.productLoading = true;
      this.productLoaded = true;

      for(let k in filters) {
        if(filters[k] != 'Tous') {
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
      if(!this.emailRegex.test(this.subscribe.email)) {
        this.subscribe.error = "Email incorrecte";
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
            this.clearForms();
            this.showPopup('You have subscribed', 'Thank you for your trust.</br>We will keep you updated.');
          }
        });
      }
    },

    filterNews() {
      this.newsLoading = true;
      this.newsLoaded = true;

      this.$axios.get('api/?action=get-news'+((this.curTag.name!='Tous') ? '&tag=' + this.curTag.slug : '')).then((res)=>{
        this.news.news_list = res.data;
        this.newsToRows();
        this.newsLoading = false;
      });
    },

    // Contacts

    checkContactForm() {
      let error = false;

      if(!this.emailRegex.test(this.contactForm.email)) {
        this.contactFormErrors.email = "Email incorrecte";
        error = true;
      } else {
        this.contactFormErrors.email = "";
      }

      if(this.contactForm.name.length == 0) {
        this.contactFormErrors.name = "Ce champ est requis";
        error = true;
      } else {
        this.contactFormErrors.name = "";
      }

      if(!this.contactForm.accept) {
        this.contactFormErrors.accept = "Ne confirmez pas votre accord";
        error = true;
      } else {
        this.contactFormErrors.accept = "";
      }

      if(this.contactForm.enterprise.length == 0) {
        this.contactFormErrors.enterprise = "Ce champ est requis";
        error = true;
      } else {
        this.contactFormErrors.enterprise = "";
      }

      if(this.contactForm.message.length == 0) {
        this.contactFormErrors.message = "Ce champ est requis";
        error = true;
      } else {
        this.contactFormErrors.message = "";
      }

      if(this.contactForm.phone.length == 0) {
        this.contactFormErrors.phone = "Ce champ est requis";
        error = true;
      } else {
        this.contactFormErrors.phone = "";
      }

      if(!error) {
        let fd = new FormData();
        fd.append('email', this.contactForm.email);
        fd.append('message', this.contactForm.message);
        fd.append('enterprise', this.contactForm.enterprise);
        fd.append('name', this.contactForm.name);
        fd.append('phone', this.contactForm.phone);
        fd.append('action', 'send-message');
        fd.append('product-name', this.contactForm.productName);
        fd.append('topic', this.contactForm.topic);


        this.$axios.post('api/', fd).then(res=>{
          this.clearForms();
          this.showPopup('Message sent', "Thanks for the message.<br>We will contact you shortly.");
        });
      }
    },

    // Common

    clearFilters() {
      this.curTag = this.news.tags[0];
      this.products.filtersValues.acoustic = this.products.products['filters']['acoustic'][0];
      this.products.filtersValues.utilization = this.products.products['filters']['utilization'][0];
      this.products.filtersValues.thickness = this.products.products['filters']['thickness'][0];
    },

    clearForms() {
      this.contactForm.topic = this.topics[0];
      this.contactForm.productName = '';
      this.contactForm.name = '';
      this.contactForm.phone = '';
      this.contactForm.email = '';
      this.contactForm.enterprise = '';
      this.contactForm.message = '';
      this.contactForm.accept = false;
      this.subscribe.email = "";
      this.subscribe.error = "";
      this.subscribe.accept = false;
      this.contactFormErrors.email = "";
      this.contactFormErrors.enterprise = "";
      this.contactFormErrors.phone = "";
      this.contactFormErrors.message = "";
      this.contactFormErrors.topic = "";
      this.contactFormErrors.productName = "";
      this.contactFormErrors.name = "";
      this.contactFormErrors.accept = "";
    },

    moveTo(section) {
      fullpage_api.moveTo(section, 0);
    },

    vhFix() {
      let vh = window.innerHeight * 0.01;
      this.height = vh;

      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },

    showPopup(title, text) {
      this.popup.title = title;
      this.popup.text = text;
      this.popup.isShown = true;

      setTimeout(()=>{
        this.popup.isShown = false
      }, 3000);
    },
    onLeave(origin, destination, direction) {
      (destination.anchor == 'main') ? (this.header.theme = 'dark') : (this.header.theme = 'light');

      this.clearForms();
      this.clearFilters();

      if(origin.anchor == 'contacts') {
        this.showInfo = false;
      }

      setTimeout(()=>{
        if(destination.anchor != 'our-products') {
          this.header.hide = false;
        }
      }, 500);
    },
    headerControl() {
      for(let elem of document.querySelectorAll('.content.ps')) {
        let lastScroll = 0;

        elem.addEventListener('scroll', (e) => {
          if(elem.scrollTop > lastScroll) {
            this.header.hide = true;
          } else {
            this.header.hide = false;
          }

          lastScroll = elem.scrollTop;
        })
      }
    }
  }
}
</script>

<style lang="sass">
  @import '../assets/sass/index'
</style>

