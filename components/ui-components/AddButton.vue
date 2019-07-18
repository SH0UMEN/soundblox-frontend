<template>
  <button :class="theme" @click="$emit('click')" v-if="type == 'button'">
    <span>
      <slot></slot>
    </span>
  </button>
  <a :class="theme" target="_blank" v-else-if="type == 'link'">
    <span>
      <slot></slot>
    </span>
  </a>
  <nuxt-link :to="to" v-else-if="type == 'nuxt-link'" :class="theme">
    <span>
      <slot></slot>
    </span>
  </nuxt-link>
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
      },
      to: Object
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/ui-components/addbutton'
</style>
