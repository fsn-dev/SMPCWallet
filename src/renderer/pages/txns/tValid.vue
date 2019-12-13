<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="rawTxData" ref="rawTxData" :rules="rules" label-width="100px" label-position="top">
        <el-form-item :label="$t('label').to" prop="to">
          <el-input v-model="rawTxData.to" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').value" prop="value">
          <el-input type="number" v-model="rawTxData.value" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('rawTxData', 'AGREE')">{{$t('btn').agree}}</el-button>
          <el-button @click="submitForm('rawTxData', 'DISAGREE')">{{$t('btn').refuse}}</el-button>
          <el-button @click="toUrl('/tNewsList')">{{$t('btn').back}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
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
          { required: true, message: this.$t('warn').w_14, trigger: 'blur' }
        ],
        value: [
          { required: true, message: this.$t('warn').w_15, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    GroupFindTxns (res) {
      console.log(res)
    }
  },
  mounted () {
    this.initTxnsData = this.$route.query
    this.rawTxData = {
      to: this.initTxnsData.DcrmTo,
      value: this.initTxnsData.Value 
    }
    console.log(this.initTxnsData)
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
    },
    getSignData (data) {
      // this.createGroup()
      console.log(data)
      console.log(data.signTx)
      if (data && data.signTx) {
        let cbData = this.$$.sendTxnsValid(data.signTx)
        if (cbData.msg === 'Success') {
          this.msgSuccess('Success!')
        } else {
          this.msgError('Error')
        }
      }
      this.eDialog.pwd = false
    },
    openPwdDialog (type) {
      try {
        let nonce = this.$$.getNonce(this.address, this.initTxnsData.Cointype, this.initTxnsData.DcrmFrom)
        if (!isNaN(nonce)) {
          this.dataPage = {
            from: this.address,
            to: this.$$.config.rawTx.to,
            gasLimit: this.$$.config.rawTx.gasLimit,
            gasPrice: this.$$.config.rawTx.gasPrice,
            nonce: nonce,
            data: 'ACCEPTLOCKOUT:' 
                  + this.initTxnsData.Address
                  // + this.initTxnsData.DcrmFrom
                  + ':'
                  + this.initTxnsData.GroupId 
                  + ':' 
                  + this.initTxnsData.Nonce 
                  + ':' 
                  + this.initTxnsData.DcrmFrom 
                  + ':' 
                  + this.initTxnsData.DcrmTo 
                  + ':' 
                  + this.initTxnsData.Value 
                  + ':' 
                  + this.initTxnsData.Cointype 
                  + ':' 
                  + this.initTxnsData.LimitNum
                  + ':' 
                  + type
          }
          this.eDialog.pwd = true
        } else {
          this.msgError(nonce)
        }
      } catch (error) {
        this.msgError(error.toString())
      }
    },
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.createGroup()
          this.openPwdDialog(type)
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