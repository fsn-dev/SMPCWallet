<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <img src="@etc/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@etc/img/logo/logo-black.svg" v-else>
      </div>
      <h3 class="title" v-html="$t('title').walletTitle"></h3>
      <p class="tip color_red" v-html="$t('tip').walletTip"></p>
      <div class="flex-c">
        <w-button :ok="$t('btn').login" :cancel="$t('btn').register" @onOk="toUrl('login')" @onCancel="toUrl('register')" class="mt-20"></w-button>
      </div>
      <div class="WW100 mt-20 flex-c flex-wrap">
        <set-enode :isShowEnode="false"></set-enode>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './scss/enter';
</style>

<script>
import wButton from '@/components/btn/index.vue'
import setEnode from '@/components/setEnode/index.vue'
import {computedPub} from '@/assets/js/pages/public'
// import {insertNode, findNode} from '@/db/node'

export default {
  name: '',
  data () {
    return {
    }
  },
  components: {wButton, setEnode},
  computed: {
    ...computedPub
  },
  sockets: {
    kline (res) {
      console.log(res)
    }
  },
  mounted () {
  },
  methods: {
    testWs () {
      // let ws = new WebSocket(this.$$.config.appURL)
      let ws = new WebSocket('ws://192.168.1.184:8866/kline')
      ws.onopen = () => {
        ws.send('{"id":123,"method":"kline","params":["CCD/BTC","5m","1576208100","1576208700"]}')
        console.log('start')
      }
      ws.onmessage = (res) => {
        console.log(res)
      }
      ws.onclose = () => {
        console.log('end')
      }
    },
  }
}
</script>