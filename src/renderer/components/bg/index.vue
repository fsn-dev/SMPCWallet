<template>
  <div class="h-bg bg container relative">
    <language class="lang-fixed" @changeLang="reload"></language>
    <router-view v-if="isRefresh"></router-view>
  </div>
</template>

<style lang="scss">
.h-bg {
  background: #fff;
  /* background: -webkit-gradient(linear,left top,left bottom,from(#2677fe),to(#7e63ff)); background: linear-gradient(180deg,#2677fe,#7e63ff); background: -moz-linear-gradient(to bottom,#2677fe,#7e63ff); */
  /* background: url('~@/assets/img/bg1.jpg') no-repeat center rgba(0, 0, 0, .5);background-size: cover; */
}
.lang-fixed {
  position: absolute;top: size(30);right: 10%;
}
.night {
  .bg {
    background: $night-bg-color
  }
}
</style>

<script>
import language from '@/components/language/index.vue'
export default {
  name: 'bg',
  data () {
    return {
      isRefresh: true
    }
  },
  components: {language},
  // components: {enterPage},
  mounted () {
    
  },
  methods: {
    reload () {
      this.isRefresh = false
      this.$nextTick(() => {
        this.isRefresh = true
      })
    },
  }
}
</script>