<template>
  <div class="popup">
    <div class="popup-content">
      <svg class="ok" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" cx="48" cy="48" r="46" stroke="blue" stroke-width="3" fill="none" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M69.2072 38.7072L45.0001 62.9143L33.293 51.2072L34.7072 49.793L45.0001 60.0859L67.793 37.293L69.2072 38.7072Z" fill="white"/>
      </svg>
      <span class="popup-title">{{ title }}</span>
      <span class="popup-text" v-html="text"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Popup",
    props: {
      title: {
        type: String,
        default: ""
      },
      text: {
        type: String,
        default: ""
      }
    }
  }
</script>

<style scoped lang="sass">
  @import "../assets/sass/popup"
</style>
