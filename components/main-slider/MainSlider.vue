<template>
  <div class="main-slider">
    <transition-group name="slider">
      <div class="main-slide" v-for="(slide, i) in settings.slides" v-show="curSlide == i" :key="i">
        <div class="slide-bg" :style="{ backgroundImage: 'url('+slide.acf.image.url+')' }"></div>
        <div class="content">
          <span class="title">{{ slide.post_title }}</span>
          <div class="main-slider-nav">
            <button :disabled="!prevActive" @click="prevSlide">prev</button>
            <button :disabled="!nextActive" @click="nextSlide(true);">next</button>
          </div>
          <div v-if="slide.acf.content" class="add-content">
            <span v-html="slide.acf.content"></span>
          </div>
          <div v-else class="add-content with-numbers">
            <div v-for="content in slide.acf.content_with_number" class="elem">
              <span class="label">{{ content.label }}</span>
              <span v-html="content.number" class="number"></span>
            </div>
          </div>
          <span class="slider-count"><span>{{ i+1 < 10 ? '0'+(i+1) : i+1 }}/{{ (slideCount < 10) ? '0'+slideCount : slideCount}}</span></span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: "MainSlider",
    props: {
      settings: {
        default: new Object(),
        type: Object
      }
    },
    data() {
      return {
        prevActive: false,
        nextActive: true,
        intervalID: null,
        curSlide: 0,
        slideCount: this.settings.slides.length
      }
    },
    watch: {
      settings: {
        handler() {
          this.slideCount = this.settings.slides.length;
        },
        deep: true
      }
    },
    mounted() {
      this.intervalID = setInterval(this.auto, 5000);
    },
    methods: {
      auto() {
        if(!this.nextSlide(false)) {
          this.curSlide = 0;
          this.nextActive = true;
          this.prevActive = false;

          this.disButtons();
        }
      },
      disButtons() {
        let prevValues = [this.prevActive, this.nextActive];
        this.prevActive = false;
        this.nextActive = false;

        setTimeout(()=>{
          this.prevActive = prevValues[0];
          this.nextActive = prevValues[1];
        }, 800)
      },
      prevSlide() {
        if(this.curSlide != 0) {
          clearInterval(this.intervalID);
          this.curSlide--;
          this.nextActive = true;

          if(this.curSlide == 0) {
            this.prevActive = false;
          }

          this.disButtons()
          this.intervalID = setInterval(this.auto, 5000);
        }
      },
      nextSlide(withRefresh) {
        let s = this.curSlide != this.slideCount - 1;
        if(s) {
          this.curSlide++;
          this.prevActive = true;

          if(this.curSlide == this.slideCount - 1) {
            this.nextActive = false;
          }

          this.disButtons();

          if(withRefresh) {
            clearInterval(this.intervalID);
            this.intervalID = setInterval(this.auto, 5000);
          }

          return s
        }
      }
    }
  }
</script>

<style lang="sass">
  @import "../../assets/sass/main-slider"
</style>
