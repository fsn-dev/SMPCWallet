<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="gForm" ref="gForm" label-width="100px" label-position="top">
        <!-- <el-form-item label="账户名" prop="name">
          <el-input v-model="gForm.name" disabled="disabled"></el-input>
        </el-form-item> -->
        <el-form-item label="账户名" prop="name">
          <el-input v-model="gForm.gID" disabled="disabled" :title="gForm.gID"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').mode">
          <el-select v-model="gForm.mode" placeholder="" class="WW100" disabled="disabled">
            <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(eNode, index) in gForm.eNode" :label="$t('label').admins + index" :key="eNode.key">
          <div class="flex-bc">
            <el-input v-model="eNode.value" disabled="disabled" :title="eNode.value"></el-input>
            <!-- <el-button @click.prevent="removeDomain(eNode)" class="ml-10" v-if="Number(index) !== 0">删除</el-button> -->
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openPwdDialog('AGREE')" v-if="isApplySataus">{{$t('btn').agree}}</el-button>
          <el-button type="danger" @click="openPwdDialog('DISAGREE')" v-if="isApplySataus">{{$t('btn').refuse}}</el-button>
          <el-button @click="toUrl('/gNewsList')">{{$t('btn').back}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="300" :before-close="modalClick">
      <div>
        <ul>
          <li></li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="confirmGroup">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

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
        confirm: false,
        pwd: false
      },
      gForm: {},
      modeArr: this.$$.mode,
      gID: this.$$.eNode,
      isApplySataus: false,
      applyType: '',
      urlParams: this.$route.query,
      dataPage: {},
      applyStatus: ''
    }
  },
  sockets: {
    GroupAccountsEdit (res) {
      console.log(res)
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    // this.initGroupData = this.$route.query
    // console.log(this.initGroupData)
    console.log(this.address)
    this.showGroupData()
  },
  methods: {
    modalClick () {
      this.eDialog.confirm = false
      this.applyType = ''
      this.eDialog.pwd = false
    },
    getSignData (data) {
      console.log(data)
      console.log(data.signTx)
      if (data && data.signTx) {
        // let cbData = this.$$.web3.dcrm.acceptReqAddr(data.signTx)
        // console.log(cbData)
        this.$$.web3.dcrm.acceptReqAddr(data.signTx).then(res => {
          let cbData = res
          if (cbData.Status === 'Success') {
            this.msgSuccess('Success!')
            this.$socket.emit('GroupAccountsEdit', {
              key: this.urlParams.Key,
              kId: this.address,
              status: this.applyStatus === 'AGREE' ? 5 : 4
            })
            this.toUrl('/waitNews')
          } else {
            this.msgError('Error')
          }
          this.applyStatus = ''
        })
      }
      this.eDialog.pwd = false
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
              to: this.$$.config.rawTx.to,
              gasLimit: this.$$.config.rawTx.gasLimit,
              gasPrice: this.$$.config.rawTx.gasPrice,
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
    async showGroupData () {
      let arr = []
      for (let obj of this.urlParams.Enodes) {
        arr.push({
          value: obj
        })
      }
      console.log(this.urlParams)
      this.gForm = {
        name: this.urlParams.Gname,
        mode: this.urlParams.LimitNum,
        eNode: arr,
        gID: this.urlParams.GroupId,
      }
      // console.log(urlParams)
      // let status = this.$$.getGroupStatus()
      this.$$.reqAccountStatus(this.urlParams.Key).then(res => {
        console.log(res)
        // if (res.msg === 'Success' && res.info === 'Pending' && this.urlParams.Account.toLowerCase() !== this.address.toLowerCase()) {
        if (res.msg === 'Success' && res.info === 'Pending') {
          this.isApplySataus = true
        } else {
          this.isApplySataus = false
        }
      }).catch(err => {
        this.msgError(err.error.toString())
      })
    },
    applyGroup (type) {
      this.applyType = type
      this.eDialog.confirm = true
    },
    confirmGroup () {
      this.$$.web3.dcrm.acceptReqAddr()
      // this.$$.validGroup(this.gForm.name, this.gID, this.applyType).then(res => {
      //   console.log(res)
      //   if (res.msg === 'Success' && !res.info.Error) {
      //     this.msgSuccess(this.$t('warn').w_11)
      //     this.toUrl('/group')
      //   } else {
      //     this.msgError(res.info.Error.toString())
      //   }
      // }).catch(err => {
      //   this.msgError(err.error.toString())
      // })
    }
  }
}
</script>
