<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import {StartPoint} from '@/assets/js/refresh'
export default {
  name: 'key-house',
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
  created () {
    // console.log(StartPoint)
    this.StartPoint()
    document.body.onmousemove = () => {
      this.GetXYPosition()
    }
  },
  methods: {
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
            this.$message.error('你已经超过3分钟没有操作，页面自动跳转至首页')
            this.$$.quitApp(this)
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
  }
}
</script>

<style lang="scss">
// @import '@/assets/scss/index.scss'
/* CSS */

</style>
