<template>
  <div v-loading="loading.setNode" element-loading-text="Loading……">
    <div class="WW100 flex-c flex-wrap">
      <!-- <el-input class="WW100 mt-10" v-model="viewEnode" type="textarea" :autosize="{ minRows: 2, maxRows: 20}" :disabled="true"></el-input> -->
      <div class="e-node-box" v-if="isShowEnode && viewEnode" :title="viewEnode">
        {{viewEnode ? viewEnode.substr(0, 128) + '...' : ''}}
      </div>
      <!-- <el-input v-model="netUrl" class="mt-10"></el-input> -->
      <el-select class="WW100 mt-10" v-model="netUrl" filterable allow-create default-first-option placeholder="" :title="netUrl" :disabled="!isSetNode" no-data-text="Null">
        <el-option
          v-for="(item, index) in netUrlArr"
          :key="index"
          :label="item.name"
          :value="item.url">
        </el-option>
      </el-select>
      <el-button type="primary" class="mt-20" @click="setNet" v-if="isSetNode">{{$t('btn').setNode}}</el-button>
      <el-button type="success" class="mt-20" @click="copyTxt(viewEnode)" v-if="isShowEnode">{{$t('btn').copy}} ENODE</el-button>
      <!-- <el-button type="success" class="mt-20" @click="openPwdDialog">生成注册码</el-button> -->
    </div>

    <!-- <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog> -->
  </div>
</template>

<style scoped lang="scss">
.e-node-box{
  width: 100%;min-height: size(60);padding: size(8) size(10);border: 1px solid #ddd;border-radius: size(2);word-break: break-all;font-size: $text-normal;color: $color-gray-sm;text-align: left;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
// import {insertNode, findNode} from '@/db/node'
import {GetNodes, AddNodes} from '@/api/index.js'
export default {
  name: 'setEnode',
  props: {
    isShowEnode: {
      type: Boolean,
      default: true
    },
    isSetNode: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      baseUrl: 'getNodeInfos',
      viewEnode: '',
      netUrl: this.serverRPC,
      netUrlArr: [],
      loading: {
        setNode: false
      },
      dataPage: {},
      eDialog: {
        pwd: false
      }
    }
  },
  watch: {
    serverRPC () {
      // console.log(123)
      this.netUrl = this.serverRPC
    },
  },
  computed: {
    ...computedPub
  },
  mounted () {
    this.viewEnode = this.eNode + this.eNodeTx + this.address

    if (this.$$.config.env === 'dev') {
      this.baseUrl = 'getNodeInfosDev'
    }
    // this.$socket.emit(this.baseUrl)
    this.getNetUrl()
  },
  methods: {
    getNetUrl () {
      GetNodes(this, this.baseUrl).then(res => {
        // console.log(res)
        this.netUrlArr = res
        this.netUrlArr.push({
          url: this.$$.config.serverRPC,
          name: this.$t('label').localNode
        })
        this.netUrl = this.serverRPC ? this.serverRPC : (res.length > 0 ? res[0].url : this.$$.config.serverRPC)
      })
    },
    saveRpcDB () {
      let url = this.netUrl
      // let url = data.url
      AddNodes(this, '', {url: url}).then(res => {
        // console.log(res)
        if (res) {
          this.getNetUrl()
        }
      })
    },
    setNet () {
      this.loading.setNode = true
      let url = this.netUrl
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        url = this.netUrl = 'http://' + url
      }
      try {
        this.$$.web3.setProvider(url)
        this.$$.web3.dcrm.getEnode().then(res => {
          let cbData = res
          cbData = JSON.parse(cbData)
          // console.log(cbData)
          if (cbData.Status === "Success") {
            let eNodeInit = cbData.Data.Enode
            this.viewEnode = eNodeInit
            this.saveRpcDB()
            this.$store.commit('setServerRPC', {info: url})
            this.$store.commit('setEnode', eNodeInit)
            this.msgSuccess(this.$t('success').s_4)
          } else {
            this.viewEnode = ''
            this.msgError(this.$t('error').err_9)
          }
          this.loading.setNode = false
        }).catch(err => {
          console.log(err)
          this.viewEnode = ''
          this.msgError(this.$t('error').err_9)
          this.loading.setNode = false
        })
      } catch (error) {
        console.log(error)
        this.msgError(this.$t('error').err_9)
        this.loading.setNode = false
      }
    }
  }
}
</script>