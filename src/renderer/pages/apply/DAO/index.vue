<template>
  <div class="boxConntent1 container" v-loading="loading.init" :element-loading-text="$t('loading').l_1">
    <div class="c-form-box">
      <el-form label-width="100px" label-position="top">
        <el-form-item>
          <span slot="label">{{$t('title').groupAccount}}</span>
          <el-select v-model="selectIndex" class="WW100">
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
            native-type="submit"
            @click="createHash"
            class="btn mt-30 W160 HH40 font16 btn-primary"
          >{{$t('btn').create}}</el-button>
        </el-form-item>
      </el-form>
    </div>

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
      web3Fn: '',
      coinInfoObj: {},
    }
  },
  computed: {
    ...computedPub,
    selectPubKey () {
      return this.$store.state.selectPubKey
    }
  },
  mounted () {
    this.init()

    // let test = await this.getGName({publicKey: item.publicKey, address: this.address})
    // // let test = this.getGName()
    // console.log(test)
    // this.test()
  },
  methods: {
    ...getAllAccountList,
    modalClick () {
      this.eDialog.pwd = false
    },
    init () {
      this.getAllAccount().then(res => {
        console.log(res)
      })
      // this.getAllAccountList().then(res => {
      //   console.log(res)
      //   this.getAllCoins(res)
      //   this.groupAccount = []
      //   for (let obj of res) {
      //     if (obj.accountType === 0) {
      //       this.groupAccount.push(obj)
      //     }
      //   }
      //   this.loading.init = false
      // })
      this.web3Fn = this.newWeb3()
    },
    newWeb3 () {
      const baseUrl = this.$$.config.env === 'dev' ? 'https://testnet.fsn.dev/api' : 'https://fsn.dev/api'
      let web3 = new Web3(new Web3.providers.HttpProvider(baseUrl))
      // let web3 = new Web3()
      // web3.extend({
      //   property: 'swap',
      //   methods: []
      // })
      return web3
    },
    createHash () {
      this.$$.readFile(this.$$.config.file.btc).then(res => {
        console.log(res)
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
        value: '0x0',
        data: fileData
      }
      let count = 0, time = Date.now()
      console.log(data)
      const batch = new this.web3Fn.BatchRequest()
      batch.add(this.web3Fn.eth.estimateGas.request({to: ''}, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(1)
          data.gas = this.$$.web3.utils.toHex(res * 6)
          count ++
        }
      }))
      batch.add(this.web3Fn.eth.getTransactionCount.request(this.address, (err, res) => {
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
      this.$$.getSignNonce(this.address).then(nonce => {
        // let rawTx = {
        //   nonce: this.$$.web3.utils.toHex(1),
        //   gasPrice: this.$$.web3.utils.toHex(1000000000),
        //   gasLimit: this.$$.web3.utils.toHex(4000000),
        //   to: '',
        //   value: this.$$.web3.utils.toHex(0),
        //   data: data,
        //   chainId: this.$$.web3.utils.toHex(46688)
        // }
        let hash = this.$$.toHash(JSON.stringify(data))
        console.log(data)
        console.log(hash)
        return
        this.dataPage = {
          nonce: nonce,
          value: 0,
        }

        let dataObj = {
          TxType: "SIGN",
          PubKey: this.groupAccount[this.selectIndex].publicKey,
          MsgHash: hash,
          Keytype: "ECDSA",
          GroupId: this.groupAccount[this.selectIndex].gID,
          ThresHold: this.groupAccount[this.selectIndex].mode,
          Mode: '0',
          TimeStamp: Date.now().toString(),
          MsgContext: rawTx
        }
        this.dataPage.data = JSON.stringify(dataObj)
        console.log(this.dataPage)
        this.eDialog.pwd = true
      })
    },
    getSignData () {

    }
  }
}
</script>