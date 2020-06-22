<template>
  <div class="boxConntent1 container" v-loading="loading.init" :element-loading-text="$t('loading').l_1">
    <div class="c-form-box">
      <el-form label-width="100px" label-position="top">
        <el-form-item>
          <span slot="label">{{$t('title').groupAccount}}</span>
          <el-select v-model="selectIndex" class="WW100" @change="changeAccount">
            <el-option v-for="(item, index) in groupAccount" :key="index" :value="index" :label="item.name">
              {{item.name.length > 16 ? item.name.substr(0,6) : item.name}}
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
    <signsHistory v-if="history.isRefresh" :query="history.query" :isView="{coinType: true, to: true, value: true}"></signsHistory>
    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick" :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
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
        pwd: false
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
      }
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
    // console.log(this.$$.web3.eth.accounts.recoverTransaction("0xd608be1aba865b699e0fc19c12172d8bd2c2f022a5f7b3a47fdfd613d2c330530283af5509355a2a19bd331a8018bf4cb2b6d9b645b4a911aa1e1f9fd0ab76b201"))
  },
  methods: {
    ...getAllAccountList,
    modalClick () {
      this.eDialog.pwd = false
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
      const baseUrl = this.$$.config.env === 'dev' ? 'https://testnet.fsn.dev/api' : 'https://fsn.dev/api'
      let web3 = new Web3(new Web3.providers.HttpProvider(baseUrl))
      return web3
    },
    getGroupData () {
      this.$$.getGroupObj(this.groupAccount[this.selectIndex].gID).then(res => {
        console.log(res)
        if (res.msg === 'Success') {
          this.gMember = res.info
          this.createHash()
        } else {
          this.msgError(res.error)
        }
      })
    },
    createHash () {
      this.$$.readFile(this.$$.config.file.btc).then(res => {
        // console.log(res)
        this.getTxnsBaseData(res)
      })
    },
    getTxnsBaseData (fileData) {
      let chainId = this.$$.config.env === 'dev' ? '46688' : '32659'
      chainId = this.$$.web3.utils.toHex(chainId)
      let data = {
        chainId: chainId,
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
          data.gas = this.$$.web3.utils.toHex(res * 6)
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
        // console.log(data)
        // console.log(hash)
        // return
        this.rawTx.hash = hash
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
          MsgContext: [JSON.stringify({
            chainId: this.rawTx.chainId,
            gas: this.rawTx.gas,
            gasPrice: this.rawTx.gasPrice,
            nonce: this.rawTx.nonce,
            from: this.rawTx.from,
            to: this.rawTx.to
          })]
        }
        this.dataPage.data = JSON.stringify(dataObj)
        console.log(this.dataPage)
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
        extendObj: {
          type: 'CreatContract',
          nonce: this.rawTx.nonce,
          gas: this.rawTx.gas,
          gasPrice: this.rawTx.gasPrice,
          network: this.$$.config.env,
          chainId: this.rawTx.chainId,
          hash: ''
        },
        accountType: '0'
      }
      // if (Number(this.accountType) === 1) {
      if (false) {
        data.kId = this.address
        data.eNode = this.eNode
      } else {
        data.gArr = [
          {eNode: this.eNode, nodeKey: this.$$.eNodeCut(this.eNode).key, kId: this.address, status: 5, timestamp: Date.now(), initiate: 1}
        ]
        for (let obj of this.gMember) {
          if (obj === this.eNode) continue
          data.gArr.push({eNode: obj, nodeKey: this.$$.eNodeCut(obj).key, kId: '', status: 0, timestamp: '', initiate: 0})
        }
      }
      console.log(data)
      // if (Number(this.accountType) === 1) {
      if (this.networkMode) {
        this.$socket.emit('SignsAdd', data)
      } else {
        this.$db.AddGroupTxns(data)
      }
      setTimeout(() => {
        this.changeAccount()
      }, 2000)
    },
  }
}
</script>