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
                <span slot="label" :class="eNode.status === 5 || eNode.status === 0 ? 'color_green' : 'color_red'">{{$$.changeState(eNode.status)}}</span>
              </div>
              <!-- <span class="font12 color_99 ml-10">（{{eNode.kId}}）</span> -->
            </div>
            <el-input v-model="eNode.eNode" disabled="disabled" :title="eNode.eNode"></el-input>
            <!-- <el-button @click.prevent="removeDomain(eNode)" class="ml-10" v-if="Number(index) !== 0">删除</el-button> -->
          </div>
        </el-form-item>
        <el-form-item>
          <div class="flex-bc WW100">
            <div>{{$t('label').approvalTime}}：<span :class="countDown > 60 ? 'color_green' : 'color_red'">{{countDown ? (countDown + ' s') : $t('state').end}}</span></div>
            <div>
              <el-button type="primary" @click="openPwdDialog('AGREE')" v-if="countDown && isApplySataus && isReplySet">{{$t('btn').agree}}</el-button>
              <el-button type="danger" @click="openPwdDialog('DISAGREE')" v-if="countDown && isApplySataus && isReplySet">{{$t('btn').refuse}}</el-button>
              <el-button type="success" @click="reviewApply" v-if="countDown && isApplySataus && !isReplySet">{{$t('btn').review}}</el-button>
              <el-button @click="goBack">{{$t('btn').back}}</el-button>
            </div>
          </div>
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
import {uodateStatus} from '@/db/status'
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
      urlParams: this.$route.query,
      dataPage: {},
      keyId: '',
      applyStatus: '',
      countDown: 0
    }
  },
  sockets: {
    GroupAccountsEdit (res) {
      console.log(res)
    },
    GroupAccountsFind (res) {
      console.log(res)
      let arr = []
      if (res.msg === 'Success' && res.info.length > 0) {
        let aObj = {}
        aObj = res.info[0]
        console.log(aObj)
        this.keyId = aObj.keyId
        for (let obj of aObj.member) {
          if (obj.kId === this.address && obj.status === 0) {
            this.isReplySet = true
          }
          arr.push(obj)
        }
        // console.log(this.isReplySet)
        this.gForm = {
          name: aObj.key,
          mode: aObj.mode,
          eNode: arr,
          gID: aObj.key,
          timestamp: aObj.timestamp
        }
        this.countDownFn()
      } else {
        for (let obj of this.urlParams.Enodes) {
          arr.push({
            eNode: obj,
          })
        }
        this.gForm = {
          name: this.urlParams.Gname,
          mode: this.urlParams.LimitNum,
          eNode: arr,
          gID: this.urlParams.Key,
        }
      }
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    if (this.$route.query.key) {
      this.$socket.emit('GroupAccountsFind', {
        keyId: this.$route.query.key,
      })
    } else {
      this.showGroupData()
    }
  },
  methods: {
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
      let countInterval = setInterval(() => {
        if (Date.now() - this.gForm.timestamp > timeout) {
          this.countDown = 0
          clearInterval(countInterval)
        } else {
          this.countDown = parseInt((timeout - (Date.now() - this.gForm.timestamp)) / 1000)
        }
      }, 500)
    },
    async showGroupData () {
      this.$socket.emit('GroupAccountsFind', {
        key: this.urlParams.Key,
      })
      this.$$.reqAccountStatus(this.urlParams.Key).then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.info === 'Pending') {
          this.isApplySataus = true
        } else {
          this.isApplySataus = false
        }
      }).catch(err => {
        this.msgError(err.error.toString())
      })
    },
    getSignData (data) {
      if (data && data.signTx) {
        this.$$.web3.dcrm.acceptReqAddr(data.signTx).then(res => {
          let cbData = res
          if (cbData.Status === 'Success') {
            this.msgSuccess('Success!')
            if (this.keyId) {
              this.$socket.emit('GroupAccountsEdit', {
                keyId: this.keyId,
                kId: this.address,
                status: this.applyStatus === 'AGREE' ? 5 : 4
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
  }
}
</script>
