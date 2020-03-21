<template>
  <div class="boxConntent1 container" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">

    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form :model="groupForm" ref="groupForm" :rules="rules" label-width="100px" label-position="top" @submit.native.prevent>
          <el-form-item :label="$t('label').mode"
            :rules="{
              required: true, message: $t('warn').w_5, trigger: 'blur'
            }">
            <el-select v-model="groupForm.mode" :placeholder="$t('warn').w_4" class="WW100">
              <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name + ' ' + $t('label').mode" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in groupForm.eNode" :label="$t('label').admins + (index + 1)" :key="index" :prop="'eNode.' + index + '.value'"
            :rules="{
              required: true, message: $t('warn').w_7, trigger: 'blur'
            }"
          >
            <div class="flex-bc">
              <el-input v-model="item.value" @blur="changeState(item, index)" :disabled="item.value === eNode || item.isSelf ? true : false" :title="item.value"></el-input>
            </div>
            <div class="flex-sc" v-if="reload">
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
          <!-- <li class="item flex-ai-fs"> <p class="label">账户名:</p> <p class="info">{{groupForm.name}}</p> </li> -->
          <li class="item flex-ai-fs"> <p class="label">{{$t('label').mode}}:</p> <p class="info">{{groupForm.mode}} {{$t('label').mode}}</p> </li>
          <li class="item flex-ai-fs" v-for="(item, index) in groupForm.eNode" :key="index"> <p class="label">{{$t('label').admins}} {{index + 1}}:</p> <p class="info">{{item.value}}</p> </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="reqAccount" :disabled="!loading.confirm">{{$t('btn').confirm}}</el-button>
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
      activeName: 'first',
      reload: true,
      getGroup: [],
      eDialog: {
        pwd: false,
        confirm: false
      },
      loading: {
        creat: false,
        confirm: true
      },
      gID: 0,
      dataPage: {},
      groupForm: {
        mode: this.$$.config.initGroupMode,
        eNode: [],
        name: ''
      },
      gMember: '',
      modeArr: this.$$.mode,
      signTx: '',
      rules: {
        name: [
          { required: true, message: this.$t('warn').w_8, trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('warn').w_9, trigger: 'blur' }
        ],
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
    'groupForm.mode' (cur, old) {
      this.changeMode(cur, old)
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.getGroupData()
    this.changeMode()
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
      this.eDialog.confirm = false
      this.$emit('closeModal')
    },
    getGroupData () {
      this.$$.getGroup().then(res => {
        console.log(res)
        this.getGroup = []
        let arr = res.info ? res.info : []
        for (let i = 0, len = arr.length; i< len; i++) {
          arr[i].name = arr[i].name ? arr[i].name : arr[i].Gid
          this.getGroup.push(arr[i])
          this.getGName(arr[i], i)
        }
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
      })
    },
    getGName (item, i) {
      findGroup({gId: item.Gid}).then(res => {
        // console.log(res)
        if (res.length > 0) {
          this.getGroup[i].name = res[0].name
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createGroup()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    createGroup () {
      let arr = []
      for (let obj of this.groupForm.eNode) {
        arr.push(this.splitTx(obj.value).eNode)
      }
      console.log(arr)
      this.$$.createGroup(this.groupForm.mode, arr).then(res => {
        let gInfo = res
        console.log(gInfo)
        if (gInfo.msg === 'Success') {
          this.gID = res.info.Gid
          this.openPwdDialog()
        } else {
          this.msgError(gInfo.info.toString())
          this.loading.creat = false
          this.$emit('closeModal')
          this.modalClick()
        }
      }).catch(err => {
        this.msgError(err)
        this.loading.creat = false
        this.$emit('closeModal')
        this.modalClick()
      })
    },
    openPwdDialog () {
      if (!this.gID) {
        this.msgError(this.$t('warn').w_3)
        return
      }
      let data = 'REQDCRMADDR:' + this.gID + ':' + this.groupForm.mode + ':' + Date.now()
      for (let obj of this.groupForm.eNode) {
        data += ':' + this.splitTx(obj.value).signTx
      }
      console.log(data)
      this.dataPage = {
        from: this.address,
      }
      this.loading.creat = true
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
      // this.loading.creat = true
      if (data.signTx) {
        this.signTx = data.signTx
        this.eDialog.confirm = true
      } else {
        this.msgError('Error')
      }
    },
    reqAccount () {
      if (!this.loading.confirm) return
      this.loading.confirm = false
      setTimeout(() => {
        this.$nextTick(() => {
          this.loading.confirm = true
        })
      }, 3000)
      // return
      this.$$.reqAccount(this.signTx, this.accountType).then(res => {
        console.log(res)
        if (res.msg === 'Success') {
          this.$store.commit('setAccountType', {info: '0'})
          this.loading.creat = false
          this.$emit('closeModal')
          this.modalClick()
          this.updateStatus(res.info)
          this.saveDB(res.info)
          this.msgSuccess(this.$t('success').s_3)
        }
        this.toUrl('/waitNews')
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
        this.loading.creat = false
      })
    },
    updateStatus (key) {
      uodateStatus({
        key: key,
        type: 1,
        status: 1
      }).then(res => {
        console.log(res)
      })
    },
    saveDB (key) {
      let data = {
        key: key,
        gId: this.gID,
        mode: this.groupForm.mode,
        nonce: Number(this.dataPage.nonce),
        member: [{
          eNode: this.eNode,
          kId: this.address,
          status: 5,
          initiate: 1,
          timestamp: Date.now()
        }]
      }
      for (let obj of this.groupForm.eNode) {
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
      // this.$socket.emit('GroupAccountsAdd', data)
      AddGroupAccountsFn(this, 'GroupAccountsAdd', data)
    },
    changeGroup () {
      this.gMember = ''
      for (let obj of this.getGroup) {
        if (this.gID === obj.Gid) {
          this.gMember = obj
          break
        }
      }
      console.log(this.gMember)
      if (this.gID === 0) {
        this.groupForm.mode = this.$$.config.initGroupMode
        this.changeMode()
      } else {
        this.groupForm.mode = this.gMember.Mode
        this.groupForm.eNode = []
        for (let obj of this.gMember.Enodes) {
          this.groupForm.eNode.push({
            value: obj,
            key: Date.now()
          })
        }
      }
    },
    changeState (item, index) {
      if (!item.value) return
      let enode = item.value
      let enodeArr = this.groupForm.eNode
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
        this.groupForm.eNode[index].value = ''
        this.msgError('Repeat')
        return
      }
      this.$$.getEnodeState(item.value.replace(/\s/, '').split('0x')[0]).then(res => {
        console.log(res)
        this.groupForm.eNode[index].state = res
        this.reload = false
        this.$nextTick(() => {
          this.reload = true
        })
      })
    },
    changeMode (cur, old) {
      cur = cur ? cur : this.groupForm.mode
      old = old ? old : this.$$.config.initGroupMode
      let openMode = ['3/3', '5/5']
      if (!openMode.includes(cur)) {
        this.groupForm.mode = old
        this.msgError(this.$t('tip').devTip)
      }
      let num = Number(this.groupForm.mode.split('/')[1])
      this.groupForm.eNode = []
      for (let i = 0; i < num; i++) {
        if (i === 0) {
          this.groupForm.eNode.push({
            value: this.eNode + this.eNodeTx + this.address,
            isSelf: true,
            key: Date.now()
          })
        } else {
          this.groupForm.eNode.push({
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
    resetForm(formName) {
      this.groupForm = {
        mode: this.$$.config.initGroupMode,
        eNode: [],
        name: ''
      }
      this.gID = 0
      this.changeMode()
    },
  }
}
</script>