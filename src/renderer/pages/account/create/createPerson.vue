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
          <el-form-item v-if="node.refresh">
            <el-tag @close="removeNode(item, index)" v-for="(item, index) in node.select" :key="index" closable :type="item.url" class="WW100 flex-bc H40" :class="node.select.length !== (index + 1) ? 'mb-20' : ''" :title="item.url">
              {{item.name}}
            </el-tag>
          </el-form-item>
          <el-form-item>
            <div class="flex-bc">
              <el-select class="WW100" v-model="node.add" filterable allow-create default-first-option  :title="node.add" no-data-text="Null" :placeholder="$t('error').err_12">
                <el-option
                  v-for="(item, index) in node.init"
                  :key="index"
                  :label="item.name"
                  :value="item.url">
                </el-option>
              </el-select>
              <el-button class="ml-10" @click="addNode">{{$t('btn').select}}</el-button>
            </div>
          </el-form-item>
          <el-form-item class="mt-30">
            <el-button type="primary" native-type="submit" @click="submitForm('groupForm')">{{$t('btn').createAccount}}</el-button>
            <el-button @click="resetForm('groupForm')">{{$t('btn').restart}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="70%" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false">
      <div class="confirm-list-box" v-loading="loading.enode" :element-loading-text="$t('loading').l_1">
        <ul class="list-box">
          <li class="item flex-ai-fs" v-for="(item, index) in createEnodeArr" :key="index">
            <div class="label flex-sc">
              {{$t('label').admins}} {{index + 1}}
              <div class="flex-sc" style="font-weight: normal">
                （
                <span class="color_green flex-bc" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                <span class="color_red flex-bc" v-else><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>）：
              </div>
            </div>
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
import {insertNode, findNode} from '@/db/node'
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
      baseUrl: '',
      mode: {
        init: this.$$.mode,
        select: this.$$.config.initGroupMode
      },
      node: {
        init: [],
        select: [],
        min: 0,
        max: 0,
        add: '',
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
       this.setNetUrl(res)
    },
    getNodeInfosDev (res) {
       this.setNetUrl(res)
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
      if (this.$$.config.env === 'dev') {
        this.baseUrl = 'getNodeInfosDev'
      }
      this.$socket.emit(this.baseUrl)
      this.changeMode()
    },
    addNode () {
      console.log(this.node.add)
      if (!this.node.add) {
        this.msgError(this.$t('error').err_12)
        return
      }
      if (this.node.select.length >= this.node.max) {
        this.msgError(this.$t('error').err_14)
        this.node.add = ''
        return
      }
      let isExist = true, nowSelect = {}
      for (let obj of this.node.init) {
        if (obj.url === this.node.add) {
          isExist = false
          nowSelect = obj
          break
        }
      }
      if (!isExist) {
        let isRepeat = false
        for (let obj of this.node.select) {
          if (obj.url === nowSelect.url) {
            isRepeat = true
            break
          }
        }
        if (!isRepeat) {
          this.node.select.push(nowSelect)
        } else {
          this.msgError(this.$t('error').err_13)
        }
      } else {
        let url = this.node.add
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url
        }
        let newNode = {
          name: url,
          url: url
        }
        this.node.select.push(newNode)
        this.saveRpcDB(newNode)
      }
      this.node.add = ''
    },
    saveRpcDB (data) {
      let url = data.url
      if (!this.noSaveDBnet.has(url)) {
        findNode({url: url}).then(res => {
          if (res.length <= 0 && url !== this.$$.config.serverRPC) {
            insertNode({
              url: url
            }).then(res1 => {
              console.log(res1)
              this.getNetUrl()
            })
          }
        })
      }
    },
    removeNode (item, index) {
      console.log(item)
      this.node.select.splice(index, 1)
    },
    refreshNode () {
      this.node.refresh = false
      this.$nextTick(() => {
        this.node.refresh = true
      })
    },
    setNetUrl (res) {
      this.noSaveDBnet = new Set()
      this.node.init = []
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
        this.node.init = arr
        // this.node.init = [
        //   {name: 1, url: 'http://47.92.168.85:9011', disabled: false},
        //   {name: 2, url: 'http://47.92.168.85:9012', disabled: false},
        //   {name: 3, url: 'http://47.92.168.85:9013', disabled: false},
        //   {name: 4, url: 'http://47.92.168.85:9014', disabled: false},
        //   {name: 5, url: 'http://47.92.168.85:9015', disabled: false},
        // ]
        // console.log(this.node.init)
      }
      this.getNetUrl()
    },
    getNetUrl () {
      findNode().then(res => {
        // console.log(res)
        if (res.length > 0) {
          for (let obj of res) {
            if (!this.noSaveDBnet.has(obj.url)) {
              this.noSaveDBnet.add(obj.url)
              this.node.init.push({
                url: obj.url,
                name: obj.url
              })
            }
          }
        }
      })
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
        arr.push(this.getEnode(obj.url))
      }
      this.createEnodeArr = [{
        name: 'Current Node',
        url: this.serverRPC,
        enode: this.eNode,
        status: 1,
        initiate: 1
      }]
      Promise.all(arr).then(res => {
        // console.log(this.$$.web3)
        this.$$.web3.setProvider(this.serverRPC)
        // console.log(this.$$.web3)
        // console.log(res)
        for (let i = 0, len = res.length; i < len; i++) {
          let obj = {
            name: this.node.select[i].name,
            url: this.node.select[i].url,
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
        // console.log(this.createEnodeArr)
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
    },
    resetForm(formName) {
      this.mode.select = this.$$.config.initGroupMode
      this.node.select = []
      this.gID = ''
    },
  }
}
</script>