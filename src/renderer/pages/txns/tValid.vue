<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="rawTxData" ref="rawTxData" label-width="100px" label-position="top">
        <el-form-item :label="$t('label').group">
          <el-input v-model="urlParams.GroupId" disabled="disabled" :title="urlParams.GroupId"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').from + ' (' + $$.cutERC20(urlParams.Cointype).coinType + ')'">
          <el-input v-model="urlParams.DcrmFrom" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').to">
          <el-input v-model="rawTxData.to" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').mode">
          <el-select v-model="urlParams.LimitNum" :placeholder="$t('warn').w_4" class="WW100" disabled="disabled">
            <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name + ' ' + $t('label').mode" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('label').value">
          <el-input type="number" v-model="rawTxData.value" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item class="flex-ec">
          <el-button type="primary" @click="submitForm('rawTxData', 'AGREE')" v-if="isApplySataus">{{$t('btn').agree}}</el-button>
          <el-button @click="submitForm('rawTxData', 'DISAGREE')" v-if="isApplySataus">{{$t('btn').refuse}}</el-button>
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
      modeArr: this.$$.mode,
      urlParams: {},
      isApplySataus: false,
      applyStatus: ''
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    GroupFindTxns (res) {
      console.log(res)
    },
    changeGroupMemberTxnsStatus (res) {
      console.log(res)
    },
  },
  mounted () {
    this.urlParams = this.$route.query
    // this.rawTxData = {
    //   to: this.urlParams.DcrmTo,
    //   value: this.urlParams.Value 
    // }
    this.showGroupData()
    console.log(this.urlParams)
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
    },
    async showGroupData () {
      this.rawTxData = {
        to: this.urlParams.DcrmTo,
        value: this.$$.fromWei(this.urlParams.Value, this.$$.cutERC20(this.urlParams.Cointype).coinType) 
      }
      this.$$.getLockOutStatus(this.urlParams.Key).then(res => {
        console.log(res)
        let gData = res.info.AllReply ? res.info.AllReply : ''
        gData = gData ? JSON.parse(gData) : ''
        console.log(gData)
        if (res.msg === 'Success' && res.status === 'Pending') {
          this.isApplySataus = true
        } else {
          this.isApplySataus = false
        }
      }).catch(err => {
        this.msgError(err.error.toString())
      })
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
    openPwdDialog (type) {
      this.applyStatus = type
      try {
        this.$$.getLockOutNonce(this.address, this.urlParams.Cointype, this.urlParams.DcrmFrom).then(nonce => {
          if (!isNaN(nonce)) {
            this.dataPage = {
              from: this.address,
              to: this.$$.config.rawTx.to,
              gasLimit: this.$$.config.rawTx.gasLimit,
              gasPrice: this.$$.config.rawTx.gasPrice,
              nonce: nonce,
              data: 'ACCEPTLOCKOUT:' 
                    + this.urlParams.Account
                    + ':'
                    + this.urlParams.GroupId 
                    + ':' 
                    + this.urlParams.Nonce 
                    + ':' 
                    + this.urlParams.DcrmFrom 
                    + ':' 
                    + this.urlParams.DcrmTo 
                    + ':' 
                    + this.urlParams.Value 
                    + ':' 
                    + this.urlParams.Cointype 
                    + ':' 
                    + this.urlParams.LimitNum
                    + ':' 
                    + '0'
                    + ':'
                    + type
            }
            this.eDialog.pwd = true
          } else {
            this.msgError(nonce)
          }
        })
      } catch (error) {
        this.msgError(error.toString())
      }
    },
    getSignData (data) {
      console.log(data)
      console.log(data.signTx)
      if (data && data.signTx) {
        // let cbData = this.$$.sendTxnsValid(data.signTx)
        this.$$.sendTxnsValid(data.signTx).then(res => {
          let cbData = res
          console.log(res)
          if (cbData.msg === 'Success') {
            this.$socket.emit('changeGroupMemberTxnsStatus', {
              key: this.urlParams.Key,
              kId: this.address,
              eNode: this.eNode,
              status: this.applyStatus === 'AGREE' ? 5 : 4
            })
            this.msgSuccess('Success!')
          } else {
            this.msgError('Error')
          }
          this.applyStatus = ''
        })
      }
      this.eDialog.pwd = false
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