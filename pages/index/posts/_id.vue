<template>
  <div class="page">
    <transition name="news">
      <span class="err" v-if="!news">This page does not exist</span>
      <div v-else-if="show" class="page-inner">
        <span class="date"><span class="label">Date:</span>{{(new Date(news.date)).getDate() }}.{{(new Date(news.date)).getMonth()+1 }}.{{(new Date(news.date)).getFullYear() }}</span>
        <img v-if="news.better_featured_image" class="thumbnail" :src="news.better_featured_image.source_url" alt="">
        <span class="title">{{ news.title.rendered }}</span>
        <div class="content" v-html="news.content.rendered"></div>
        <div v-if="prev && next" class="nav">
          <span class="other">Autres articles</span>
          <nuxt-link class="news-nav" :to="{ name: 'index-posts-id', params: { id: prev }}">
            <div @click="show = false" class="news-nav-inner">
              <span>
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10.59L3.42 6L8 1.41L6.59 0L0.59 6L6.59 12L8 10.59Z" fill="black"/>
                </svg>
              </span>
              <span>Précédent</span>
            </div>
          </nuxt-link>
          <nuxt-link class="news-nav" :to="{ name: 'index-posts-id', params: { id: next }}">
            <div @click="show = false" class="news-nav-inner">
              <span>Suivant</span>
              <span>
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 1.41L4.58 6L0 10.59L1.41 12L7.41 6L1.41 0L0 1.41Z" fill="black"/>
                </svg>
              </span>
            </div>
          </nuxt-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: true
      }
    },
    name: 'index-posts-id',
    asyncData({$axios, route}) {
      return $axios.get('rest-api/posts/'+route.params.id).then(res=>{
        let news = res.data;

        return $axios.get('api/?action=next-and-prev-news&id='+route.params.id).then(res=>{
          return {
            news: news,
            next: res.data.next,
            prev: res.data.prev
          }
        });
      });
    },
    beforeRouteUpdate(to, from, next) {
      this.show = true;
      document.querySelector('.content .scroll-content').scrollTop = 0;
      next();
    },
    mounted() {
      let lastScroll = 0,
          elem = document.querySelector('.scroll-content'),
          header = document.querySelector('header');

      elem.addEventListener('scroll', (e) => {
        if(elem.scrollTop > lastScroll) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }

        lastScroll = elem.scrollTop;
      })
    }
  }
</script>

<style lang="sass">
  @import "../../../assets/sass/add-pages/post"
</style>
