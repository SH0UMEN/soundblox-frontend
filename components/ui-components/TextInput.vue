<template>
  <label :class="{'error': error.length > 0}">
    <span class="error">{{ error }}</span>
    <span class="label"><slot></slot></span>
    <input @input="$emit('input', valueLocal)" v-model="valueLocal" :placeholder="placeholder" type="text">
  </label>
</template>

<script>
export default {
name: "TextInput",
  props: {
    placeholder: {
      type: String,
      default: "Enter the value"
    },
    value: {
      type: String,
      default: ""
    },
    error: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      valueLocal: this.value
    }
  }
}
</script>

<style scoped lang="sass">
  @import "../../assets/sass/ui-components/text-input"
</style>
