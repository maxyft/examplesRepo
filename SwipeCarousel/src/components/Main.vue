<template>
  <div class="page-wrapper">
    <header class="nav-header">
      <div class="header-content">
        <router-link to="/">Home</router-link>
        <router-link to="/">About Us</router-link>
        <router-link to="/">Contact Us</router-link>
      </div>
    </header>
    <carousel></carousel>
  </div>
</template>

<script>
import carousel from './Carousel.vue'
import $ from 'jquery'

export default {
  name: 'Main',
  components: {
    carousel: carousel
  },
  data () {
    return {

    }
  },
  mounted() {
    let $header = $('.nav-header');
    let headerHeight = parseInt($('.nav-header').css('height'));
    this.addScrollEventListener($header, headerHeight);
  },
  methods: {
    addScrollEventListener(el, elHeigth) {
      $(window).scroll(() => {
        let offsetTop = $(window).scrollTop();
        if(offsetTop > elHeigth * 3) $(el).addClass('sticky');
        if(offsetTop === 0) $(el).removeClass('sticky');
      })
    }
  }
}
</script>

<style scoped lang="less">
.page-wrapper {
  height: 150vh;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  .nav-header {
    z-index: 999;
    position: relative;
    width: 100%;
    height: 40px;
    background-color: white;
    border-bottom: 1px solid rgba(60, 157, 208, 1);
    box-shadow: 0 3px 4px rgba(60, 157, 208, .15);
    &.sticky {
      position: fixed;
      transition: .4s all;
      top: -40px;
      transform: translateY(40px);
    }
    .header-content {
      display: flex;
      height: inherit;
      align-items: center;
      margin: auto;
      max-width: 1440px;
      @media (max-width: 1920px) {
        max-width: 1280px;
      }
      @media (max-width: 1600px) {
        max-width: 1280px;
      }
      @media (max-width: 1440px) {
        max-width: 1024px;
      }
      @media (max-width: 1024px) {
        max-width: 768px;
      }
      a {
        margin: 0 10px;
        font-size: 1rem;
      }
    }
  }
}
</style>
