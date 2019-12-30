<template>
  <div id="app" :class="Number(dayAndNight) ? '' : 'night'">
    <router-view></router-view>
  </div>
</template>

<script>
// import {StartPoint} from '@/assets/js/refresh'
import {computedPub} from '@/assets/js/pages/public'
import {mapActions} from 'vuex'
export default {
  name: 'SMPC',
  data () {
    return {
      mouse1: '',
      mouse2: '',
      eventID: '',
      // timeout: 20 * 1000,
      timeout: this.$$.config.watchPageTime,
      currentSecond: 0
    }
  },
  watch: {
    language () {
      this.$i18n.locale = this.language ? this.language : this.$i18n.locale
      // console.log(this.language)
    },
    serverRPC () {
      // console.log(this.serverRPC)
      let url = this.serverRPC
      this.$$.web3.setProvider(url)
      this.getEnode()
      // console.log(url)
      // console.log(this.$$.web3)
    }
  },
  computed: {
    ...computedPub,
  },
  created () {
    // console.log(StartPoint)
    this.initData()
    this.StartPoint()
    document.body.onmousemove = () => {
      this.GetXYPosition()
    }
  },
  mounted () {
    // console.log(this.dayAndNight)
  },
  methods: {
    ...mapActions(['getEnode', 'getToken', 'getAddress', 'getSafeMode', 'getDayAndNight', 'getWallet', 'getLanguage', 'getServerRPC']),
    initData () {
      this.getServerRPC()
      this.getEnode()
      this.getToken()
      this.getAddress()
      this.getSafeMode()
      this.getDayAndNight()
      this.getWallet()
      this.getLanguage()
      // let url = this.serverRPC
      // this.$$.web3.setProvider(url)
      // console.log(url)
      // console.log(this.$$.web3)
    },
    mousePos (e) {
      let x, y
      e = e || window.event
      return {
        x: e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
        y: e.clientY+document.body.scrollTop+document.documentElement.scrollTop
      }
    },
    GetXYPosition (e) {
      this.mouse2 = this.mousePos(e).x + ',' + this.mousePos(e).y
    },
    StartPoint () {
      this.mouse1 = ""
      this.mouse2 = ""
      this.eventID = setInterval(() => {
        if(this.mouse1 === this.mouse2){
          this.currentSecond = this.currentSecond + 1000
          if(this.currentSecond > this.timeout){
            clearInterval(this.eventID)
            this.msgError('你已经超过3分钟没有操作，页面自动跳转至首页')
            this.quitApp()
            setTimeout(() => {
              history.go(0)
            }, 1500)
          }
        }else{
          this.currentSecond = 0
          this.mouse1 = this.mouse2
        }
      }, 1000)
    }
  },
  beforeDestroy () {
    this.quitApp()
  }
}
</script>

<style lang="scss">
// @import '@/assets/scss/index.scss';
// #app {
//   width: $test;
// }
</style>
