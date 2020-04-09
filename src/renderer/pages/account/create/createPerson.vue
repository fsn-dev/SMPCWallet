<template>
  <div class="boxConntent1 container" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">
    <!-- <div class="c-form-box"> -->
    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form ref="groupForm" :rules="rules" label-width="100px" label-position="top" @submit.native.prevent>
          <el-form-item>
            <div slot="label" class="flex-sc">
              <span class="color_red">*</span>
              {{$t('label').mode}}
            </div>
            <setMode @setMode="getMode"></setMode>
          </el-form-item>
          <el-form-item v-if="node.refresh && node.select.length > 0">
            <el-tag @close="removeNode(item, index)" v-for="(item, index) in node.select" :key="index" closable :type="item.url" class="WW100 flex-bc H40" :class="node.select.length !== (index + 1) ? 'mb-10' : ''" :title="item.url">
              {{item.name}}
            </el-tag>
          </el-form-item>
          <el-form-item>
            <div class="flex-bc">
              <el-select class="WW100" v-model="node.add" filterable allow-create default-first-option  :title="node.add" no-data-text="Null" :placeholder="$t('error').err_12" :loading="loadingSelect" :loading-text="$t('loading').l_1">
                <el-option
                  v-for="(item, index) in netUrlArr"
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

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="70%" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false" >
      <div class="confirm-list-box" v-loading="loading.confirm" :element-loading-text="$t('loading').l_1">
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

import {datas, watchs, methods} from './js/common.js'
import {nodeDatas, nodeSockets, nodeMethods} from '@/assets/js/pages/node/index.js'
import setMode from '@/components/setMode/index.vue'
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
      ...datas,
      ...nodeDatas,
      rules: {},
      createEnodeArr: []
    }
  },
  components: {setMode},
  computed: {
    ...computedPub,
  },
  watch: {
    ...watchs,
  },
  sockets: {
    ...nodeSockets,
  },
  mounted () {
    this.init()
    this.getNetUrl()
  },
  methods: {
    ...methods,
    ...nodeMethods,
    addNode () {
      if (!this.node.add) {
        this.msgError(this.$t('error').err_12)
        return
      }
      if (this.node.select.length >= this.node.max) {
        this.msgError(this.$t('error').err_14)
        this.node.add = ''
        return
      }
      if (this.node.add === this.serverRPC) {
        this.msgError(this.$t('error').err_13)
        this.node.add = ''
        return
      }
      console.log(this.node.add)
      let reg = /[,;\-_=+]+/g
      // let str = reg.test(this.node.add)
      // console.log(addArr)
      let arr = []
      if (reg.test(this.node.add)) {
        let addArr = this.node.add.replace(reg, ',').split(',')
        // console.log(addArr.includes(this.serverRPC))
        for (let obj of addArr) {
          if (!arr.includes(obj) && this.serverRPC !== obj) {
            arr.push(obj)
          }
        }
      } else {
        arr.push(this.node.add)
      }
      
      // for (let url of arr) {
      for (let i = 0, len = arr.length; i < len; i ++) {
        this.setNode(arr[i], i)
      }
      this.node.add = ''
    },
    setNode (nodeUrl, index) {
      // console.log(nodeUrl)
      let isExist = true, nowSelect = {}
      for (let obj of this.netUrlArr) {
        if (obj.url === nodeUrl) {
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
          setTimeout(() => {
            this.msgError(this.$t('error').err_13 + '  ' + nodeUrl)
          }, index * 150)
        }
      } else {
        let url = nodeUrl
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url
        }
        let newNode = {
          name: url,
          url: url
        }
        this.node.select.push(newNode)
        this.saveRpcDB(newNode.url)
      }
    },
    removeNode (item, index) {
      // console.log(item)
      this.node.select.splice(index, 1)
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
        this.$$.web3.setProvider(this.serverRPC)
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
        this.loading.confirm = false
        // console.log(this.createEnodeArr)
      })
    },
    submitForm () {
      // console.log(this.node.select)
      if (this.node.select <= 0 || this.node.select < this.node.min || this.node.select.length < this.node.max) {
        this.msgError(this.$t('error').err_12)
      } else {
        this.eDialog.confirm = true
        this.loading.confirm = true
        this.getAllEnode()
      }
    },
    createGroup () {
      let arr = []
      for (let obj of this.createEnodeArr) {
        arr.push(obj.enode)
      }
      console.log(arr)
      this.createAndGetGid(this.mode.select, arr)
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
      if (this.networkMode) {
        this.$socket.emit('PersonAccountsAdd', data)
      } else {
        this.$db.AddPersonAccounts(data)
      }
      // this.$socket.emit('PersonAccountsAdd', data)
      // AddPersonAccountsFn(this, 'PersonAccountsAdd', data)
    },
    changeMode () {
      let modeArr = this.mode.select.split('/')
      this.node.min = Number(modeArr[0]) - 1
      this.node.max = Number(modeArr[1]) - 1
      this.node.select = []
    },
  }
}
</script>