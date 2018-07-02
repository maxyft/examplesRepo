<template>
  <div class="carousel-wrapper">
    <div class="carousel-inside-wrapper" id="carousel">
      <div class="carousel-picture-wrapper" v-for='wrapper in wrappers'>
        <div class="carousel-picture" v-for="picture in wrapper">
          <a href="/" ondragstart="return false;">
            <img :src="require(`../assets/${picture}`)" alt="">
          </a>
        </div>
      </div>
    </div>
    <div class="carousel-inside-config">
      <p class="carousel-config-text">Picture Count: </p>
      <p class="carousel-config-text">{{ carouselPictures }}</p>
      <div class="carousel-config-icon" @click="toggleInput"></div>
      <input type="number" v-model="userConfig" id="config">
    </div>
  </div>
</template>

<script>
import carousel from './Carousel.vue'
import Hammer from 'hammerjs'

export default {
  name: 'Carousel',
  data () {
    return {
      carouselTranslate: 0,
      carouselCurrentWrapper: 1,
      carouselPictures: 3,
      userConfig: null,
      wrappers: [],
      pictures: [
        '1.jpg', '2.jpg', '3.jpg',
        '4.jpg', '5.jpg', '6.jpg',
        '7.jpg', '8.jpg', '9.jpg'
      ]
    }
  },
  computed: {
    carouselWrappers() {
      return Math.ceil(this.pictures.length / this.carouselPictures);
    }
  },
  watch: {
    userConfig(newVal) {
      if(this.carouselPictures != newVal && newVal) this.carouselPictures = parseInt(newVal);
    },
    carouselPictures(newVal, prev) {
      if(newVal <= 0) return;
      this.wrappers = [];
      this.configureCarousel();
    }
  },
  mounted() {
    this.setCarouselSwipeHandling();
    this.configureCarousel();
    window.onload = () => {
      let innerWidth = window.innerWidth;
      if(innerWidth < 1024) this.carouselPictures = 1; // mobile-mode
      if(innerWidth > 1024) this.carouselPictures = 3; // desktop-mode
    };
    window.onresize = () => {
      let innerWidth = window.innerWidth;
      if(innerWidth < 1024 && !this.userConfig) this.carouselPictures = 1; // mobile-mode
      if(innerWidth > 1024 && !this.userConfig) this.carouselPictures = 3; // desktop-mode
    }
  },
  methods: {
    toggleInput() {
      let configInput = document.getElementById('config');
      configInput.classList.toggle('visible');
    },
    configureCarousel() {

      //reset carouselConfig && styles
      this.carouselTranslate = 0;
      this.carouselCurrentWrapper = 1;
      let carousel = document.getElementById('carousel');
      carousel.style.transform = 'translateX(0)';

      let pictures = this.pictures.slice();
      for(let i = 0; i < this.carouselWrappers; i++) {
        let wrapper = [];
        for(let j = 0; j < this.pictures.length; j++) {
          if(j / this.carouselPictures === 1) break;

          let picture = pictures.shift();
          if(picture) wrapper.push(picture);
        }
        this.wrappers.push(wrapper);
      }
    },
    setCarouselSwipeHandling() {
      let carousel = document.getElementById('carousel');
      let hammer = new Hammer(carousel);
      hammer.on('swipe', (e) => {
        if(e.deltaTime > 50) {
          if(e.deltaX < 0 && this.carouselCurrentWrapper < this.carouselWrappers) {
            this.carouselCurrentWrapper++;
            this.carouselTranslate -= 100;
            carousel.style.transform = `translateX(${this.carouselTranslate}%)`;
          }
          if(e.deltaX > 0 && this.carouselCurrentWrapper > 1) {
            this.carouselCurrentWrapper--;
            this.carouselTranslate += 100;
            carousel.style.transform = `translateX(${this.carouselTranslate}%)`;
          }
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.carousel-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 2%;
  width: 100%;
  height: 33%;
  overflow: hidden;
  border-bottom: 1px solid rgba(60, 157, 208, 1);
  border-top: 1px solid rgba(60, 157, 208, 1);
  .carousel-inside-wrapper {
    flex-grow: 0;
    height: 90%;
    display: flex;
    transition: .5s all;
    .carousel-picture-wrapper {
      flex-grow: 0;
      min-width: 100%;
      display: flex;
      .carousel-picture {
        width: 100%;
        a {
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
  .carousel-inside-config {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding: 0 1%;
    .carousel-config-text {
      margin: 0;
      margin-right: 10px;
      font-size: 1rem;
    }
    .carousel-config-icon {
      background: url('../assets/settings.png') no-repeat center;
      background-size: contain;
      flex-grow: 0;
      width: 2.5%;
      height: 24px;
      transition: all .3s;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    }
    input {
      opacity: 0;
      visibility: hidden;
      transition: .3s all;
      &.visible {
        visibility: visible;
        opacity: 1;
      }
    }
  }
}
</style>
