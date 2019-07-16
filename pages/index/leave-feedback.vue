<template>
  <div class="add-page">
    <transition name="popup">
      <popup v-if="popup.isShown" :text="popup.text" :title="popup.title"></popup>
    </transition>
    <div class="content">
      <nuxt-link class="back" :to="{ name: 'index' }">Close</nuxt-link>
      <perfect-scrollbar class="scroll-content">
        <span class="title">Leave Feedback</span>
        <form @submit.prevent="">
          <div class="text">
            Thus, the strengthening and development of the structure plays an important role in the formation of participatory systems. Comrades! the beginning of the daily work on the formation of the position.
          </div>
          <div class="field">
            <text-input :error="errors.name" v-model="name" placeholder="Enter your name">Name</text-input>
          </div>
          <div class="field">
            <text-input :error="errors.enterprise" v-model="enterprise" placeholder="Enter the name of your company">Enterprise</text-input>
          </div>
          <div class="field">
            <text-input :error="errors.email" v-model="email" placeholder="Enter your email">Email</text-input>
          </div>
          <div class="field">
            <text-input :error="errors.message" v-model="message" type="text-area" placeholder="Enter your feedback here">Message</text-input>
          </div>
          <no-ssr>
            <checkbox :fontSize="12" color="#3432FF" class="checkbox" v-model="accept">I agree with terms and conditions</checkbox>
          </no-ssr>
          <main-button class="confirm" @click="checkForm" theme="light">Confirm</main-button>
        </form>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
  import MainButton from '~/components/ui-components/Button'
  import TextInput from '~/components/ui-components/TextInput'
  import Popup from '~/components/Popup'

  export default {
    components: {
      TextInput,
      MainButton,
      Popup
    },
    data() {
      return {
        name: '',
        enterprise: '',
        email: '',
        message: '',
        accept: false,
        popup: {
          isShown: false,
          text: '',
          title: ''
        },
        errors: {
          name: "",
          enterprise: '',
          email: '',
          message: '',
        }
      }
    },
    transition: {
      name: 'add-page',
      mode: 'out-in'
    },
    methods: {
      checkForm() {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            error = false;

        if(!emailRegex.test(this.email)) {
          this.errors.email = "Incorrect email";
          error = true;
        } else {
          this.errors.email = "";
        }

        if(this.name.length == 0) {
          this.errors.name = "This field is required";
          error = true;
        } else if(!this.accept) {
          this.errors.name = "Confirm your agree";
          error = true;
        } else {
          this.errors.name = "";
        }

        if(this.enterprise.length == 0) {
          this.errors.enterprise = "This field is required";
          error = true;
        } else {
          this.errors.enterprise = "";
        }

        if(this.message.length == 0) {
          this.errors.message = "This field is required";
          error = true;
        } else {
          this.errors.message = "";
        }

        let fd = new FormData();
        fd.append('email', this.email);
        fd.append('message', this.message);
        fd.append('enterprise', this.enterprise);
        fd.append('name', this.name);
        fd.append('action', 'create-feedback');

        if(!error) {
          this.$axios.post('api/', fd).then(res=>{
            this.showPopup('Feedback sent', 'Thanks for the feedback.<br>Your feedback helps us get better.');
          });
        }
      },
      showPopup(title, text) {
        this.popup.title = title;
        this.popup.text = text;
        this.popup.isShown = true;

        setTimeout(()=>{
          this.popup.isShown = false;
        }, 3000);
      },
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/add-pages/common'
  @import '../../assets/sass/add-pages/leave-feedback'
  @import '../../assets/sass/popup'
</style>
