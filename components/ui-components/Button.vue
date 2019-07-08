<template>
  <button @click="$emit('click')" v-if="type == 'button'" :class="theme">
    <slot></slot>
  </button>
  <a @click="$emit('click')" v-else-if="type == 'link'" :class="theme">
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
      type: {
        default: 'button',
        type: String
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/ui-components/button'
</style>
