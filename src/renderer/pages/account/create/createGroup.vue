<template>
  <div class="boxConntent1 container" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">

    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form ref="groupForm" :rules="rules" label-width="100px" label-position="top" @submit.native.prevent>
          <el-form-item :label="$t('label').mode"
            :rules="{
              required: true, message: $t('warn').w_5, trigger: 'blur'
            }">
            <el-select v-model="mode.select" :placeholder="$t('warn').w_4" class="WW100">
              <el-option v-for="(item, index) in mode.init" :key="index" :label="item.name + ' ' + $t('label').mode" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in node.select" :label="$t('label').admins + (index + 1)" :key="index" :prop="'eNode.' + index + '.value'"
            :rules="{
              required: true, message: $t('warn').w_7, trigger: 'blur'
            }"
          >
            <div class="flex-bc">
              <el-input v-model="item.value" @blur="changeState(item, index)" :disabled="item.value === eNode || item.isSelf ? true : false" :title="item.value"></el-input>
            </div>
            <div class="flex-sc" v-if="node.refresh">
              <span class="color_green" v-if="item.state === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
              <span class="color_red" v-if="item.state === 'OffLine'"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
            </div>
          </el-form-item>
          <el-form-item class="mt-30">
            <el-button type="primary" native-type="submit" @click="submitForm('groupForm')">{{$t('btn').createAccount}}</el-button>
            <el-button @click="resetForm('groupForm')">{{$t('btn').restart}}</el-button>
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
            <div>{{item.value}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <!-- <el-button type="primary" @click="reqAccount" :disabled="!loading.confirm">{{$t('btn').confirm}}</el-button> -->
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
import {findGroup} from '@/db/group'
import {uodateStatus} from '@/db/status'
import {AddGroupAccountsFn} from '@/api/index.js'

import {datas, watchs, methods} from './js/common.js'
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
  watch: {
    ...watchs,
    'mode.select' (cur, old) {
      this.changeMode(cur, old)
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.init()
  },
  methods: {
    ...methods,
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.eDialog.confirm = true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    createGroup () {
      let arr = [], signStr = ''
      for (let obj of this.node.select) {
        arr.push(this.splitTx(obj.value).eNode)
        signStr += ':' + this.splitTx(obj.value).signTx
      }
      console.log(arr)
      this.createAndGetGid(this.mode.select, arr, signStr)
    },
    updateStatus (key) {
      uodateStatus({
        key: key,
        type: 1,
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
          kId: this.address,
          status: 5,
          initiate: 1,
          timestamp: Date.now()
        }]
      }
      for (let obj of this.node.select) {
        let obj2 = this.splitTx(obj.value)
        if (this.eNode.indexOf(obj2.eNodeId) !== -1) continue
        let obj1 = {
          eNode: obj2.eNode,
          kId: obj2.address,
          status: 0,
          initiate: 0,
          timestamp: ''
        }
        data.member.push(obj1)
      }
      AddGroupAccountsFn(this, 'GroupAccountsAdd', data)
    },
    changeState (item, index) {
      if (!item.value) return
      let enode = item.value
      let enodeArr = this.node.select
      if (enode.indexOf('enode:') < 0 || enode.indexOf('@') < 0 ) {
        this.msgError(this.$t('warn').w_18)
        return
      }
      let arr = new Set()
      for (let i = 0, len = enodeArr.length; i < len; i++) {
        if (i !== index && enodeArr[i].value) {
          let eNodeKey = enodeArr[i].value.match(/enode:\/\/(\S*)@/)[1]
          arr.add(eNodeKey)
        }
      }
      let enode1 = enode.match(/enode:\/\/(\S*)@/)[1]
      if (arr.has(enode1)) {
        this.node.select[index].value = ''
        this.msgError('Repeat')
        return
      }
      this.$$.getEnodeState(item.value.replace(/\s/, '').split('0x')[0]).then(res => {
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
    splitTx (tx) {
      if (!tx) return
      tx = tx.split('0x')
      let eNodeKey = tx[0].match(/enode:\/\/(\S*)@/)
      return {
        address: '0x' + tx[2],
        signTx: '0x' + tx[1],
        eNode: tx[0],
        eNodeId: eNodeKey[1]
      }
    },
  }
}
</script>