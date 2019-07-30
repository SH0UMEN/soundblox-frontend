<template>
  <label :class="{'error': error.length > 0}">
    <span class="error">{{ error }}</span>
    <span class="label"><slot></slot></span>
    <input v-if="type == 'input'" @input="$emit('input', valueLocal)" v-model="valueLocal" :placeholder="placeholder" type="text">
    <textarea v-else-if="type == 'text-area'" @input="$emit('input', valueLocal)" v-model="valueLocal" :placeholder="placeholder"></textarea>
  </label>
</template>

<script>
export default {
name: "TextInput",
  props: {
    type: {
      type: String,
      default: "input"
    },
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
      valueLocal: ""
    }
  },
  watch: {
    value() {
      this.valueLocal = this.value;
    }
  }
}
</script>

<style scoped lang="sass">
  @import "../../assets/sass/ui-components/text-input"
</style>
