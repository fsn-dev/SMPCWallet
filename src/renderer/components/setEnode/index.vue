<template>
  <div>
    <div class="WW100 flex-c flex-wrap">
      <!-- <el-input class="WW100 mt-10" v-model="viewEnode" type="textarea" :autosize="{ minRows: 2, maxRows: 20}" :disabled="true"></el-input> -->
      <div class="e-node-box">
        {{viewEnode}}
      </div>
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
      <el-button type="success" class="mt-20" @click="copyTxt(viewEnode)">复制ENODE</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.e-node-box{
  width: 100%;min-height: size(60);padding: size(8) size(10);border: 1px solid #ddd;border-radius: size(2);word-break: break-all;font-size: $text-normal;color: $color-gray-sm;text-align: left;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {insertNode, findNode} from '@/db/node'
export default {
  name: 'setEnode',
  data () {
    return {
      viewEnode: '',
      netUrl: this.$$.config.serverRPC,
      netUrlArr: []
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    this.viewEnode = this.eNode
    this.getNetUrl()
  },
  methods: {
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
    saveRpcDB () {
      let url = this.netUrl
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
    },
    setNet () {
      let url = this.netUrl
      try {
        this.$$.web3.setProvider(this.netUrl)
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
        }).catch(err => {
          console.log(err)
          this.viewEnode = ''
          this.msgError(this.$t('error').err_9)
        })
      } catch (error) {
        console.log(error)
        this.msgError(this.$t('error').err_9)
      }
    }
  }
}
</script>