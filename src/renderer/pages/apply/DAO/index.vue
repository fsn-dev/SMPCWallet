<template>
  <div class="boxConntent1 container" v-loading.fullscreen.lock="loading.init" :element-loading-text="$t('loading').l_1">
    <div class="c-form-box">
      <el-form label-width="100px" label-position="top">
        <el-form-item>
          <span slot="label">{{$t('title').groupAccount}}</span>
          <el-select v-model="selectIndex" class="WW100" @change="changeAccount">
            <el-option v-for="(item, index) in groupAccount" :key="index" :value="index" :label="item.name">
              {{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <span slot="label">{{$t('title').groupAccount}}</span>
        </el-form-item> -->
        <el-form-item>
          <el-button 
            @click="getGroupData"
            class="btn mt-30 W160 HH40 font16 btn-primary"
          >{{$t('btn').create}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <signsHistory v-if="history.isRefresh" :query="history.query" :isView="{coinType: true, to: true, value: true}" @onClickRSV="sendTxns"></signsHistory>
    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick" :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>

    <el-dialog :title="$t('label').signTxn" :visible.sync="eDialog.signTxn" width="960px" :before-close="modalClick" :close-on-click-modal="false" :modal-append-to-body='false'>
      <div class="flex-bc">
        <p class="mr-10">{{signTx}}</p>
        <div id="signTxnsId"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="copyTxt(signTx)">{{$t('btn').copy}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">

</style>

<script>
const Web3 = require('web3')
import {computedPub} from '@/assets/js/pages/public.js'
import getAllAccountList from '@/assets/js/pages/accounts/getAllAccountList.js'
import signsHistory from '@/components/history/signs.vue'
export default {
  name: 'DAO',
  data () {
    return {
      loading: {
        init: true
      },
      eDialog: {
        pwd: false,
        signTxn: false
      },
      selectIndex: '',
      groupAccount: [],
      dataPage: {},
      rawTx: {},
      web3Fn: '',
      coinInfoObj: {},
      gMember: {},
      history: {
        isRefresh: false,
        query: {}
      },
      extendObj: {},
      chainInfo: {
        chainId: this.$$.config.env === 'dev' ? 46688 : 32659,
        url: this.$$.config.env === 'dev' ? 'https://testnet.fsn.dev/api' : 'https://fsn.dev/api'
      },
      signTx: ''
    }
  },
  computed: {
    ...computedPub,
    selectPubKey () {
      return this.$store.state.selectPubKey
    }
  },
  components: {signsHistory},
  mounted () {
    this.init()

    // console.log(this.$$.web3)
    // this.$$.getSignStatus("0x75ddbccdec9a71a87cd72d1b2bf8600de76e040d492dc3a9315085f8a7fd286d").then(res => {
    //   console.log(res)
    // })
    // console.log(this.$$.web3.eth.accounts.recoverTransaction(""))
  },
  methods: {
    ...getAllAccountList,
    modalClick () {
      this.eDialog.pwd = false
      this.eDialog.signTxn = false
    },
    sendTxns (item) {
      console.log(item)
      this.loading.init = true
      this.createHash().then(res  => {
        let rawTx = {
          from: item.extendObj.from,
          to: item.extendObj.to,
          value: item.extendObj.value,
          gas: item.extendObj.gas,
          gasPrice: item.extendObj.gasPrice,
          nonce: item.extendObj.nonce,
          data: res,
          r: '0x' + item.rsv[0].substr(0, 64),
          s: '0x' + item.rsv[0].substr(64, 64),
          v: this.$$.web3.utils.toHex(parseInt(item.extendObj.chainId) * 2 + 35),
          chainId: item.extendObj.chainId,
        }
        this.signTx = this.$$.toSignRsv(rawTx)
        // console.log(rawTx)
        console.log(this.signTx)
        if (this.networkMode) {
          this.web3Fn.eth.sendSignedTransaction(this.signTx, (err, hash) => {
            if (err) {
              this.msgError(err.toString())
              this.loading.init = false
            } else {
              console.log(hash)
              this.setDBState(item._id, hash)
              this.loading.init = false
              this.msgSuccess(this.$t('success').s_1 + 'Hash:' + hash)
            }
          })
        } else {
          this.eDialog.signTxn = true
        }
      })
    },
    setDBState (id, hash) {
      let data = {
        id: id,
        extendObj: {
          hash: hash
        }
      }
      // console.log(data)
      if (this.networkMode) {
        this.$socket.emit('changeSignsStatus', data)
      } else {
        this.$db.EditSigns(data)
      }
    },
    init () {
      this.initGetAccount()
      this.web3Fn = this.newWeb3()
    },
    initGetAccount () {
      this.getAllAccount().then(res => {
        this.groupAccount = []
        for (let obj of res) {
          if (obj.accountType === 0) {
            this.groupAccount.push(obj)
          }
        }
        for (let i = 0, len = this.groupAccount.length; i < len; i++) {
          if (this.groupAccount[i].publicKey === this.selectPubKey) {
            this.selectIndex = i
            break
          }
        }
        this.selectIndex = this.selectIndex === '' && this.groupAccount.length > 0 ? 0 : this.selectIndex
        if (this.groupAccount.length > 0) {
          this.changeAccount()
        }
        this.loading.init = false
      })
    },
    changeAccount () {
      this.history.query = {
        pubKey: this.groupAccount[this.selectIndex].publicKey,
        extendObj: {
          type: 'CreatContract'
        }
      }
      this.history.isRefresh = false
      this.$nextTick(() => {
        this.history.isRefresh = true
      })
    },
    newWeb3 () {
      const baseUrl = this.chainInfo.url
      let web3 = new Web3(new Web3.providers.HttpProvider(baseUrl))
      return web3
    },
    getGroupData () {
      this.loading.init = true
      this.$$.getGroupObj(this.groupAccount[this.selectIndex].gID).then(res => {
        console.log(res)
        if (res.msg === 'Success') {
          this.gMember = res.info
          this.createHash().then(res  => {
            this.getTxnsBaseData(res)
          })
        } else {
          this.msgError(res.error)
        }
      })
    },
    createHash () {
      return new Promise(resolve => {
        this.$$.readFile(this.$$.config.file.btc).then(res => {
          // console.log(res)
          resolve(res)
        })
      })
    },
    getTxnsBaseData (fileData) {
      let data = {
        chainId: this.$$.web3.utils.toHex(this.chainInfo.chainId),
        gas: '',
        gasPrice: '',
        nonce: '',
        to: '',
        value: '0',
        data: fileData
      }
      let count = 0, time = Date.now()
      for (let obj of this.groupAccount[this.selectIndex].coinArr) {
        if (obj.coinType === 'FSN') {
          data.from = obj.address
          break
        }
      }
      console.log(data)
      const batch = new this.web3Fn.BatchRequest()
      batch.add(this.web3Fn.eth.estimateGas.request({to: data.from}, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(1)
          data.gas = this.$$.web3.utils.toHex(res * 6 * 10)
          count ++
        }
      }))
      batch.add(this.web3Fn.eth.getTransactionCount.request(data.from, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(2)
          data.nonce = this.$$.web3.utils.toHex(res)
          count ++
        }
      }))
      batch.add(this.web3Fn.eth.getGasPrice.request((err, res) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(3)
          data.gasPrice = this.$$.web3.utils.toHex(res)
          count ++
        }
      }))
      batch.execute()
      // console.log(data)
      let getDataIntervel = setInterval(() => {
        if (count >= 3 && ( (Date.now() - time) <= 30000 )) {
          this.openPwdDialog(data)
          clearInterval(getDataIntervel)
        } else if (count < 3 && ( (Date.now() - time) > 30000 )) {
          this.msgError('Error')
          this.loading.init = false
          clearInterval(getDataIntervel)
        }
      }, 1000)
    },
    openPwdDialog (data) {
      this.rawTx = data
      this.$$.getSignNonce(this.address).then(nonce => {
        let hash = this.$$.toTxnHash(data)
        this.rawTx.hash = hash
        this.extendObj = {
          type: 'CreatContract',
          from: this.rawTx.from,
          to: this.rawTx.to,
          nonce: this.rawTx.nonce,
          gas: this.rawTx.gas,
          gasPrice: this.rawTx.gasPrice,
          chainId: this.rawTx.chainId,
          value: this.rawTx.value,
          network: this.$$.config.env,
          hash: ''
        }
        this.dataPage = {
          nonce: nonce,
          value: 0,
        }
        let dataObj = {
          TxType: "SIGN",
          PubKey: this.groupAccount[this.selectIndex].publicKey,
          MsgHash: [hash],
          Keytype: "ECDSA",
          GroupId: this.groupAccount[this.selectIndex].gID,
          ThresHold: this.groupAccount[this.selectIndex].mode,
          Mode: '0',
          TimeStamp: Date.now().toString(),
          MsgContext: [JSON.stringify(this.extendObj)]
        }
        this.dataPage.data = JSON.stringify(dataObj)
        console.log(this.dataPage)
        this.loading.init = false
        this.eDialog.pwd = true
      })
    },
    getSignData (data) {
      this.modalClick()
      // this.loading.account = true
      if (data.signTx) {
        this.$$.sign(data.signTx).then(res => {
          console.log(res)
          if (res.msg === 'Success') {
            this.msgSuccess('Success')
            this.saveTxnsDB(res.info)
          } else {
            this.msgError(res.error)
          }
        })
      } else {
        this.msgError('Error')
      }
    },
    saveTxnsDB (key) {
      // let value = this.$$.toWei(this.rawTx.value, this.rawTx.coinType)
      let value = this.rawTx.value
      let data = {
        from: this.rawTx.from,
        to: this.rawTx.to,
        hash: [this.rawTx.hash],
        value: value,
        nonce: this.dataPage.nonce,
        coinType: '',
        status: 0,
        pubKey: this.groupAccount[this.selectIndex].publicKey,
        key: key,
        mode: this.groupAccount[this.selectIndex].mode,
        gId: this.groupAccount[this.selectIndex].gID,
        data: '',
        extendObj: this.extendObj,
        accountType: '0'
      }
      
      data.gArr = [
        {eNode: this.eNode, nodeKey: this.$$.eNodeCut(this.eNode).key, kId: this.address, status: 5, timestamp: Date.now(), initiate: 1}
      ]
      for (let obj of this.gMember) {
        if (obj === this.eNode) continue
        data.gArr.push({eNode: obj, nodeKey: this.$$.eNodeCut(obj).key, kId: '', status: 0, timestamp: '', initiate: 0})
      }
      console.log(data)
      // if (Number(this.accountType) === 1) {
      if (this.networkMode) {
        this.$socket.emit('SignsAdd', data)
      } else {
        this.$db.AddSigns(data)
      }
      setTimeout(() => {
        this.changeAccount()
      }, 2000)
    },
  }
}
</script>