<template>
  <div v-loading="loading.setNode" :element-loading-text="$t('loading').l_1">
    <div class="WW100 flex-c flex-wrap">
      <!-- <el-input class="WW100 mt-10" v-model="viewEnode" type="textarea" :autosize="{ minRows: 2, maxRows: 20}" :disabled="true"></el-input> -->
      <div class="e-node-box" v-if="isShowEnode && viewEnode" :title="viewEnode">
        {{viewEnode ? viewEnode.substr(0, 128) + '...' : ''}}
      </div>
      <!-- <el-input v-model="netUrl" class="mt-10"></el-input> -->
      <el-select class="WW100 mt-10" v-model="netUrl" filterable allow-create default-first-option placeholder="" :title="netUrl" :disabled="!isSetNode" no-data-text="Null" :loading="loadingSelect" :loading-text="$t('loading').l_1">
        <el-option
          v-for="(item, index) in netUrlArr"
          :key="index"
          :label="item.name"
          :value="item.url">
        </el-option>
      </el-select>
      <el-button type="primary" class="mt-20" @click="setNet" v-if="isSetNode">{{$t('btn').setNode}}</el-button>
      <el-button type="success" class="mt-20" @click="copyTxt(viewEnode)" v-if="isShowEnode">{{$t('btn').copy}} ENODE</el-button>
    </div>

  </div>
</template>

<style scoped lang="scss">
.e-node-box{
  width: 100%;min-height: size(60);padding: size(8) size(10);border: 1px solid #ddd;border-radius: size(2);word-break: break-all;font-size: $text-normal;color: $color-gray-sm;text-align: left;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public.js'
import {nodeDatas, nodeSockets, nodeMethods} from '@/assets/js/pages/node/index.js'
import getEnode from '@/assets/js/pages/node/getEnode.js'
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
      ...nodeDatas,
      viewEnode: '',
      netUrl: '',
      loading: {
        setNode: false,
      },
    }
  },
  watch: {
    serverRPC () {
      this.netUrl = this.serverRPC
      console.log(this.eNode)
    },
    eNode (cur) {
      console.log(cur)
      if (this.eNode) {
        this.viewEnode = this.eNode + this.eNodeTx + this.address
      }
    }
  },
  computed: {
    ...computedPub
  },
  sockets: {
    ...nodeSockets,
  },
  mounted () {
    this.init()
  },
  methods: {
    ...nodeMethods,
    ...getEnode,
    init () {
      console.log(this.eNode)
      if (this.eNode) {
        this.viewEnode = this.eNode + this.eNodeTx + this.address
      }
      this.getNetUrl()
      this.setSelected()
    },
    setSelected () {
      this.netUrl = this.serverRPC ? this.serverRPC : this.$$.config.serverRPC
    },
    setNet () {
      this.loading.setNode = true
      this.netUrl = this.netUrl.replace(/\s/g, '')
      let url = this.netUrl
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        url = this.netUrl = 'http://' + url
      }
      this.getEnode(url).then(res => {
        if (res.status === 'Success') {
          let eNodeInit = res.enode
          this.saveRpcDB(url)
          this.$store.commit('setServerRPC', {info: url})
          this.$store.commit('setEnode', eNodeInit)
          this.msgSuccess(this.$t('success').s_4)
        } else {
          this.msgError(this.$t('error').err_9)
        }
        this.loading.setNode = false
      })
    }
  }
}
</script>