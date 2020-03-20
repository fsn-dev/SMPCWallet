<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="gForm" ref="gForm" label-width="100px" label-position="top">
        <!-- <el-form-item label="账户名" prop="name">
          <el-input v-model="gForm.name" disabled="disabled"></el-input>
        </el-form-item> -->
        <el-form-item label="ID" prop="name">
          <el-input v-model="gForm.gID" disabled="disabled" :title="gForm.gID"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').mode">
          <el-select v-model="gForm.mode" placeholder="" class="WW100" disabled="disabled">
            <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(eNode, index) in gForm.eNode" :key="index">

          <div class="flex-bc flex-wrap">
            <div class="flex-bc WW100">
              <div class="flex-sc">
                {{eNode.initiate ? ($t('label').initiator + '：') : ($t('label').approver + '：')}}
                <span slot="label" :class="eNode.status === 'Agree' || eNode.status === 'Pending' ? 'color_green' : 'color_red'">{{eNode.status}}</span>
              </div>
            </div>
            <el-input v-model="eNode.eNode" disabled="disabled" :title="eNode.eNode"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="H60"></div>
      <div class="WW100 fixed-action-bg flex-c" v-if="refreshAction">
        <div class="flex-bc fixed-action-box">
          <div class="font14">{{$t('label').approvalTime}}：<span :class="countDown > 60 ? 'color_green' : 'color_red'">{{countDown ? (countDown + ' s') : $t('state').end}}</span></div>
          <div>
            <el-button type="primary" @click="openPwdDialog('AGREE')" v-if="countDown && isApplySataus && isReplySet">{{$t('btn').agree}}</el-button>
            <el-button type="danger" @click="openPwdDialog('DISAGREE')" v-if="countDown && isApplySataus && isReplySet">{{$t('btn').refuse}}</el-button>
            <el-button type="success" @click="reviewApply" v-if="countDown && isApplySataus && !isReplySet">{{$t('btn').review}}</el-button>
            <el-button @click="goBack">{{$t('btn').back}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {uodateStatus} from '@/db/status'
import {EditGroupMemberAccountsFn} from '@/api/index.js'
export default {
  name: '',
  data () {
    return {
      eDialog: {
        confirm: false,
        pwd: false
      },
      gForm: {},
      modeArr: this.$$.mode,
      gID: this.$$.eNode,
      isApplySataus: false,
      isReplySet: false,
      applyType: '',
      urlParams: '',
      dataPage: {},
      key: '',
      applyStatus: '',
      countDown: 0,
      refreshAction: false,
      countInterval: ''
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    this.urlParams = this.$route.query
    console.log(this.urlParams)
    // this.key = aObj.key
    if (this.urlParams.Key) {
      this.key = this.urlParams.Key
      this.showGroupData()
    }
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
    goBack () {
      this.$router.back(-1)
    },
    modalClick () {
      this.eDialog.confirm = false
      this.applyType = ''
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
        // console.log(this.countDown)
      }, 500)
    },
    async showGroupData () {
      let enodeObj = {}
      for (let obj of this.urlParams.Enodes) {
        let obj1 = this.splitTx(obj)
        enodeObj[obj1.eNodeId] = obj
      }
      this.$$.reqAccountStatus(this.urlParams.Key).then(res => {
        // console.log(res)
        if (res.msg === 'Success' && res.status === 'Pending') {
          this.isApplySataus = true
        } else {
          this.isApplySataus = false
        }
        let arr = [], initiator = {}
        for (let obj of res.info) {
          if (obj.initiate && Number(obj.initiate)) {
            initiator = {
              eNode: enodeObj[obj.Enode],
              status: 'Agree',
              initiate: 1,
              timestamp: obj.TimeStamp
            }
          } else {
            arr.push({
              eNode: enodeObj[obj.Enode],
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
        console.log(err)
        this.refreshActionFn()
        this.msgError(err.toString())
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
    getSignData (data) {
      if (data && data.signTx) {
        this.$$.web3.dcrm.acceptReqAddr(data.signTx).then(res => {
          let cbData = res
          if (cbData.Status === 'Success') {
            this.msgSuccess('Success!')
            if (this.key) {
              let localData = {}
              if (!this.networkMode) {
                localData = {
                  key: this.urlParams.Key,
                  gId: this.urlParams.GroupId,
                  mode: this.urlParams.LimitNum,
                  nonce: Number(this.urlParams.Nonce),
                  member: [{
                    eNode: this.eNode,
                    kId: this.address,
                    status: 0,
                    initiate: 0,
                    timestamp: Date.now()
                  }],
                  timestamp: Number(this.urlParams.TimeStamp),
                }
                for (let obj of this.urlParams.Enodes) {
                  // console.log(obj)
                  if (obj === this.eNode) continue
                  localData.member.push({
                    eNode: obj,
                    kId: '',
                    status: 0,
                    initiate: 0,
                    timestamp: ''
                  })
                }
              }
              // console.log(localData)
              EditGroupMemberAccountsFn(this, 'GroupAccountsEdit', {
                key: this.key,
                kId: this.address,
                status: this.applyStatus === 'AGREE' ? 5 : 4,
                local: localData
              })
            }
            this.updateStatus(this.urlParams.Key)
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
    openPwdDialog (type) {
      console.log(type)
      this.applyStatus = type
      try {
        this.$$.getReqNonce(this.urlParams.Account).then(nonce => {
          console.log(nonce)
          if (!isNaN(nonce)) {
            this.dataPage = {
              from: this.address,
              nonce: nonce,
              data: 'ACCEPTREQADDR:' 
                    + this.urlParams.Account
                    + ':'
                    + this.urlParams.Cointype 
                    + ':' 
                    + this.urlParams.GroupId 
                    + ':' 
                    + this.urlParams.Nonce 
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
    applyGroup (type) {
      this.applyType = type
      this.eDialog.confirm = true
    },
  },
  beforeDestroy () {
    clearInterval(this.countInterval)
  }
}
</script>
