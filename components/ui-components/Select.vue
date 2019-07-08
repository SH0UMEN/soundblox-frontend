<template>
    <div class="multiselect-wrapper" :class="{ opened: selectIsOpened }">
      <span class="multiselect-title">
        <slot></slot>
      </span>
      <multiselect @open="setOpened(true);" :searchable="false" @close="setOpened(false);" v-model="value" :show-labels="false" :options="options">
        <template slot="singleLabel" slot-scope="{ option }">{{ option }}</template>
      </multiselect>
    </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  export default {
    name: "Select",
    components: {
      Multiselect
    },
    data() {
      return {
        selectIsOpened: false,
        value: '',
        options: ['1', '2', '3']
      }
    },
    methods: {
      setOpened(val) {
        this.selectIsOpened = val;
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="sass">
  @import "../../assets/sass/ui-components/select"
</style>
