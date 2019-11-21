<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="rawTxData" ref="rawTxData" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="目标地址" prop="to">
          <el-input v-model="rawTxData.to" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="value">
          <el-input type="number" v-model="rawTxData.value" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('rawTxData')">同意</el-button>
          <el-button @click="resetForm('rawTxData')">拒绝</el-button>
          <el-button @click="toUrl('/tNewsList')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('BTN').UNLOCK" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
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
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
    },
    getSignData (data) {
      this.createGroup()
      this.eDialog.pwd = false
    },
    openPwdDialog () {
      try {
        let nonce = this.$$.getNonce(this.address, 'ALL')
        if (!isNaN(nonce)) {
          this.dataPage = {
            from: this.address,
            to: this.$$.config.rawTx.to,
            gasLimit: this.$$.config.rawTx.gasLimit,
            gasPrice: this.$$.config.rawTx.gasPrice,
            nonce: nonce,
            data: 'ACCEPTDCRM:' 
                  + this.initTxnsData.gID 
                  + ':' 
                  + this.initTxnsData.nonce 
                  + ':' 
                  + this.initTxnsData.address 
                  + ':' 
                  + this.initTxnsData.to 
                  + ':' 
                  + this.initTxnsData.value 
                  + ':' 
                  + this.initTxnsData.coinType 
                  + ':' 
                  + this.initTxnsData.mode
          }
          this.eDialog.pwd = true
          // this.dataPage = this.$$.config.rawTx
          // this.dataPage.from = this.$$.getCookies(this.$$.config.cookies.address)
          console.log(this.dataPage)
        } else {
          this.$message.error(nonce)
        }
      } catch (error) {
        this.$message.error(error.toString())
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
    createGroup () {
      let eNode = this.$$.web3.dcrm.getEnode()
      // let arr = [this.$$.getEnode()]
      let arr = []
      for (let obj of this.rawTxData.eNode) {
        arr.push(obj.value)
      }
      try {
        let gInfo = this.$$.createGroup(this.rawTxData.name, this.rawTxData.mode, arr)
        if (gInfo && !gInfo.Error) {
          this.$message({ message: 'Create group success!', type: 'success' })
          this.toUrl('/group')
        } else {
          this.$message.error(gInfo.Error)
        }
      } catch (error) {
        console.log(error)
      }
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