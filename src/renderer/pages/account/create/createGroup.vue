<template>
  <div class="boxConntent1 flex-c" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">
    <div class="create-box box_Wshadow1" :class="networkMode ? '' : 'off-create-box'">
      <div class="create-search-box" v-if="networkMode">
        <div class="create-search-bg">
          <div class="search-input flex-bc">
            <el-input placeholder="Search" prefix-icon="el-icon-search" v-model="searchVal" size="mini" @input="searchEnode"></el-input>
            <el-button type="primary" size="mini" class="ml-10" @click="addNode" v-if="userlist.length <= 0 && searchVal.length > 0">{{$t('btn').select}}</el-button>
          </div>
          <div class="search-cont" style="bottom: 30px;" v-if="userlist.length > 0">
            <el-checkbox-group v-model="checkList" @change="selectedEnode" class="list">
              <el-checkbox class="item flex-sc" v-for="(item, index) in userlist" :key="index" :label="item.enode + item.sign + item.address" :disabled="item.unIP === (token + '@' + serverRPC)">
                <el-tooltip placement="top" :open-delay="1000">
                  <div slot="content" class="W300">{{item.unIP}}</div>
                  <div class="W200 ellipsis">{{item.unIP}}</div>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="search-cont flex-c color_99 font14" style="bottom: 30px;" v-if="userlist.length <= 0">
            {{$t('tip').addFriendTip}}
          </div>
          <div class="add-friend flex-c" @click="openUrl('/social')">
            {{$t('btn').addFriend}}
          </div>
        </div>
      </div>
      <div class="create-selected-box">
        <div class="create-selected-bg">
          <div class="selected-input">
            <setMode @setMode="getMode" size="mini"></setMode>
          </div>
          <div class="selected-cont">
            <ul class="list">
              <li class="item" v-for="(item, index) in node.select" :key="index">
                <div class="flex-sc font12">
                  <span class="color_red">*</span>
                  {{$t('label').admins + (index + 1)}}
                  <div class="ml-20" v-if="node.refresh">
                    <span class="color_green" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                    <span class="color_red" v-if="item.status === 0"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
                  </div>
                </div>
                <el-input v-model="item.value" @blur="changeState(item, index)" :title="item.value" size="mini" :disabled="item.value === eNode || item.isDisabled || networkMode ? true : false"></el-input>
              </li>
            </ul>
          </div>
          <div class="flex-ec create-selected-btn">
            <el-button type="primary" size="mini" native-type="submit" @click="submitForm('node')">{{$t('btn').createGroup}}</el-button>
            <el-button size="mini" @click="resetForm('node')">{{$t('btn').restart}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="70%" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false">
      <div class="confirm-list-box">
        <ul class="list-box">
          <li class="item flex-ai-fs">
            <p class="label flex-sc WW100">{{$t('label').mode}}:{{mode.select}} {{$t('label').mode}}</p>
          </li>
        </ul>
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="$t('label').admins + ' ' + (index + 1)" :name="index + 1" v-for="(item, index) in node.select" :key="index">
            <template slot="title">
              <div class="flex-sc">
                <span>{{item.isDisabled ? $t('label').initiator : ($t('label').admins + ' ' + index)}}</span>
                <span class="flex-sc ml-10" v-if="!item.isDisabled">(IP: {{item.value ? ($$.splitTx(item.value) && $$.splitTx(item.value).ip ?  $$.splitTx(item.value).ip : '') : ''}})</span>
              </div>
            </template>
            <div>{{item.value}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="createGroup">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false' :close-on-press-escape="false">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import './scss/index.scss';

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'

import {datas, watchs, methods} from './js/common.js'

import setMode from '@/components/setMode/index.vue'
export default {
  name: 'createAccount',
  props: {
    formBoxClass: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ...datas,
      activeNames: '',
      rules: {},
      userlistInit: []
    }
  },
  components: {setMode},
  watch: {
    ...watchs,
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    UserEnodeSearch (res) {
      // console.log(res)
      if (res.msg === 'Success') {
        this.userlist = res.info
      } else {
        this.userlist = []
      }
      this.loading.search = false
    },
    UserFriendFind (res) {
      console.log(res)
      if (res.msg ='Success') {
        this.userlist = this.userlistInit = res.info
      } else {
        this.userlist = this.userlistInit = []
      }
    },
  },
  mounted () {
    setTimeout(() => {
      this.init()
      this.getFriends()
    },  300)
    // console.log(this.$$.eNodeCut(this.eNode))
  },
  methods: {
    ...methods,
    openUrl (url) {
      this.toUrl(url)
      this.modalClick()
    },
    getFriends () {
      this.$socket.emit('UserFriendFind', {address: this.address})
    },
    addNode () {
      let enodeObj = this.$$.splitTx(this.searchVal)
      console.log(enodeObj)
      // return
      if (!enodeObj.signTx || !enodeObj.address || enodeObj.eNode.indexOf('enode://') === -1) {
        this.msgError(this.$t('warn').w_18)
        return
      }
      if (this.checkList.includes(this.searchVal)) {
        this.msgError(this.$t('error').err_7)
        return
      }
      this.checkList.push(this.searchVal)
      this.selectedEnode()
      this.searchVal = ''
      // console.log(this.checkList)
    },
    selectedEnode (item) {
      // console.log(item)
      // console.log(this.checkList)
      item = this.checkList
      // console.log(this.node)
      if (item.length > this.node.max) {
        this.checkList.splice(item.length - 1, 1)
        this.msgError(this.$t('error').err_14)
        return
      }
      this.initSelectNode()
      for (let i = 0; i < this.node.max; i++) {
        if (item[i]) {
          // console.log(i)
          this.changeState({value: item[i]}, i + 1)
        } 
        if (!item[i]) {
          this.node.select[i + 1].status = ''
          this.node.select[i + 1].status = ''
        }
      }
    },
    searchEnode (query) {
      this.loading.search = true
      query = this.searchVal
      if (query) {
        this.userlist = this.userlistInit.filter(item => {
          return item.unIP.toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        })
      } else {
        this.userlist = this.userlistInit
      }
    },
    submitForm(formName) {
      // console.log(this.node.select)
      if (this.node.select <= 0) {
        this.msgError(this.$t('error').err_12)
        return
      }
      let _flag = false
      for (let obj of this.node.select) {
        if (!obj.value) {
          _flag = true
          break
        }
      }
      if (_flag) {
        this.msgError(this.$t('warn').w_7)
        return
      }
      this.eDialog.confirm = true
    },
    createGroup () {
      let arr = [], signArr = [], signStr = ''
      for (let obj of this.node.select) {
        arr.push(this.$$.splitTx(obj.value).eNode)
        signArr.push(this.$$.splitTx(obj.value).eNode + this.$$.splitTx(obj.value).signTx)
      }
      signStr = signArr.join('|')
      console.log(arr)
      console.log(signStr)
      this.createAndGetGid(this.mode.select, arr, signStr)
    },
    updateStatus (key) {
      this.$db.updateStatus({
        key: key,
        address: this.address,
        status: 1
      }).then(res => {
        console.log(res)
      })
    },
    saveDB (key) {
      let data = {
        key: key,
        gId: this.gID,
        mode: this.mode.select,
        nonce: Number(this.dataPage.nonce),
        member: [{
          eNode: this.eNode,
          nodeKey: this.$$.eNodeCut(this.eNode).key,
          kId: this.address,
          status: 5,
          initiate: 1,
          timestamp: Date.now()
        }],
        kId: this.address
      }
      for (let obj of this.node.select) {
        let obj2 = this.$$.splitTx(obj.value)
        if (this.eNode.indexOf(obj2.eNodeId) !== -1) continue
        let obj1 = {
          eNode: obj2.eNode,
          nodeKey: obj2.eNodeId,
          kId: obj2.address,
          status: 0,
          initiate: 0,
          timestamp: ''
        }
        data.member.push(obj1)
      }
      if (this.networkMode) {
        this.$socket.emit('GroupAccountsAdd', data)
      } else {
        this.$db.AddGroupAccounts(data)
      }
      // AddGroupAccountsFn(this, 'GroupAccountsAdd', data)
    },
    changeState (item, index) {
      if (!item.value) {
        this.msgError(this.$t('warn').w_7)
        return
      }
      let enode = item.value
      let enodeArr = this.node.select
      if (enode.indexOf('enode:') < 0 || enode.indexOf('@') < 0 ) {
        this.msgError(this.$t('warn').w_18)
        return
      }
      // console.log(enodeArr)
      let arr = new Set()
      for (let i = 0, len = enodeArr.length; i < len; i++) {
        if (i !== index && enodeArr[i].value) {
          let eNodeKey = this.$$.eNodeCut(enodeArr[i].value).key
          arr.add(eNodeKey)
        }
      }
      let enode1 = this.$$.eNodeCut(enode).key
      if (arr.has(enode1)) {
        this.node.select[index].value = ''
        this.msgError('Repeat')
        return
      }
      this.$$.getEnodeState(this.$$.splitTx(item.value).eNode).then(res => {
        // console.log(res)
        this.node.select[index].status = res
        this.node.select[index].value = enode
        this.refreshNode()
      })
    },
    changeMode (cur, old) {
      cur = cur ? cur : this.mode.select
      old = old ? old : this.$$.config.initGroupMode
      let modeArr = this.mode.select.split('/')
      this.node.min = Number(modeArr[0]) - 1
      this.node.max = Number(modeArr[1]) - 1
      this.checkList = []
      this.initSelectNode()
    },
    initSelectNode () {
      let num = this.node.max + 1
      this.node.select = []
      // for (let i = 0; i < num; i++) {
      //   if (i === 0) {
      //     this.node.select.push({
      //       value: this.eNode + this.eNodeTx + this.address,
      //       status: 1,
      //       isDisabled: true,
      //       key: Date.now()
      //     })
      //   } else {
      //     this.node.select.push({
      //       value: '',
      //       status: '',
      //       isDisabled: false,
      //       key: Date.now()
      //     })
      //   }
      // }
      this.node.select = [
        {
          value: 'enode://e6e6240b78b4d1f293693e14042099ad86b7277824d23534ffef720c31470342b7daf0a34289913b837e2ec45aee68eaab62c7170c22eb5328324037f34ad7a6@47.92.168.85:133330x1ef33f72c7894bc0ff130b3de4db8575adad59d506c762902a2381f1a13ca89a6dfb32b2d2273a3ac69a5b43964b38efab7135a502d41104bc5fc8cc97db970200',
          status: 1,
          isDisabled: true,
          key: Date.now()
        },
        {
          value: 'enode://15dfed9e836d2259066921412413b295e6c97f3dddb9a1078a9f7778099a56bd00d31a248fd1d2853e7c09e2adefb8870f98b232220293c815d0b2610e8bcc6e@47.92.168.85:133320x88bda080e0a9ed3d851b9728bcd189ee1cb0eaa737b6d3eafd7fd566aa7f975c02fb58a188bef0239102fa69c8adf12499c75be097f9e5499e03133851543d6e00',
          status: 1,
          isDisabled: true,
          key: Date.now()
        },
        {
          value: 'enode://fa93e6d82b859ddf5344ae39a6e1de3c38e0172f0678e0fda5b83cd245cbbabea5e89ff80c65dfac4aee25b93051b0e460388fb6c7f3ed5a368d501a48b96099@47.92.168.85:133310xd608be1aba865b699e0fc19c12172d8bd2c2f022a5f7b3a47fdfd613d2c330530283af5509355a2a19bd331a8018bf4cb2b6d9b645b4a911aa1e1f9fd0ab76b201',
          status: 1,
          isDisabled: true,
          key: Date.now()
        },
      ]
    }
  }
}
</script>