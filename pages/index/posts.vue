<template>
  <div class="add-page">
    <div class="content">
      <nuxt-link class="back" :to="{ name: 'index' }">Close</nuxt-link>
      <perfect-scrollbar class="scroll-content">
        <nuxt-child></nuxt-child>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index-posts',
    transition: {
      name: 'add-page',
      mode: 'out-in'
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/add-pages/common'
</style>
