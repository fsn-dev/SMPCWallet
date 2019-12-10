<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="rawTxData" ref="rawTxData" :rules="rules" label-width="100px" label-position="top">
        <el-form-item :label="$t('label').to" prop="to">
          <el-input v-model="rawTxData.to"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').value" prop="value">
          <el-input type="number" v-model="rawTxData.value" min="0" :step="0.001"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('rawTxData')">{{$t('label').send}}</el-button>
          <el-button @click="resetForm('rawTxData')">{{$t('btn').restart}}</el-button>
          <el-button @click="toUrl('/group')">{{$t('btn').back}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/index';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      eDialog: {
        pwd: false
      },
      dataPage: {},
      rawTxData: {
        to: '',
        value: ''
      },
      initTxnsData: {},
      rules: {
        to: [
          { required: true, message: '请输入目标地址', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.initTxnsData = this.$route.query
    console.log(this.initTxnsData)
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
    },
    getSignData (data) {
      console.log(data)
      console.log(data.signTx)
      // this.createGroup()
      if (data.signTx) {
        let hash = this.$$.web3.dcrm.lockOut(data.signTx)
        console.log(hash)
      }
      this.eDialog.pwd = false
    },
    openPwdDialog () {
      try {
        let nonce = this.$$.getNonce(this.address, this.initTxnsData.coinType, this.initTxnsData.address)
        if (!isNaN(nonce)) {
          this.dataPage = {
            from: this.address,
            to: this.$$.config.rawTx.to,
            gasLimit: this.$$.config.rawTx.gasLimit,
            gasPrice: this.$$.config.rawTx.gasPrice,
            value: this.rawTxData.value,
            nonce: nonce,
            data: 'LOCKOUT:' 
                  + this.initTxnsData.address
                  + ':' 
                  + this.initTxnsData.dcrmAddr
                  + ':' 
                  + this.rawTxData.to
                  + ':'
                  + this.rawTxData.value
                  + ':'
                  + this.initTxnsData.coinType
                  + ':'
                  + this.initTxnsData.gID
                  + ':'
                  + this.initTxnsData.mode
          }
          this.eDialog.pwd = true
          // this.dataPage = this.$$.config.rawTx
          // this.dataPage.from = this.$$.getCookies(this.$$.config.cookies.address)
          console.log(this.dataPage)
        } else {
          this.$message({
            showClose: true,
            message: nonce,
            type: 'error'
          })
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: error.toString(),
          type: 'error'
        })
      }
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
    resetForm(formName) {
      this.rawTxData = {
        to: '',
        value: ''
      }
    },
  }
}
</script>