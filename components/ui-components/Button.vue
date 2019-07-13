<template>
  <button @click="$emit('click')" v-if="tag == 'button'" :class="theme">
    <slot></slot>
  </button>
  <a @click="$emit('click')" v-else-if="tag == 'link'" :class="theme">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: "Button",
    props: {
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
