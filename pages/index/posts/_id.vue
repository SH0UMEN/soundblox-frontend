<template>
  <div class="page">
    <span class="err" v-if="!news">This page does not exist</span>
    <div v-else class="page-inner">
      <span class="date"><span class="label">Date:</span>{{(new Date(news.date)).getDate() }}.{{(new Date(news.date)).getMonth()+1 }}.{{(new Date(news.date)).getFullYear() }}</span>
      <img class="thumbnail" :src="news.better_featured_image.source_url" alt="">
      <span class="title">{{ news.title.rendered }}</span>
      <div class="content" v-html="news.content.rendered"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    asyncData({$axios, route}) {
      return $axios.get('rest-api/posts/'+route.params.id).then(res=>{
        console.log(res.data);
        return {
          news: res.data
        }
      });
    }
  }
</script>

<style scoped lang="sass">
  @import "../../../assets/sass/add-pages/post"
</style>
