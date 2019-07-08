<template>
  <button :class="theme" v-if="type == 'button'">
    <span>
      <slot></slot>
    </span>
  </button>
  <a :class="theme" target="_blank" v-else-if="type == 'link'">
    <span>
      <slot></slot>
    </span>
  </a>
</template>

<script>
  export default {
    name: "Button",
    props: {
      theme: {
        default: 'light',
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
  @import '../../assets/sass/ui-components/addbutton'
</style>
