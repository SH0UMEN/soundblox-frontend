<template>
  <div class="add-page">
    <transition name="popup">
      <popup v-if="popup.isShown" :text="popup.text" :title="popup.title"></popup>
    </transition>
    <div class="content">
      <nuxt-link class="back" :to="{ name: 'index' }">Fermer</nuxt-link>
      <perfect-scrollbar class="scroll-content">
        <span class="title">Laisser un commentaire</span>
        <form @submit.prevent="">
          <div class="text">
            Thus, the strengthening and development of the structure plays an important role in the formation of participatory systems. Comrades! the beginning of the daily work on the formation of the position.
          </div>
          <div class="field">
            <text-input :error="errors.name" v-model="name" placeholder="Entrez votre nom">Nom</text-input>
          </div>
          <div class="field">
            <text-input :error="errors.enterprise" v-model="enterprise" placeholder="Entrez le nom de votre entreprise">Enterprise</text-input>
          </div>
          <div class="field">
            <text-input :error="errors.email" v-model="email" placeholder="Entrer votre email">Email</text-input>
          </div>
          <div class="field">
            <text-input :error="errors.message" v-model="message" type="text-area" placeholder="Entrez vos message ici">Message</text-input>
          </div>
          <no-ssr>
            <div class="accept">
              <checkbox :fontSize="12" color="#3432FF" class="checkbox" v-model="accept"><span @click.prevent.stop="toInfo">Je suis d'accord avec les termes et les conditions</span></checkbox>
              <span class="accept-error" :class="{ 'hide': errors.accept.length == 0 }">{{ errors.accept }}</span>
            </div>
          </no-ssr>
          <main-button class="confirm" @click="checkForm" theme="light">Envoyer</main-button>
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
        showInfo: false,
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
          accept: ''
        }
      }
    },
    transition: {
      name: 'add-page',
      mode: 'out-in'
    },
    beforeRouteLeave(to, from, next) {
      if(this.showInfo){
        from.query['showInfo'] = true
      }
      next();
    },
    methods: {
      toInfo() {
        this.showInfo = true;
        this.$router.push({ name: 'index' });
      },
      checkForm() {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            error = false;

        if(!emailRegex.test(this.email)) {
          this.errors.email = "Email incorrecte";
          error = true;
        } else {
          this.errors.email = "";
        }

        if(this.name.length == 0) {
          this.errors.name = "Ce champ est requis";
          error = true;
        } else {
          this.errors.name = "";
        }

        if(!this.accept) {
          this.errors.accept = "Confirmez votre accord";
          error = true;
        } else {
          this.errors.accept = '';
        }

        if(this.enterprise.length == 0) {
          this.errors.enterprise = "Ce champ est requis";
          error = true;
        } else {
          this.errors.enterprise = "";
        }

        if(this.message.length == 0) {
          this.errors.message = "Ce champ est requis";
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
            this.email = "";
            this.enterprise = "";
            this.name = "";
            this.message = "";
            this.accept = false;
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
