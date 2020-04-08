<template>
  <div class="boxConntent1 container" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">

    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form ref="node" :rules="rules" label-width="100px" label-position="top" @submit.native.prevent>
          <el-form-item>
            <div slot="label" class="flex-sc">
              <span class="color_red">*</span>
              {{$t('label').mode}}
            </div>
            <setMode @setMode="getMode"></setMode>
          </el-form-item>
          <!-- <el-form-item :label="$t('label').mode" >
            <el-select v-model="mode.select" :placeholder="$t('warn').w_4" class="WW100">
              <el-option v-for="(item, index) in mode.init" :key="index" :label="item.name + ' ' + $t('label').mode" :value="item.val"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item
            v-for="(item, index) in node.select" :key="index" :prop="'eNode.' + index + '.value'"
          >
            <div slot="label" class="flex-sc">
              <span class="color_red">*</span>
              {{$t('label').admins + (index + 1)}}
              <div class="ml-20" v-if="node.refresh">
                <span class="color_green" v-if="item.state === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                <span class="color_red" v-if="item.state === 'OffLine'"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
              </div>
            </div>
            <div class="flex-bc">
              <el-input v-model="item.value" @blur="changeState(item, index)" :disabled="item.value === eNode || item.isSelf ? true : false" :title="item.value"></el-input>
            </div>
          </el-form-item>
          <el-form-item class="mt-30">
            <el-button type="primary" native-type="submit" @click="submitForm('node')">{{$t('btn').createAccount}}</el-button>
            <el-button @click="resetForm('node')">{{$t('btn').restart}}</el-button>
            <!-- <el-button @click="toUrl('/fsgsd')">返回</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="70%" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false">
      <div class="confirm-list-box">
        <ul class="list-box">
          <li class="item flex-ai-fs">
            <p class="label flex-sc WW100">{{$t('label').mode}}:{{mode.select}} {{$t('label').mode}}</p>
            <!-- <p class="info">{{mode.select}} {{$t('label').mode}}</p> -->
          </li>
          <!-- <li class="item flex-ai-fs" v-for="(item, index) in node.select" :key="index"> <p class="label">{{$t('label').admins}} {{index + 1}}:</p> <p class="info">{{item.value}}</p> </li> -->
        </ul>
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="$t('label').admins + ' ' + (index + 1)" :name="index + 1" v-for="(item, index) in node.select" :key="index">
            <template slot="title">
              <div class="flex-sc">
                <span>{{item.isSelf ? $t('label').initiator : ($t('label').admins + ' ' + index)}}</span>
                <span class="flex-sc ml-10" v-if="!item.isSelf">(IP: {{item.value ? ($$.splitTx(item.value) && $$.splitTx(item.value).ip ?  $$.splitTx(item.value).ip : '') : ''}})</span>
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
      rules: {}
    }
  },
  components: {setMode},
  watch: {
    ...watchs,
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    setTimeout(() => {
      this.init()
    },  300)
    // console.log(this.$$.eNodeCut(this.eNode))
  },
  methods: {
    ...methods,
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
      let arr = [], signStr = ''
      for (let obj of this.node.select) {
        arr.push(this.$$.splitTx(obj.value).eNode)
        signStr += ':' + this.$$.splitTx(obj.value).signTx
      }
      console.log(arr)
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
        }]
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
      // console.log(item)
      // console.log(this.$$.splitTx(item.value))
      this.$$.getEnodeState(this.$$.splitTx(item.value).eNode).then(res => {
        console.log(res)
        this.node.select[index].state = res
        this.refreshNode()
      })
    },
    changeMode (cur, old) {
      cur = cur ? cur : this.mode.select
      old = old ? old : this.$$.config.initGroupMode
      // let openMode = ['3/3', '5/5']
      // if (!openMode.includes(cur)) {
      //   this.mode.select = old
      //   this.msgError(this.$t('tip').devTip)
      // }
      let num = Number(this.mode.select.split('/')[1])
      this.node.select = []
      for (let i = 0; i < num; i++) {
        if (i === 0) {
          this.node.select.push({
            value: this.eNode + this.eNodeTx + this.address,
            isSelf: true,
            key: Date.now()
          })
        } else {
          this.node.select.push({
            value: '',
            isSelf: false,
            key: Date.now()
          })
        }
      }
    },
    // $$.splitTx (tx) {
    //   if (!tx || !this.eNode) return
    //   tx = tx.split('0x')
    //   // let eNodeKey = this.$$.eNodeCut(tx[0]).key
    //   let obj = this.$$.eNodeCut(tx[0])
    //   return {
    //     address: '0x' + tx[2],
    //     signTx: '0x' + tx[1],
    //     eNode: tx[0],
    //     ip: obj && obj.ip ? obj.ip : '',
    //     eNodeId: obj && obj.key ? obj.key : ''
    //   }
    // },
  }
}
</script>