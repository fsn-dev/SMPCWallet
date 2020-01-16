<template>
  <div class="boxConntent1 container" v-loading="loading.creat" element-loading-text="Loading……">

    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form :model="groupForm" ref="groupForm" :rules="rules" label-width="100px" label-position="top" @submit.native.prevent>
          <!-- <el-form-item :label="$t('label').group">
            <el-select v-model="gID" :placeholder="$t('warn').w_4" class="WW100" @change="changeGroup">
              <el-option :label="$t('btn').newBuild" :value="0"></el-option>
              <el-option v-for="(item, index) in getGroup" :key="index" :label="item.name" :value="item.Gid"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item :label="$t('label').mode"
            :rules="{
              required: true, message: $t('warn').w_5, trigger: 'blur'
            }">
            <el-select v-model="groupForm.mode" :placeholder="$t('warn').w_4" class="WW100" @change="changeMode">
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
        <el-button type="primary" @click="reqAccount">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.confirm-list-box {
  width: 100%;
  .list-box {
    width: 100%;
    .item {
      padding: size(8) size(0);color: $color-gray;
      .label {
        width: 20%;text-align: right;padding-right: size(10);font-weight: bold;white-space: nowrap;
      }
      .info {
        width: 80%;word-break: break-all;
      }
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {findGroup} from '@/db/group'
import {uodateStatus} from '@/db/status'
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
        creat: false
      },
      gID: 0,
      dataPage: {},
      groupForm: {
        mode: this.$$.config.initGroupMode,
        eNode: [
          // { value: 'enode://fbced7f239d5633d25c2afda08e4f00e24c054bd0a9e9055f9f104f53fe1ce331c5431442cb2120ff64010bf7ac9b39af5e3349bba546210b1ab003cd9384014@127.0.0.1:12341'},
          // { value: 'enode://4fa6865eb8fbf9dbe22b4d3188ae67d6f20368400c582ad366a5fd709f789ebda23514bd71548bc4c4cf401690d73cdd62bf5ce785c73cc3fc32d616a80b9e6d@127.0.0.1:12342'},
          // { value: 'enode://6e5cc6f7b953013fd7d5172e347a79f9ff44cc1a0a05d092646134f7fcbea391ea720119e7c9bcc6bb61a15f278bbf97d136fcc7271da42c7823ef0d28b3b947@127.0.0.1:12343'},
        ],
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
  sockets: {
    GroupAccountsAdd (res) {
      console.log(res)
    }
  },
  watch: {
    safeMode (cur) {
      if (Number(cur) === 1) {
        this.toUrl('/person')
      }
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.getGroupData()
    this.changeMode()
    this.splitTx()
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
      this.eDialog.confirm = false
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
        // this.getGroup = res.info ? res.info : []
        // this.getGroup = []
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
      })
    },
    getGName (item, i) {
      findGroup({gId: item.Gid}).then(res => {
        console.log(res)
        if (res.length > 0) {
          this.getGroup[i].name = res[0].name
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.eDialog.confirm = true
          this.createGroup()
          // this.openPwdDialog()
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
        // arr.push(obj.value)
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
      let data = 'REQDCRMADDR:' + this.gID + ':' + this.groupForm.mode
      for (let obj of this.groupForm.eNode) {
        // let eNodeKey = obj.value.split('0x')[0].match(/enode:\/\/(\S*)@/)[1]
        data += ':' + this.splitTx(obj.value).signTx
      }
      console.log(data)
      // this.gMode = '3/3'
      this.dataPage = {
        from: this.address,
      }
      this.$$.getReqNonce(this.address).then(nonce => {
        this.dataPage.nonce = nonce
        this.dataPage.value = 0
        this.dataPage.data = data
        console.log(this.dataPage)
        this.eDialog.pwd = true
      })
    },
    getSignData (data) {
      this.modalClick()
      // this.loading.creat = true
      if (data.signTx) {
        this.signTx = data.signTx
        this.eDialog.confirm = true
      } else {
        this.msgError('Error')
      }
    },
    reqAccount () {
      this.$$.reqAccount(this.signTx, '0').then(res => {
        console.log(res)
        if (res.msg === 'Success') {
          this.$store.commit('setSafeMode', {info: '0'})
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
          initiate: 1
        }]
      }
      for (let obj of this.groupForm.eNode) {
        let obj2 = this.splitTx(obj.value)
        if (this.eNode.indexOf(obj2.eNodeId) !== -1) continue
        let obj1 = {
          eNode: obj2.eNode,
          kId: obj2.address,
          status: 0,
          initiate: 0
        }
        data.member.push(obj1)
      }
      this.$socket.emit('GroupAccountsAdd', data)
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
    changeMode () {
      if (this.groupForm.mode !== this.$$.config.initGroupMode) {
        this.groupForm.mode = this.$$.config.initGroupMode
        this.msgError(this.$t('tip').devTip)
        return
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
        mode: '3/3',
        eNode: [],
        name: ''
      }
      this.gID = 0
      this.changeMode()
    },
  }
}
</script>