<template>
  <div class="page">
    <span class="err" v-if="!news">This page does not exist</span>
    <div v-else class="page-inner">
      <span class="date"><span class="label">Date:</span>{{(new Date(news.post_date)).getDate() }}.{{(new Date(news.post_date)).getMonth()+1 }}.{{(new Date(news.post_date)).getFullYear() }}</span>
      <img class="thumbnail" :src="news.thumbnail" alt="">
      <span class="title">{{ news.post_title }}</span>
      <div class="content" v-html="news.post_content"></div>
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
      return $axios.get('api/?action=get-new&slug='+route.params.slug).then(res=>{
        console.log(res.data);
        return {
          news: res.data[0]
        }
      });
    }
  }
</script>

<style scoped lang="sass">
  @import "../../../assets/sass/add-pages/post"
</style>
