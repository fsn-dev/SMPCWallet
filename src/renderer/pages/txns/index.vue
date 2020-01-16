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

      <!-- <div class="flex-ec mt-50 font14 color_99 cursorP" @click="toUrl('/txnsHistory', {
        coinType: sendDataObj.coinType,
        address: sendDataObj.dcrmAddr,
      })">{{$t('btn').lookHistory}}</div> -->
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
    gMemberInit: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      eDialog: {
        pwd: false
      },
      dataPage: {},
      rawTx: {
        to: '',
        value: ''
      },
      initTxnsData: {},
      rules: {
        to: [
          { required: true, message: '请输入目标地址', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          // { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
      }
    }
  },
  sockets: {
    GroupAddTxns (res) {
      console.log(res)
    },
    PersonAddTxns (res) {
      console.log(res)
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.initTxnsData = this.$route.query
    // console.log(this.initTxnsData)
    // console.log(this.sendDataObj)
  },
  methods: {
    modalClick () {
      console.log(12)
      this.eDialog.pwd = false
      this.$emit('closeModal')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.createGroup()
          this.openPwdDialog()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    openPwdDialog () {
      if (!this.gID) {
        this.msgError(this.$t('warn').w_1)
        return
      }
      let balance = this.$$.fromWei(this.sendDataObj.balance, this.$$.cutERC20(this.sendDataObj.coinType).coinType)
      if (Number(this.rawTx.value) > Number(balance)) {
        this.msgError(this.$t('warn').w_19)
        return
      }
      // this.gMode = '3/3'
      this.dataPage = {
        from: this.address,
      }
      this.$$.getLockOutNonce(this.address, this.sendDataObj.coinType, this.sendDataObj.dcrmAddr).then(nonce => {
        this.dataPage.nonce = nonce
        this.dataPage.value = this.$$.toWei(this.rawTx.value, this.$$.cutERC20(this.sendDataObj.coinType).coinType)
        this.dataPage.data = 'LOCKOUT:'
                              + this.sendDataObj.dcrmAddr
                              + ':' 
                              + this.rawTx.to
                              + ':'
                              + this.dataPage.value
                              + ':'
                              + this.sendDataObj.coinType
                              + ':'
                              + this.gID
                              + ':'
                              + this.gMode
                              + ':'
                              + this.safeMode
        // this.drawer.send = false
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
      }
      let dataUrl = 'GroupAddTxns'
      if (Number(this.safeMode) === 1) {
        dataUrl = 'PersonAddTxns'
        data.kId = this.address
        data.eNode = this.eNode
      } else {
        data.gArr = [
          {eNode: this.eNode, kId: this.address, status: 5, timestamp: Date.now(), initiate: 1}
        ]
        for (let obj of this.gMemberInit) {
          data.gArr.push({eNode: obj.eNode, kId: '', status: 0, timestamp: '', initiate: 0})
        }
        data.gId = this.gID
        data.key = key
      }
      console.log(data)
      this.$socket.emit(dataUrl, data)
      
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