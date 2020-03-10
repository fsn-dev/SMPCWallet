<template>
  <div class="boxConntent1 container" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">
    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form ref="groupForm" :rules="rules" label-width="100px" label-position="top" @submit.native.prevent>
          <el-form-item :label="$t('label').mode"
            :rules="{
              required: true, message: $t('warn').w_5, trigger: 'blur'
            }">
            <el-select v-model="mode.select" :placeholder="$t('warn').w_4" class="WW100" @change="changeMode">
              <el-option v-for="(item, index) in mode.init" :key="index" :label="item.name + ' ' + $t('label').mode" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group
              v-model="node.select"
              @change="changeNode"
              v-if="node.refresh"
            >
              <el-checkbox v-for="(item, index) in node.init" :label="item.url" :key="index" :disabled="item.disabled">
                <div class="flex-bc">
                  {{item.name}}
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="mt-30">
            <el-button type="primary" native-type="submit" @click="submitForm('groupForm')">{{$t('btn').createPersson}}</el-button>
            <el-button @click="resetForm('groupForm')">{{$t('btn').restart}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="70%" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false">
      <div class="confirm-list-box" v-loading="loading.enode" :element-loading-text="$t('loading').l_1">
        <ul class="list-box">
          <li class="item flex-ai-fs" v-for="(item, index) in createEnodeArr" :key="index">
            <p class="label">{{$t('label').admins}} {{index + 1}}:</p>
            <p class="info">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="createGroup">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'createPerson',
  props: {
    formBoxClass: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      mode: {
        init: this.$$.mode,
        select: this.$$.config.initGroupMode
      },
      node: {
        init: [],
        select: [],
        min: 0,
        max: 0,
        refresh: true
      },
      noSaveDBnet: new Set(),
      loading: {
        creat: false,
        enode: false
      },
      eDialog: {
        pwd: false,
        confirm: false
      },
      dataPage: {},
      gID: '',
      rules: {},
      createEnodeArr: []
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    getNodeInfos (res) {
      console.log(res)
      // this.node.init = [{
      //   url: this.$$.config.serverRPC
      // }]
      this.noSaveDBnet = new Set()
      this.noSaveDBnet.add(this.$$.config.serverRPC)
      if (res.msg === 'Success' && res.info.length > 0) {
        let arr = []
        for (let obj of res.info) {
          if (!this.noSaveDBnet.has(obj.url) && this.serverRPC !== obj.url) {
            // console.log(obj)
            arr.push({
              name: obj.name,
              url: obj.url,
              disabled: false
            })
            this.noSaveDBnet.add(obj.url)
          }
        }
        // this.node.init = arr
        // console.log(arr)
        this.node.init = [
          // {name: 1, url: 'http://47.92.168.85:9011', disabled: false},
          {name: 2, url: 'http://47.92.168.85:9012', disabled: false},
          {name: 3, url: 'http://47.92.168.85:9013', disabled: false},
          {name: 4, url: 'http://47.92.168.85:9014', disabled: false},
          {name: 5, url: 'http://47.92.168.85:9015', disabled: false},
        ]
        console.log(this.node.init)
      }
    }
  },
  watch: {
    accountType (cur) {
      if (Number(cur) === 1) {
        this.toUrl('/createPerson')
      } else {
        this.toUrl('/createGroup')
      }
    },
  },
  mounted () {
    console.log(this.serverRPC)
    this.init()
  },
  methods: {
    init () {
      this.$socket.emit('getNodeInfos')
      this.changeMode()
    },
    modalClick () {
      this.eDialog.pwd = false
      this.eDialog.confirm = false
      this.$emit('closeModal')
    },
    submitForm () {
      if (this.node.select.length < this.node.min) {
        this.msgError(this.$t('error').err_12)
      } else {
        // this.createGroup()
        this.eDialog.confirm = true
        this.loading.enode = true
        this.getAllEnode()
      }
    },
    getEnode (url) {
      return new Promise((resolve, reject) => {
        let enodeObj = {status: 'Error', enode: ''}
        this.$$.web3.setProvider(url)
        this.$$.web3.dcrm.getEnode().then(res => {
          let cbData = res
          cbData = JSON.parse(cbData)
          // console.log(cbData)
          if (cbData.Status === "Success") {
            enodeObj.status = 'Success'
            enodeObj.enode = cbData.Data.Enode
          }
          resolve(enodeObj)
        }).catch(err => {
          console.log(err)
          enodeObj.error = err
          resolve(enodeObj)
        })
      })
    },
    getAllEnode () {
      let arr = []
      for (let obj of this.node.select) {
        arr.push(this.getEnode(obj))
      }
      this.createEnodeArr = [{
        name: this.$t('label').localNode,
        url: this.serverRPC,
        enode: this.eNode,
        status: 1,
        initiate: 1
      }]
      Promise.all(arr).then(res => {
        // console.log(this.$$.web3)
        this.$$.web3.setProvider(this.serverRPC)
        // console.log(this.$$.web3)
        console.log(res)
        for (let i = 0, len = res.length; i < len; i++) {
          let obj = {
            name: this.node.init[i].name,
            url: this.node.init[i].url,
            enode: res[i].enode,
            initiate: 0
          }
          if (res[i].status === 'Success') {
            obj.status = 1
          } else {
            obj.status = 0
          }
          this.createEnodeArr.push(obj)
        }
        this.loading.enode = false
        console.log(this.createEnodeArr)
      })
    },
    createGroup () {
      this.eDialog.confirm = false
      this.loading.creat = true
      // this.eDialog.pwd = true;
      let arr = []
      for (let obj of this.createEnodeArr) {
        arr.push(obj.enode)
      }
      console.log(arr)
      this.$$.createGroup(this.mode.select, arr).then(res => {
        let gInfo = res
        console.log(gInfo)
        if (gInfo.msg === 'Success') {
          this.gID = res.info.Gid
          this.openPwdDialog()
        } else {
          this.msgError(gInfo.info.toString())
        }
      }).catch(err => {
        this.msgError(err)
        this.loading.creat = false
      })
    },
    openPwdDialog () {
      if (!this.gID) {
        this.msgError(this.$t('warn').w_3)
        return
      }
      let data = 'REQDCRMADDR:' + this.gID + ':' + this.mode.select + ':' + Date.now()

      console.log(data)
      this.dataPage = {
        from: this.address,
      }
      this.$$.getReqNonce(this.address).then(nonce => {
        this.dataPage.nonce = nonce
        this.dataPage.value = 0
        this.dataPage.data = data
        console.log(this.dataPage)
        this.eDialog.pwd = true
        this.loading.creat = false
      })
    },
    getSignData (data) {
      // this.modalClick()
      this.eDialog.pwd = false
      this.loading.creat = true
      // this.loading.creat = true
      if (data.signTx) {
        this.signTx = data.signTx
        this.reqAccount()
      } else {
        this.msgError('Error')
        this.loading.creat = false
      }
    },
    reqAccount () {
      this.$$.reqAccount(this.signTx, this.accountType).then(res => {
        console.log(res)
        if (res.msg === 'Success') {
          this.$emit('closeModal')
          this.modalClick()
          // this.updateStatus(res.info)
          this.saveDB(res.info)
          this.msgSuccess(this.$t('success').s_3)
        }
        this.loading.creat = false
        // this.toUrl('/waitNews')
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
        this.loading.creat = false
        this.modalClick()
      })
    },
    saveDB (key) {
      let data = {
        key: key,
        kId: this.address,
        gId: this.gID,
        mode: this.mode.select,
        nonce: Number(this.dataPage.nonce),
        member: [{
          eNode: this.eNode,
          initiate: 1,
        }]
      }
      for (let obj of this.createEnodeArr) {
        if (this.eNode === obj.enode) continue
        let obj1 = {
          eNode: obj.enode,
          initiate: 0,
        }
        data.member.push(obj1)
      }
      this.$socket.emit('PersonAccountsAdd', data)
    },
    changeMode () {
      let modeArr = this.mode.select.split('/')
      this.node.min = Number(modeArr[0]) - 1
      this.node.max = Number(modeArr[1]) - 1
      this.node.select = []
      this.resetNode()
    },
    changeNode () {
      if (this.node.select.length === this.node.min && this.node.min !== this.node.max) {
        for (let i = 0, len = this.node.init.length; i < len; i++) {
          let obj = this.node.init[i]
          if (this.node.select.includes(obj.url)) {
            this.node.init[i].disabled = true
          } else {
            this.node.init[i].disabled = false
          }
        }
      } else if (this.node.select.length === this.node.max && this.node.min !== this.node.max) {
        for (let i = 0, len = this.node.init.length; i < len; i++) {
          let obj = this.node.init[i]
          if (this.node.select.includes(obj.url)) {
            this.node.init[i].disabled = false
          } else {
            this.node.init[i].disabled = true
          }
        }
      } else if (this.node.select.length === this.node.max && this.node.select.length === this.node.min) {
        for (let i = 0, len = this.node.init.length; i < len; i++) {
          let obj = this.node.init[i]
          if (this.node.select.includes(obj.url)) {
            this.node.init[i].disabled = false
          } else {
            this.node.init[i].disabled = true
          }
        }
      } else {
        this.resetNode()
      }
      this.refreshNode()
    },
    refreshNode () {
      this.node.refresh = false
      this.$nextTick(() => {
        this.node.refresh = true
      })
    },
    resetNode () {
      for (let i = 0, len = this.node.init.length; i < len; i++) {
        let obj = this.node.init[i]
        this.node.init[i].disabled = false
      }
    },
    resetForm(formName) {
      this.mode.select = this.$$.config.initGroupMode
      this.node.select = []
      this.gID = ''
      this.resetNode()
      // this.changeMode()
    },
  }
}
</script>