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
                <span :class="eNode.status === 'Agree' || eNode.status === 'Pending' ? 'color_green' : 'color_red'">{{eNode.status}}</span>
                <span class="font12 color_99 flex-sc ml-10">(IP: {{eNode.ip}})</span>
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
    // this.showGroupData()
    this.init()
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
    init () {
      this.$$.getGroupObj(this.urlParams.GroupId).then(res => {
        // console.log(res)
        if (res.msg === 'Success') {
          let enodeObj = {}
          for (let obj of res.info) {
            let obj1 = this.$$.eNodeCut(obj)
            enodeObj[obj1.key] = obj1
          }
          this.gForm.enodeObj = enodeObj
        }
        this.showGroupData()
      }).catch(err => {
        console.log(err)
      })
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
          let obj1 = this.gForm.enodeObj[obj.Enode]
          if (obj.Initiator && Number(obj.Initiator)) {
            initiator = {
              key: obj1.key,
              eNode: obj1.enode,
              ip: obj1.ip,
              status: 'Agree',
              initiate: 1,
              timestamp: obj.TimeStamp
            }
          } else {
            arr.push({
              key: obj1.key,
              eNode: obj1.enode,
              ip: obj1.ip,
              status: obj.Status,
              initiate: 0,
              timestamp: obj.TimeStamp
            })
          }
        }
        if (this.urlParams.status) {
          this.isReplySet = false
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
            let localData = {}
            let params = {
              key: this.key,
              kId: this.address,
              eNode: this.eNode,
              status: this.applyStatus === 'AGREE' ? 5 : 4,
              local: localData
            }
            if (!this.networkMode) {
              localData = {
                from: this.urlParams.DcrmFrom ,
                to: this.urlParams.DcrmTo,
                value: this.urlParams.Value,
                nonce: this.urlParams.Nonce,
                coinType: this.urlParams.Cointype,
                hash: '',
                status: 0,
                pubKey: '',
                key: this.urlParams.Key,
                gId: this.urlParams.GroupId,
                gArr: [
                  {eNode: this.eNode, nodeKey: this.$$.eNodeCut(this.eNode).key, kId: this.address, status: 0, timestamp: Date.now(), initiate: 0}
                ],
                kId: this.address,
                nodeKey: this.$$.eNodeCut(this.eNode).key,
                mode: this.urlParams.LimitNum
              }
              for (let obj of this.gForm.eNode) {
                // console.log(obj)
                if (obj === this.eNode) continue
                localData.gArr.push({
                  eNode: obj.eNode,
                  nodeKey: obj.key,
                  kId: '',
                  status: 0,
                  timestamp: '',
                  initiate: 0
                })
              }
              params.local = localData
              this.$db.EditGroupMemberTxns(params)
            } else {
              this.$socket.emit('changeGroupMemberTxnsStatus', params)
            }
            // EditGroupMemberTxnsFn(this, 'changeGroupMemberTxnsStatus', {
            //   key: this.key,
            //   kId: this.address,
            //   eNode: this.eNode,
            //   status: this.applyStatus === 'AGREE' ? 5 : 4,
            //   local: localData
            // })
            this.updateStatus(this.urlParams.Key)
            this.msgSuccess('Success!')
            this.toUrl('/approvalList')
          } else {
            this.msgError('Error')
          }
          this.applyStatus = ''
        })
      }
      this.eDialog.pwd = false
    },
    updateStatus (key) {
      this.$db.updateStatus({
        key: key,
        address: this.address,
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