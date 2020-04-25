<template>
  <div class="boxConntent1 container">
    <div class="d-content-view">
      <h3 class="h3">{{$t('label').send}}{{$$.cutERC20(sendDataObj.coinType).coinType}}</h3>
      <el-form ref="txnsInfoForm" :model="rawTx" :rules="rules" label-width="120px" label-position="top" @submit.native.prevent>
        <el-form-item :label="$t('label').sendAddr" prop="to">
          <el-input v-model="rawTx.to"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').amount" prop="value">
          <el-input type="number" v-model="rawTx.value"></el-input>
          <span class="font12 color_99">{{$t('label').balance + ': ' + $$.fromWei(sendDataObj.balance, $$.cutERC20(sendDataObj.coinType).coinType)}}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            @click="submitForm('txnsInfoForm')"
            class="btn mt-30 WW100 HH40 font16 btn-primary"
            :disabled="!rawTx.to || !rawTx.value"
          >
            {{$t('label').send}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick" :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
// @import '@/assets/scss/index';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import regExp from '@/assets/js/config/RegExp.js'
export default {
  name: '',
  props: {
    sendDataObj: {
      type: Object
    },
    gID: {
      type: String
    },
    gMode: {
      type: String
    },
    gMemberSelect: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      eDialog: {
        pwd: false
      },
      childGroupID: '',
      dataPage: {},
      rawTx: {
        to: '',
        value: ''
      },
      initTxnsData: {},
      rules: {
        to: [
          { required: true, message: this.$t('warn').w_14, trigger: 'blur' }
        ],
        value: [
          { required: true, message: this.$t('warn').w_15, trigger: 'blur' },
          // { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.initTxnsData = this.$route.query
    this.gMode = this.initTxnsData.mode ? this.initTxnsData.mode : ''
    // console.log(this.initTxnsData)
    // console.log(this.gMemberSelect)
    // console.log(this.sendDataObj)
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
      this.$emit('closeModal')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createGroup()
          // this.openPwdDialog()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    createGroup () {
      // let arr = [this.eNode]
      let arr = []
      console.log()
      for (let obj of this.gMemberSelect) {
        if (!arr.includes(obj)) {
          arr.push(obj)
        }
      }
      this.$$.createGroup(this.gMode, arr).then(res => {
        let gInfo = res
        console.log(gInfo)
        if (gInfo.msg === 'Success') {
          this.childGroupID = res.info.Gid
          this.openPwdDialog()
        } else {
          this.msgError(gInfo.info.toString())
          this.modalClick()
        }
      }).catch(err => {
        this.msgError(err)
        this.modalClick()
      })
    },
    openPwdDialog () {
      if (!this.childGroupID) {
        this.msgError(this.$t('warn').w_1)
        return
      }
      let coin = this.$$.cutERC20(this.sendDataObj.coinType).coinType
      let balance = this.$$.fromWei(this.sendDataObj.balance, coin)
      if (!regExp.coin[coin].test(this.rawTx.to) && coin !== 'BTC') {
        this.msgError('This to address is illegal!')
        return
      }
      if (Number(this.rawTx.value) > Number(balance)) {
        this.msgError(this.$t('warn').w_19)
        return
      }
      this.dataPage = {
        from: this.address,
      }
      this.$$.getLockOutNonce(this.address, this.sendDataObj.coinType, this.sendDataObj.dcrmAddr).then(nonce => {
        this.dataPage.nonce = nonce
        this.dataPage.value = this.$$.toWei(this.rawTx.value, coin)
        this.dataPage.data = 'LOCKOUT:'
                              + this.sendDataObj.dcrmAddr
                              + ':' 
                              + this.rawTx.to
                              + ':'
                              + this.dataPage.value
                              + ':'
                              + this.sendDataObj.coinType
                              + ':'
                              + this.childGroupID
                              + ':'
                              + this.gMode
                              + ':'
                              + this.accountType
                              + ':'
                              + Date.now()
        console.log(this.dataPage)
        this.eDialog.pwd = true
      })
    },
    getSignData (data) {
      this.modalClick()
      // this.loading.account = true
      if (data.signTx) {
        this.$$.lockout(data.signTx).then(res => {
          console.log(res)
          if (res.msg === 'Success') {
            this.msgSuccess('Success!')
            this.saveTxnsDB(res.info)
          } else {
            this.msgError(res.error)
          }
        }).catch(err => {
          console.log(err)
          this.msgError(err.error)
        })
      } else {
        this.msgError('Error')
      }
    },
    saveTxnsDB (key) {
      let data = {
        from: this.sendDataObj.dcrmAddr,
        to: this.rawTx.to,
        value: this.dataPage.value,
        nonce: this.dataPage.nonce,
        coinType: this.sendDataObj.coinType,
        hash: '',
        status: 0,
        pubKey: this.initTxnsData.publicKey ? this.initTxnsData.publicKey : '',
        key: key,
        mode: this.gMode,
        gId: this.gID
      }
      if (Number(this.accountType) === 1) {
        data.kId = this.address
        data.eNode = this.eNode
      } else {
        data.gArr = [
          {eNode: this.eNode, nodeKey: this.$$.eNodeCut(this.eNode).key, kId: this.address, status: 5, timestamp: Date.now(), initiate: 1}
        ]
        for (let obj of this.gMemberSelect) {
          if (obj === this.eNode) continue
          data.gArr.push({eNode: obj, nodeKey: this.$$.eNodeCut(obj).key, kId: '', status: 0, timestamp: '', initiate: 0})
        }
      }
      console.log(data)
      if (Number(this.accountType) === 1) {
        // AddPersonTxns(this, dataUrl, data)
        if (this.networkMode) {
          this.$socket.emit('PersonAddTxns', data)
        } else {
          this.$db.AddPersonTxns(data)
        }
      } else {
        // AddGroupTxns(this, dataUrl, data)
        if (this.networkMode) {
          this.$socket.emit('GroupAddTxns', data)
        } else {
          this.$db.AddGroupTxns(data)
        }
      }
      
      this.resetForm()
    },
    resetForm() {
      this.dataPage = {}
      this.rawTx = {
        to: '',
        value: ''
      }
    },
  }
}
</script>