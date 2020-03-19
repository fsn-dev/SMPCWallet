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
        <el-form-item v-for="(eNode, index) in gForm.eNode" :key="index">

          <div class="flex-bc flex-wrap">
            <div class="flex-bc WW100">
              <div class="flex-sc">
                {{eNode.initiate ? ($t('label').initiator + '：') : ($t('label').approver + '：')}}
                <span slot="label" :class="eNode.status === 5 || eNode.status === 0 ? 'color_green' : 'color_red'">{{$$.changeState(eNode.status)}}</span>
              </div>
              <!-- <span class="font12 color_99 ml-10">（{{eNode.kId}}）</span> -->
            </div>
            <el-input v-model="eNode.eNode" disabled="disabled" :title="eNode.eNode"></el-input>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="WW100 fixed-action-bg flex-c" v-if="refreshAction">
      <div class="flex-bc fixed-action-box">
        <div class="font14">{{$t('label').approvalTime}}：<span :class="countDown > 60 ? 'color_green' : 'color_red'">{{countDown ? (countDown + ' s') : $t('state').end}}</span></div>
        <div>
          <el-button type="primary" @click="submitForm('rawTxData', 'AGREE')" v-if="countDown && isApplySataus && isReplySet">{{$t('btn').agree}}</el-button>
          <el-button type="danger" @click="submitForm('rawTxData', 'DISAGREE')" v-if="countDown && isApplySataus && isReplySet">{{$t('btn').refuse}}</el-button>
          <el-button type="success" @click="reviewApply" v-if="countDown && isApplySataus && !isReplySet">{{$t('btn').review}}</el-button>
          <el-button @click="toUrl('/tNewsList')">{{$t('btn').back}}</el-button>
        </div>
      </div>
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
import {uodateStatus} from '@/db/status'
import {EditGroupMemberTxnsFn} from '@/api/index.js'
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
      isReplySet: true,
      applyStatus: '',
      key: '',
      gForm: {},
      countDown: 0,
      refreshAction: false,
      countInterval: ''
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.urlParams = this.$route.query
    this.key = this.urlParams.Key
    this.showGroupData()
    console.log(this.urlParams)
  },
  methods: {
    refreshActionFn () {
      setTimeout(() => {
        this.refreshAction = false
        this.$nextTick(() => {
          this.refreshAction = true
        })
      }, 200)
    },
    modalClick () {
      this.eDialog.pwd = false
    },
    reviewApply () {
      this.isReplySet = true
    },
    countDownFn () {
      let timeout = this.$$.config.timeout
      this.countInterval = setInterval(() => {
        if (Date.now() - this.gForm.timestamp > timeout) {
          this.countDown = 0
          clearInterval(this.countInterval)
        } else {
          this.countDown = parseInt((timeout - (Date.now() - this.gForm.timestamp)) / 1000)
        }
      }, 500)
    },
    async showGroupData () {
      this.rawTxData = {
        to: this.urlParams.DcrmTo,
        value: this.$$.fromWei(this.urlParams.Value, this.$$.cutERC20(this.urlParams.Cointype).coinType) 
      }
      this.$$.getLockOutStatus(this.urlParams.Key).then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.status === 'Pending') {
          this.isApplySataus = true
        } else {
          this.isApplySataus = false
        }
        let arr = [], initiator = {}
        for (let obj of res.info) {
          if (obj.initiate && Number(obj.initiate)) {
            initiator = {
              eNode: obj.Enode,
              status: 'Agree',
              initiate: 1,
              timestamp: obj.TimeStamp
            }
          } else {
            arr.push({
              eNode: obj.Enode,
              status: obj.Status,
              initiate: 0,
              timestamp: obj.TimeStamp
            })
          }
          if (this.eNode.indexOf(obj.Enode) !== -1 && obj.Status === 'Pending') {
            this.isReplySet = true
          }
        }
        if  (initiator.eNode) {
          arr.unshift(initiator)
        }
        this.gForm = {
          name: this.urlParams.Key,
          mode: this.urlParams.LimitNum,
          eNode: arr,
          gID: this.urlParams.GroupId,
          timestamp: Number(this.urlParams.TimeStamp)
        }
        this.countDownFn()
        this.refreshActionFn()
      }).catch(err => {
        this.refreshActionFn()
        this.msgError(err.error.toString())
      })
    },
    splitTx (enode) {
      if (!enode) return
      let eNodeKey = enode.match(/enode:\/\/(\S*)@/)
      return {
        eNode: enode,
        eNodeId: eNodeKey[1]
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
    openPwdDialog (type) {
      this.applyStatus = type
      try {
        this.$$.getLockOutNonce(this.address, this.urlParams.Cointype, this.urlParams.DcrmFrom).then(nonce => {
          if (!isNaN(nonce)) {
            this.dataPage = {
              from: this.address,
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
                    + ':'
                    + Date.now()
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
            EditGroupMemberTxnsFn(this, 'changeGroupMemberTxnsStatus', {
              key: this.key,
              kId: this.address,
              eNode: this.eNode,
              status: this.applyStatus === 'AGREE' ? 5 : 4
            })
            this.updateStatus(this.urlParams.Key)
            this.msgSuccess('Success!')
            this.toUrl('/waitNews')
          } else {
            this.msgError('Error')
          }
          this.applyStatus = ''
        })
      }
      this.eDialog.pwd = false
    },
    updateStatus (key) {
      uodateStatus({
        key: key,
        type: 1,
        status: 1
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    resetForm(formName) {
      this.rawTxData = {
        to: '',
        value: ''
      }
    },
  },
  beforeDestroy () {
    clearInterval(this.countInterval)
  }
}
</script>