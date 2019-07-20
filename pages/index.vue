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
                    <main-button class="item-panel-button" @click="moveTo('contacts');contactForm.productName = product.post_title" theme="light">Order</main-button>
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
        <section class="section customer-opinion">
          <div class="section-title">
            <span>Сustomer<br>opinion</span>
            <main-button class="to-feedback" tag="link" :to="{ name: 'index-leave-feedback' }" theme="light">Leave feedback</main-button>
          </div>
          <perfect-scrollbar class="content without-title">
            <div class="content-section-title">
              <span>Сustomer opinion</span>
              <main-button class="to-feedback" tag="link" :to="{ name: 'index-leave-feedback' }" theme="light">Leave feedback</main-button>
            </div>
            <div class="content-top">
              <!-- nothing here -->
            </div>
            <div class="content-main">
              <span class="title">Our partners</span>
              <perfect-scrollbar class="partners" ref="partners">
                <div v-for="row in partners_rows" class="row">
                  <div v-for="(partner, i) in row" :key="i" class="partner">
                    <img :data-src="partner.acf.logo" alt="">
                  </div>
                </div>
              </perfect-scrollbar>
              <span class="title">Сustomer reviews</span>
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
            <span class="info" @click="showInfo = true">Official information</span>
            <div class="links">
              <add-button class="link" type="link" :href="settings.linkedin">Linkedin</add-button>
              <add-button class="link" type="link" :href="settings.facebook">Facebook</add-button>
            </div>
          </div>
          <transition-group name="contacts">
            <perfect-scrollbar :key="1" v-if="showInfo" class="content info">
              <div class="content-top">
                <add-button class="back-btn" @click="showInfo = false">Back to contact page</add-button>
              </div>
              <div class="content-main">
                <span class="title">Official information</span>
                <div class="lh-34">
                  InVision commits to strong and transparent privacy practices. Our Privacy Policy explains:
                  <ul>
                    <li>What Personal Data we collect and why we collect it</li>
                    <li>How we use Personal Data</li>
                    <li>Who we share Personal Data with</li>
                    <li>The choices we offer, including how to access, update, and remove Personal Data</li>
                  </ul>
                </div>
                <b>
                  Please read this Privacy Policy carefully. By using or accessing the Service (defined below), you acknowledge that you have read, understood, and agree to be bound to all the terms and conditions of this Privacy Policy, and the “Terms of Use” or other customer agreement between you and InVision that is applicable to the particular Service you are using or accessing (collectively, “User Agreements”).
                  <br><br>
                  If you do not agree to this Privacy Policy and the applicable User Agreement, please exit, and do not access or use, the Service.
                </b>
                We have kept this simple for your understanding, but if you’re not familiar with terms like “cookies” or “IP addresses,” feel free to contact us. Your privacy is really important to us, so whether you’re new to InVision or a long-time user, please take the time to get to know our practices. Click on any of the links below to go straight to one of the following sections:
                <span class="title">Introduction</span>
                <span class="last">
                  This Privacy Policy (“Privacy Policy”) sets forth the privacy practices of InVisionApp Inc. and its current and future InVision Affiliates (collectively, “InVision”) for all InVision software and applications (including, without limitation, mobile software and applications) (collectively, the “Software”); the InVision websites located at <a
                  href="https://www.invisionapp" target="_blank">www.invisionapp.com</a>, <a href="https://designbetter.co" target="_blank">designbetter.co</a>, <a
                  href="https://muz.li" target="_blank">muz.li</a> and any other InVision websites or services that link to this Privacy Policy, (collectively, the “Websites”); and all other InVision products or services provided or otherwise made accessible on or through the Software or the Websites or that otherwise link to or reference this Privacy Policy. The Software, the Websites, and any other InVision products or services that link or refer to this Privacy Policy are collectively referred to as the “Service.” This Privacy Policy describes how InVision collects, discloses, stores, transfers, and uses information that could individually identify our users (“Personal Data”) in connection with our Service.
                  <br><br>
                  This Privacy Policy does not apply to the practices of third parties, as explained in more detail below. In this Privacy Policy, “we,” “us,” “our,” and other similar references mean InVision, “you” and “your” and other similar references mean any user of the Service, and “InVision Affiliates” means any parent, subsidiary, member, officer, director, employee, agent, or contractor of InVision or any entity under common control with InVision.
                  <br><br>
                  This policy applies (i) immediately to new users who use or access the Service on or after the Effective Date and (ii) on the Effective Date to users who use or access the Service before the Effective Date.
                  <br><br>
                  Please contact us if you have any questions or comments about our privacy practices. You can reach us online at privacy@invisionapp.com or by mail at the address listed in the “What If You Have Questions Regarding Your Personal Data?” section below.
                </span>
              </div>
            </perfect-scrollbar>
            <perfect-scrollbar :key="2" v-else class="content without-title">
              <div class="content-main">
                <span class="title">Contacts</span>
                <div class="contacts-list">
                  <div class="contact">
                    <span class="label">Phone</span>
                    <span class="value">{{ settings.phone }}</span>
                  </div>
                  <div class="contact">
                    <span class="label">E-mail</span>
                    <span class="value">{{ settings.email }}</span>
                  </div>
                  <div class="contact">
                    <span class="label">Adress</span>
                    <span class="value">{{ settings.adress }},</span>
                  </div>
                </div>
                <form @submit.prevent="" class="form">
                  <div class="col-3">
                    <main-select :preselected-first="true" v-model="contactForm.topic" :options="topics">Topic</main-select>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" v-model="contactForm.name" :error="contactFormErrors.name">Name</text-input>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" v-model="contactForm.enterprise" :error="contactFormErrors.enterprise">Enterprise</text-input>
                  </div>
                  <div class="col-3">
                    <main-select placeholder="Select product" v-model="contactForm.productName" :options="productLabels">Product name</main-select>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" v-model="contactForm.email" :error="contactFormErrors.email">E-mail</text-input>
                  </div>
                  <div class="col-3">
                    <text-input class="t-input" v-model="contactForm.phone" :error="contactFormErrors.phone">Telephone</text-input>
                  </div>
                  <div class="col-12">
                    <text-input class="t-input ta" type="text-area" v-model="contactForm.message" placeholder="Enter your message here">Message</text-input>
                  </div>
                  <no-ssr>
                    <checkbox class="checkbox" color="#3432FF" v-model="contactForm.accept">I agree with terms and conditions</checkbox>
                  </no-ssr>
                  <main-button class="confirm" theme="light" @click="checkContactForm">Confirm</main-button>
                </form>
                <div class="section-title section-title-dub">
                  <div class="left">
                    Some text here © Soundblox. All rights reserved.
                    <span class="info" @click="showInfo = true">Official information</span>
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
        placeholder: "Enter your email",
        email: '',
        error: '',
        accept: false
      },
      curTag: {name: 'All', slug: ''},
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
        message: ''
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
        },
        feedbacks: res.data['Feedbacks'],
        partners_all: res.data['Partners'],
        partners_rows: [],
        topics: res.data['Topics'],
        productLabels: [],
        settings: res.data['Settings']
      },
        allReferences = [],
        productLabels = [];

      for(let prod of result.products.products['product_list']) {
        productLabels.push(prod.post_title)
      }

      result['productLabels'] = productLabels;

      result.references.refs['Categories'] = Object.assign({'All': 'All'}, result.references.refs['Categories']);

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
    }, 500);

    this.partnersToRows();
    this.$nextTick(this.fixHeight);
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
      if(!this.emailRegex.test(this.subscribe.email)) {
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
            this.showPopup('You have subscribed', 'Thank you for your trust.</br>We will keep you updated.');
          }
        });
      }
    },

    filterNews() {
      this.newsLoading = true;
      this.newsLoaded = true;

      this.$axios.get('api/?action=get-news'+((this.curTag.name!='All') ? '&tag=' + this.curTag.slug : '')).then((res)=>{
        this.news.news_list = res.data;
        this.newsToRows();
        this.newsLoading = false;
      });
    },

    // Contacts

    checkContactForm() {
      let error = false;

      if(!this.emailRegex.test(this.contactForm.email)) {
        this.contactFormErrors.email = "Incorrect email";
        error = true;
      } else {
        this.contactFormErrors.email = "";
      }

      if(this.contactForm.name.length == 0) {
        this.contactFormErrors.name = "This field is required";
        error = true;
      } else if(!this.contactForm.accept) {
        this.contactFormErrors.name = "Confirm your agree";
        error = true;
      } else {
        this.contactFormErrors.name = "";
      }

      if(this.contactForm.enterprise.length == 0) {
        this.contactFormErrors.enterprise = "This field is required";
        error = true;
      } else {
        this.contactFormErrors.enterprise = "";
      }

      if(this.contactForm.message.length == 0) {
        this.contactFormErrors.message = "This field is required";
        error = true;
      } else {
        this.contactFormErrors.message = "";
      }

      if(this.contactForm.phone.length == 0) {
        this.contactFormErrors.phone = "This field is required";
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
          this.showPopup('Message sent', 'Thanks for the message. <br>We will contact you shortly.');
        });
      }
    },

    // Common

    moveTo(section) {
      fullpage_api.moveTo(section, 0);
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

