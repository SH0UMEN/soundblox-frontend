<template>
  <div class="main-slider" ref="slider">
    <transition-group name="slider">
      <div class="main-slide" v-for="(slide, i) in settings.slides" v-show="curSlide == i" :key="i">
        <div class="slide-bg" :style="{ backgroundImage: 'url('+slide.acf.image.url+')' }"></div>
        <div class="content">
          <span class="title" :id="'title-slide-'+i">{{ slide.post_title }}</span>
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
        letterDelay: 500,
        letterInterval: 10,
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

      this.stringToSpan();
      this.randomQueue(0);
    },
    methods: {
      removeClassActive(num) {
        let title = document.querySelector('#title-slide-'+num),
            elems = title.querySelectorAll("span");

        for(let elem of elems) {
          elem.classList.remove('shown');
        }
      },
      randomQueue() {
        let title = document.querySelector('#title-slide-'+this.curSlide),
            elems = title.querySelectorAll("span"),
            queue = [];

        for(let i = 0; i < elems.length; i++) {
          queue[i] = i;
        }

        for(let elem of elems) {
          let currentNum = Math.floor(Math.random()*(queue.length-1+1));
          setTimeout(()=>{
            elem.classList.add('shown');
          }, this.letterDelay+this.letterInterval*queue[currentNum]);
        }
      },
      stringToSpan() {
        let slides = this.$refs['slider'].querySelectorAll('.main-slide');

        for(let slide of slides) {
          let title = slide.querySelector('.title'),
              string = title.innerHTML,
              resString = "";

          for(let i=0; i < string.length; i++){
            if(string[i] != " ") {
              resString += "<span>"+string[i]+"</span>";
            } else {
              resString += string[i];
            }
          }
          title.innerHTML = resString;
        }
      },
      auto() {
        if(!this.nextSlide(false)) {
          this.removeClassActive(this.curSlide);
          this.curSlide = 0;
          this.randomQueue();
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
          this.removeClassActive(this.curSlide);
          this.curSlide--;
          this.randomQueue();

          this.nextActive = true;

          if(this.curSlide == 0) {
            this.prevActive = false;
          }

          this.disButtons();
          this.intervalID = setInterval(this.auto, 5000);
        }
      },
      nextSlide(withRefresh) {
        let s = this.curSlide != this.slideCount - 1;

        if(s) {
          this.removeClassActive(this.curSlide);
          this.curSlide++;
          this.randomQueue();

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
