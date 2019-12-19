<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <!-- <img :src="dayAndNight ? '~@etc/img/logo/logo-white.svg' : '~@etc/img/logo/logo-black.svg'"> -->
        <img src="@etc/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@etc/img/logo/logo-black.svg" v-else>
      </div>
      <h3 class="title" v-html="$t('title').walletTitle"></h3>
      <p class="tip" v-html="$t('tip').walletTip"></p>

      <w-button :ok="$t('btn').login" :cancel="$t('btn').register" @onOk="toUrl('login')" @onCancel="toUrl('register')" class="mt-50"></w-button>
      <el-input v-model="test" class="mt-30"></el-input>
    </div>
  </div>
</template>

<style lang="scss">
.e-box {
  text-align: center;
  .logo {
    height: size(100);
    img {
      height: 100%;
    }
  }
  .title {
    font-size: $text-lg;font-weight: bold;color:$color-black;line-height: size(48);margin: size(40) 0 size(0);
    span {
      color:$color-primary;
    }
  }
  .tip {
    font-size: $text-normal;color:$color-gray;line-height: size(21);
  }
}
.night {
  .e-box {
    .title {
      color: #fff;
    }
  }
}
</style>

<script>
import wButton from '@/components/btn/index'
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      test: ''
    }
  },
  components: {wButton},
  computed: {
    ...computedPub
  },
  sockets: {
    connect () {
      console.log(13)
    },
    kline (res) {
      console.log(res)
    }
  },
  mounted () {
    this.test = this.eNode
    // this.$socket.emit('kline', 'CCD/BTC,5m,1576208100,1576208700')
    // this.testWs()
    setTimeout(() => {
      console.log(this.$$)
      this.$$.getGroupPerson()
    }, 3000)

    // let arr = [
    //   {p1: 'dcrm', p2: 'getEnodeStatus', p3: ['enode://5a7e7e449806cb67d412c92cfd3d0ea9cee109f494244c5c4e7cfda00142ae1c4c16f40d104b4b22b62e31827450a708ff281bafaaa58d624e227c81aab65c3c@127.0.0.1:12341']},
    //   {p1: 'dcrm', p2: 'getEnodeStatus', p3: ['enode://e84133c51e96cd9d604ccd3627fa0c07262b827390d8a97a516a14193e3b50a9763ef0169a4f198f9ea203e7af66d067d30a7ea15c708cf0c618e709e368a057@127.0.0.1:12342']},
    //   {p1: 'dcrm', p2: 'getEnodeStatus', p3: ['enode://1f9141662d5da3dc8c62dab372db2b682de194a42fe341f4b9ea6e89804129cbdf11a53a882e77c8139390f8ac2a485fcdbc9231ae3f9f130af2552ac7196235@127.0.0.1:12343']},
    // ]
    // this.$$.batchRequest(arr).then(res => {
    //   console.log(res)
    // })
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
    }
  }
}
</script>