<template>
    <div class="multiselect-wrapper" :class="{ opened: selectIsOpened }">
      <span class="multiselect-title">
        <slot></slot>
      </span>
      <multiselect :preselect-first="preselectedFirst ? true : false" :placeholder="placeholder" v-if="!object" :allow-empty="false" @open="setOpened(true);" :searchable="false" @close="setOpened(false);" v-model="curValue" :show-labels="false" :options="options" open-direction="bottom">
      </multiselect>
      <multiselect :preselect-first="preselectedFirst ? true : false" :placeholder="placeholder" v-else label="name" track-by="name" :allow-empty="false" @open="setOpened(true);" :searchable="false" @close="setOpened(false);" v-model="curValue" :show-labels="false" :options="options" open-direction="bottom">
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
    props: ['options', 'object', 'value', 'placeholder', 'preselectedFirst'],
    data() {
      return {
        selectIsOpened: false,
        curValue: this.value
      }
    },
    methods: {
      setOpened(val) {
        this.selectIsOpened = val;
      }
    },
    watch: {
      curValue() {
        this.$emit('input', this.curValue);
      },
      value() {
        this.curValue = this.value;
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="sass">
  @import "../../assets/sass/ui-components/select"
</style>
