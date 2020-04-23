<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/account' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').myNode}}</el-breadcrumb-item>
      <el-button size="mini"  v-if="networkMode" type="primary" class="n-net-btn" @click="eDialog.addNode = true">{{$t('btn').newBuild}}</el-button>
    </el-breadcrumb>
    <div class="ga-list-box" v-if="networkMode">
      <ul class="ul" >
        <li v-for="(item, index) in nodeList" :key="index" class="item">
          <el-divider content-position="left">{{item.name}}</el-divider>
          <div class="flex-bc">
            <p class="pubkey" :title="item.url">{{ item.url }}</p>
            <div>
              <!-- <el-button size="mini" type="primary" class="" @click="openEditPage(item)">{{$t('btn').setName}}</el-button> -->
              <el-button size="mini" type="primary" class="plr10" @click="openEditPage(item)"><i class="el-icon-edit"></i></el-button>
              <el-button size="mini" type="danger" class="plr10" @click="openRemovePage(item)"><i class="el-icon-delete"></i></el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex-c color_99" v-if="!networkMode">
      {{$t('tip').online}}
    </div>

    <el-dialog :title="$t('title').releaseNode" :visible.sync="eDialog.addNode">
      <el-form label-width="120px" label-position="top" @submit.native.prevent>
        <el-form-item>
          <div slot="label" class="flex-sc">
            <span class="color_red">*</span>
            {{$t('label').nodeName}}
          </div>
          <el-input type="text" v-model="nodeForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label" class="flex-sc">
            <span class="color_red">*</span>
            {{$t('label').nodeAddr}}
          </div>
          <el-input type="text" v-model="nodeForm.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="addMyNode">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('title').releaseNode" :visible.sync="eDialog.editNode">
      <el-form label-width="120px" label-position="top" @submit.native.prevent>
        <el-form-item>
          <div slot="label" class="flex-sc">
            <span class="color_red">*</span>
            {{$t('label').nodeName}}
          </div>
          <el-input type="text" v-model="editNode.name"></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label" class="flex-sc">
            <span class="color_red">*</span>
            {{$t('label').nodeAddr}}
          </div>
          <el-input type="text" v-model="editNode.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="editMyNode">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('tip').name" :visible.sync="eDialog.del" width="30%" center>
      <p class="center">{{$t('tip').deleteNode}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="removeMyNode">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.n-net-btn {
  position: absolute;top:-8px;right: 0;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import getEnode from '@/assets/js/pages/node/getEnode.js'
export default {
  name: 'releaseNode',
  data () {
    return {
      nodeList: [],
      nodeForm: {},
      editNode: {},
      removeNode: {},
      loading: {
        node:false
      },
      eDialog: {
        addNode: false,
        editNode: false,
        del: false
      }
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    getUserNodeInfos (res) {
      console.log(res)
      if (res.msg === 'Success') {
        this.nodeList = res.info
      } else {
        this.nodeList = []
      }
    },
    NodeAdd (res) {
      console.log(res)
      this.$$.web3.setProvider(this.serverRPC)
      if (res.msg  === 'Success') {
        this.msgSuccess(this.$t('success').s_1)
      } else {
        this.msgError(res.error)
      }
      this.init()
      this.modalClick()
    },
    NodeDel (res) {
      if (res.msg  === 'Success') {
        this.msgSuccess(this.$t('success').s_5)
      } else {
        this.msgError(res.error)
      }
      this.init()
      this.modalClick()
    },
    NodeEdit (res) {
      console.log(res)
      this.$$.web3.setProvider(this.serverRPC)
      if (res.msg  === 'Success') {
        this.msgSuccess(this.$t('success').s_8)
      } else {
        this.msgError(res.error)
      }
      this.init()
      this.modalClick()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...getEnode,
    init () {
      this.$socket.emit('getUserNodeInfos', {
        publisher: this.token,
        address: this.address
      })
    },
    modalClick () {
      this.eDialog.addNode = false
      this.eDialog.editNode = false
      this.eDialog.del = false
      this.nodeForm = {}
      this.editNode = {}
      this.removeNode = {}
    },
    addMyNode () {
      if (!this.nodeForm.name || !this.nodeForm.url) {
        this.msgWarning(this.$t('warn').w_17)
        return
      }
      this.validNode('nodeForm').then(res => {
        if (res) {
          this.$socket.emit('NodeAdd', {
            publisher: this.token,
            address: this.address,
            name: this.nodeForm.name,
            url: this.nodeForm.url,
          })
        } else {
          this.msgError(this.$t('error').err_10)
          this.$$.web3.setProvider(this.serverRPC)
        }
      })
    },
    openEditPage (item) {
      this.eDialog.editNode = true
      this.editNode = item
    },
    editMyNode () {
      console.log(this.editNode)
      if (!this.editNode.name || !this.editNode.url) {
        this.msgWarning(this.$t('warn').w_17)
        return
      }
      this.validNode('editNode').then(res => {
        if (res) {
          this.$socket.emit('NodeEdit', {
            id: this.editNode._id,
            publisher: this.token,
            address: this.address,
            name: this.editNode.name,
            url: this.editNode.url,
          })
        } else {
          this.msgError(this.$t('error').err_10)
          this.$$.web3.setProvider(this.serverRPC)
        }
      })
    },
    validNode (param) {
      return new Promise(resolve => {
        let url = this[param].url
        console.log(this[param].url)
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          this[param].url = url = 'http://' + url
        }
        this.getEnode(url).then(res => {
          if (res.status === 'Success') {
            resolve(1)
          } else {
            resolve(0)
          }
        })
      })
    },
    openRemovePage (item) {
      this.eDialog.del = true
      this.removeNode = item
    },
    removeMyNode () {
      this.$socket.emit('NodeDel', {
        id: this.removeNode._id,
      })
    }
  }
}
</script>