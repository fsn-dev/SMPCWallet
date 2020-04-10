<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/account' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').netSet}}</el-breadcrumb-item>
      <el-button size="mini" type="primary" class="n-net-btn" @click="eDialog.net = true">{{$t('btn').newBuild}}</el-button>
    </el-breadcrumb>
    <div class="flex-sc flex-wrap">
      <el-tag class="WW100 mb-20 flex-bc">{{$$.config.serverRPC}}</el-tag>
      <el-tag @close="handleClose(item)" v-for="(item, index) in netUrlArr" :key="index" closable :type="item.url" class="WW100 mb-20 flex-bc">
        {{item.url}}
      </el-tag>
      <!-- <ul>
        <li v-for="(item, index) in netUrlArr" :key="index">{{item.url}}</li>
      </ul> -->
    </div>
    <el-dialog :title="$t('tip').name" :visible.sync="eDialog.del" width="30%" center>
      <p class="center">{{$t('tip').deleteNode}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eDialog.del = false">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="removeNode">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('title').netSet" :visible.sync="eDialog.net">
      <el-form>
        <el-form-item :label="$t('label').IP">
          <el-input v-model="netUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eDialog.net = false">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="addNode">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.n-net-btn {
  position: absolute;top:-8px;right: 0;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      netUrlArr: [],
      eDialog: {
        net: false,
        del: false,
      },
      netUrl: '',
      netObj: {}
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.getNetUrl()
  },
  methods: {
    getNetUrl () {
      this.$db.findNode().then(res => {
        this.netUrlArr = []
        if (res.length > 0) {
          this.netUrlArr.push(...res)
        }
      })
    },
    handleClose (item) {
      this.netObj = item
      this.eDialog.del = true
    },
    addNode () {
      console.log(this.netUrl)
      if (!this.netUrl) {
        this.msgWarning(this.$t('warn').w_17)
        return
      }
      this.$db.insertNode({
        url: this.netUrl
      }).then(res => {
        // console.log(res)
        this.getNetUrl()
        this.netUrl = ''
        this.eDialog.net = false
      }).catch(err => {
        console.log(err)
        this.eDialog.net = false
      })
    },
    removeNode () {
      this.$db.removeNode(
        {url: this.netObj.url}
      ).then(res => {
        console.log(res)
        this.msgSuccess(this.$t('success').s_5)
        this.getNetUrl()
        this.netObj = {}
        this.eDialog.del = false
      }).catch(err => {
        console.log(err)
        this.eDialog.del = false
      })
    }
  }
}
</script>