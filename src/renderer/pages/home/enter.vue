<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <img src="@etc/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@etc/img/logo/logo-black.svg" v-else>
      </div>
      <h3 class="title" v-html="$t('title').walletTitle"></h3>
      <p class="tip" v-html="$t('tip').walletTip"></p>
      <div class="flex-c">
        <w-button :ok="$t('btn').login" :cancel="$t('btn').register" @onOk="toUrl('login')" @onCancel="toUrl('register')" class="mt-50"></w-button>
      </div>
      <div class="W300 mt-20 flex-c flex-wrap">
        <el-input class="WW100 mt-10" v-model="test" type="textarea" :autosize="{ minRows: 2, maxRows: 20}" :disabled="true"></el-input>
        <!-- <el-input v-model="netUrl" class="mt-10"></el-input> -->
        <el-select class="WW100 mt-10" v-model="netUrl" filterable allow-create default-first-option placeholder="" :title="netUrl">
          <el-option
            v-for="item in netUrlArr"
            :key="item.url"
            :label="item.url"
            :value="item.url">
          </el-option>
        </el-select>
        <el-button type="primary" class="mt-20" @click="setNet">设置节点</el-button>
        <el-button type="success" class="mt-20" @click="copyTxt(test)">复制ENODE</el-button>
      </div>
      <!-- <div class="WW100 mt-20 flex-c flex-wrap">
        <el-input v-model="netUrl" class="mt-30"></el-input>
        <el-button type="primary" class="mt-10" @click="setNet">{{$t('btn').confirm}}</el-button>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss">
@import './scss/enter';
</style>

<script>
import wButton from '@/components/btn/index'
import {computedPub} from '@/assets/js/pages/public'
import {mapActions} from 'vuex'
import {insertNode, findNode} from '@/db/node'
export default {
  name: '',
  data () {
    return {
      test: '',
      netUrl: this.$$.config.serverRPC,
      netUrlArr: []
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
    this.getNetUrl()

    // let val = 13242354
    // val = this.$$.toWei(val, 'ETH')
    // console.log(val)
    // console.log(this.$$.web3.utils)
    // console.log(this.$$.web3.utils.toBN(Number(val) *  Math.pow(10, 18)))
    // let BN = this.$$.web3.utils.BN
    // console.log(new BN(this.$$.toWei(val, 'ETH')).toString())
    // val = this.$$.toWei(Number(val), 'ETH')
    // console.log(val)
    // console.log(val)
    // val = this.$$.web3.utils.toWei(Number(val), 'ether')
    // console.log(val)
    // console.log(this.serverRPC)
    // this.$socket.emit('kline', 'CCD/BTC,5m,1576208100,1576208700')
    // this.testWs()
    // setTimeout(() => {
    //   console.log(this.$$)
    //   this.$$.getGroupPerson()
    // }, 3000)

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
    ...mapActions(['getEnode', 'getToken', 'getAddress', 'getSafeMode', 'getDayAndNight', 'getWallet', 'getLanguage']),
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
    getNetUrl () {
      findNode().then(res => {
        // console.log(res)
        this.netUrlArr = [{
          url: this.$$.config.serverRPC
        }]
        if (res.length > 0) {
          this.netUrlArr.push(...res)
        }
        this.netUrl = this.serverRPC ? this.serverRPC : this.$$.config.serverRPC
      })
    },
    setNet () {
      let url = this.netUrl
      // console.log(this.netUrl)
      // return
      try {
        this.$$.web3.setProvider(this.netUrl)
        console.log(this.$$.web3)
        console.log(this.$$.web3.version)
        this.getEnode()
        findNode({url: url}).then(res => {
          if (res.length <= 0 && url !== this.$$.config.serverRPC) {
            insertNode({
              url: url
            }).then(res => {
              // console.log(res)
              this.getNetUrl()
            })
          }
        })
        this.$store.commit('setServerRPC', {info: url})
        setTimeout(() => {
          this.test = this.eNode
          this.msgSuccess(this.$t('success').s_4)
        }, 1500)
      } catch (error) {
        console.log(error)
        this.msgError(this.$t('error').err_9)
      }
    }
  }
}
</script>