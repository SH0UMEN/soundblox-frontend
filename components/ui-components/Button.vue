<template>
  <button @click="$emit('click')" v-if="tag == 'button'" :class="theme">
    <slot></slot>
  </button>
  <nuxt-link @click="$emit('click')" :to="to" v-else-if="tag == 'link'" :class="theme">
    <slot></slot>
  </nuxt-link>
</template>

<script>
  export default {
    name: "Button",
    props: {
      to: Object,
      theme: {
        default: 'blue',
        type: String
      },
      tag: {
        default: 'button',
        type: String
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/ui-components/button'
</style>
