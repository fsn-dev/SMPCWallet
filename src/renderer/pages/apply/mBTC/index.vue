<template>
  <div class="boxConntent1 container" v-loading.fullscreen.lock="loading.init" :element-loading-text="$t('loading').l_1">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/dapp' }">{{$t('title').dapp}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').CrossChainBTC}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="mBTC-title">
      <h1 class="h1">{{$t('title').CrossChainBTC}}</h1>
      <p class="p">{{$t('tip').mBTC.d1 + ',' + $t('tip').mBTC.d2 + ',' + $t('tip').mBTC.d3}}</p>
      <p class="p flex-c">{{$t('label').unionNode}}:  <span class="WW30 ellipsis ml-10" :title="unionNode.join(',')">{{unionNode.join(',')}}</span></p>
    </div>

    <div class="swap-box">
      <div class="swap-cont">
        <div class="swap-up flex-bc">
          <div class="swap-style swap-up-left">
            <h3 class="label">{{$t('label').send}}</h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <div class="flex-sc">
                  <div class="coin-logo-view">
                    <div v-if="coinInfoObj[selectCoin]" class="HH100 WW100"><img :src="coinInfoObj[selectCoin][0].logo"></div>
                  </div>
                  <el-select v-model="selectCoin" @change="changeCoin" class="W120">
                    <el-option v-for="(item, index) in coinInfoObj" :key="index" :label="index" :value="index">
                      <div class="flex-sc">
                        <div class="coin-logo" v-if="item[0].logo"><img :src="item[0].logo"></div>
                        <div class="coin-logo txt" v-else>{{$$.titleCase(index)}}</div>
                        {{ index }}
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <el-input type="number" class="WW50 input-value" v-model="swap.fromValue" @input="changeValue"></el-input>
              </div>
            </div>
          </div>
          <div class="swap-style swap-up-right">
            <h3 class="label flex-bc">
              {{$t('label').to}}
              <span class="font12">fee = {{swapInfo.SwapFeeRate * 100}}%</span>
            </h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <div class="flex-sc">
                  <div class="coin-logo-view">
                    <div v-if="coinInfoObj[selectCoin]" class="HH100 WW100"><img :src="coinInfoObj[selectCoin][0].logo"></div>
                  </div>
                  <div class="coin">mBTC</div>
                </div>
                <el-input type="number" class="WW50 input-value" v-model="swap.toValue" disabled></el-input>
              </div>
            </div>
          </div>
          <div class="swap-arrow"><i class="el-icon-d-arrow-right"></i></div>
        </div>
        <div class="swap-up flex-bc swap-receive mt-30">
          <div class="swap-style swap-down">
            <h3 class="label flex-bc">
              {{selectCoin}} Address:
            </h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <el-select v-model="swap.fromIndex" class="WW100" @change="changeFromAddr">
                  <el-option v-for="(item, index) in selectCoinArr" :key="index" :label="item.address" :value="index">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="font12 color_99 H30">{{ this.swap.fromObj ? $$.fromWei(this.swap.fromObj.balance, this.swap.fromObj.coinType) + ' ' + selectCoin : ''}}</div>
          </div>
          <div class="swap-style swap-down">
            <h3 class="label flex-bc">
              ETH Address:
            </h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <el-input type="text" class="WW100 input-value" v-model="swap.toAddr"></el-input>
              </div>
            </div>
            <div class="font12 color_99 H30"></div>
          </div>
        </div>
      </div>
      <div class="WW100 flex-c mt-50">
        <el-button type="primary" class="btn-primary W300 IH50 font16" @click="lockoutBtn">{{$t('btn').swap}}</el-button>
      </div>
    </div>
    <div class="table-box mb-30">
      <el-table :data="historyData" style="width: 100%" :empty-text="$t('warn').w_12">
        <!-- <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="tables-expand">
              <el-form-item label="Key ID:">
                <span>{{ scope.row.key }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupId + ':'">
                <span v-if="refresh.g">{{ scope.row.gName ? scope.row.gName : scope.row.gId }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupAccountId + ':'">
                <span v-if="refresh.a">{{ scope.row.aName ? scope.row.aName : scope.row.pubKey }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').mode + ':'">
                <span>{{scope.row.mode}}</span>
              </el-form-item>
              <el-form-item :label="$t('label').date + ':'">
                <span>{{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column :label="$t('state').name" width="80" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.status === 8 || scope.row.status === 9 || scope.row.status === 10 ? 'color_green' : 'color_red'">{{setHistoryState(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').hash" align="center">
          <template slot-scope="scope">
            <span class="cursorP" :title="scope.row.txid" @click="copyTxt(scope.row.txid)">{{ $$.cutOut(scope.row.txid, 6, 4) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').from" align="center">
          <template slot-scope="scope">
            <span class="cursorP" :title="scope.row.from" @click="copyTxt(scope.row.from)">{{ $$.cutOut(scope.row.from, 6, 4) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').value" align="center">
          <template slot-scope="scope">
            <span>{{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(selectCoin).coinType), 'no')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').to" align="center">
          <template slot-scope="scope">
            <span class="cursorP" :title="scope.row.bind" @click="copyTxt(scope.row.bind)">{{ $$.cutOut(scope.row.bind, 6, 4) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').pairHash" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.swaptx" @click="copyTxt(scope.row.swaptx)">{{ $$.cutOut(scope.row.swaptx, 6, 4) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').fee" align="center">
          <template slot-scope="scope">
            <span>
              {{
              Number($$.thousandBit($$.fromWei(Number(scope.row.value) - Number(scope.row.swapvalue), $$.cutERC20(selectCoin).coinType), 20))
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').date" width="200" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm:ss')}}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick" :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import './scss/index.scss';
</style>

<script>
import swap from '@/assets/js/web3/extends/swap.js'
function newWeb3 () {
  const Web3 = require('web3')
  let url = 'http://47.92.168.85:11556/rpc'
  let web3 = new Web3(new Web3.providers.HttpProvider(url))
  web3.extend({
    property: 'swap',
    methods: [
      ...swap
    ]
  })
  return web3
}


import regExp from '@/assets/js/config/RegExp.js'
import {computedPub} from '@/assets/js/pages/public.js'
import getAllAccountList from '@/assets/js/pages/accounts/getAllAccountList.js'
import formatAccountCoins from '@/assets/js/pages/accounts/formatAccountCoins.js'
export default {
  name: 'crossChain',
  data () {
    return {
      coinInfoObj: {},
      selectCoin: 'BTC',
      selectCoinArr: [],
      swap: {
        fromIndex: '',
        fromValue: 0,
        toAddr: '',
        toValue: 0,
      },
      swapInfo: {},
      historyData: [],
      loading: {
        init: true
      },
      eDialog: {
        pwd: false
      },
      unionNode: [],
      dataPage: {},
      web3Fn: ''
    }
  },
  computed: {
    ...computedPub,
    selectPubKey () {
      return this.$store.state.selectPubKey
    }
  },
  sockets: {
    NodeAndOtherData (res) {
      // console.log(res)
      for (let obj of res.info.nodeList) {
        if (obj.nodeType === 0) {
          this.unionNode.push(obj.name)
        }
      }
    }
  },
  mounted () {
    this.loading.init = true
    setTimeout(() => {
      this.web3Fn = newWeb3()
      this.init()
    }, 300)
  },
  methods: {
    ...getAllAccountList,
    ...formatAccountCoins,
    modalClick () {
      this.eDialog.pwd = false
    },
    init () {
      this.$socket.emit('NodeAndOtherData')
      this.getAllAccountList().then(res => {
        // console.log(res)
        this.getAllCoins(res)
      })
      this.web3Fn.swap.GetServerInfo().then(res => {
        // console.log(res)
        this.swapInfo = res.SrcToken
      })
    },
    lockoutBtn () {
      if (!this.swap.toAddr) {
        this.msgError(this.$t('warn').w_14)
        return
      }
      this.openPwdDialog()
    },
    openPwdDialog () {
      let coin = this.$$.cutERC20(this.selectCoin).coinType
      let balance = this.$$.fromWei(this.swap.fromObj.balance, coin)
      if (!regExp.coin[coin].test(this.swap.toAddr) && coin !== 'BTC') {
        this.msgError('This to address is illegal!')
        return
      }
      if (Number(this.swapInfo.MinimumSwap) > Number(this.swap.fromValue)) {
        this.msgError('Min value is:' + this.swapInfo.MinimumSwap)
        return
      }
      if (Number(this.swapInfo.MaximumSwap) < Number(this.swap.fromValue)) {
        this.msgError('Max value is:' + this.swapInfo.MaximumSwap)
        return
      }
      if (Number(this.swap.fromValue) > Number(balance)) {
        this.msgError(this.$t('warn').w_19)
        return
      }
      this.dataPage = {}
      this.$$.getLockOutNonce(this.address).then(nonce => {
        this.dataPage.nonce = nonce
        this.dataPage.value = this.$$.toWei(this.swap.fromValue, coin).toString()
        let dataObj = {
          TxType: "LOCKOUT",
          DcrmAddr: this.swap.fromObj.address,
          DcrmTo: this.swapInfo.DcrmAddress,
          Value: this.dataPage.value,
          Cointype: coin,
          GroupId: this.swap.fromObj.gID,
          ThresHold: this.swap.fromObj.mode,
          Mode: this.swap.fromObj.accountType.toString(),
          TimeStamp: Date.now().toString(),
          Memo: 'SWAPTO:' + this.swap.toAddr,
        }
        this.dataPage.data = JSON.stringify(dataObj)
        console.log(this.dataPage)
        this.eDialog.pwd = true
      })
    },
    getSignData (data) {
      this.eDialog.pwd = false
      if (data.signTx) {
        this.loading.init = true
        this.$$.lockOut(data.signTx).then(res => {
          console.log(res)
          if (res.msg === 'Success') {
            if (Number(this.swap.fromObj.accountType)) {
              // this.getOutHash(res.info)
              this.saveTxnsDB(res.info)
            } else  {
              this.$$.getGroupObj(this.swap.fromObj.gID).then(res => {
                console.log(res)
                let enodeArr = []
                if (res.msg === 'Success') {
                  for (let obj of res.info) {
                    enodeArr.push(obj)
                  }
                }
                this.saveTxnsDB(res.info, enodeArr)
              })
            }
            setTimeout(() => {
              this.msgSuccess('Success!')
              this.loading.init = false
            }, 1000)
          } else {
            this.msgError(res.error)
            this.loading.init = false
          }
        })
      } else {
        this.msgError('Error')
      }
    },
    getOutHash (key) {
      this.$$.getLockOutStatus(key).then(res => {
        console.log(res)
        if (res.status === 'Success' || res.hash) {
          this.msgSuccess('Success!')
          this.loading.init = false
          setTimeout(() => {
            this.getHistory()
          }, 1000)
        } else if (res.status === 'Pending') {
          setTimeout(() => {
            this.getOutHash(key)
          },  1500)
        } else {
          this.msgError("Failure")
          this.loading.init = false
        }
      })
    },
    saveTxnsDB (key, enodeArr) {
      let data = {
        from: this.swap.fromObj.address,
        to: this.swap.toAddr,
        swapTo: this.swapInfo.DcrmAddress,
        value: this.dataPage.value,
        nonce: this.dataPage.nonce,
        coinType: this.selectCoin,
        hash: '',
        status: 0,
        pubKey: this.swap.fromObj.publicKey,
        key: key,
        mode: this.swap.fromObj.mode,
        gId: this.swap.fromObj.gID,
      }
      if (Number(this.swap.fromObj.accountType)) {
        data.kId = this.address
        data.eNode = this.eNode
      } else {
        data.gArr = [
          {eNode: this.eNode, nodeKey: this.$$.eNodeCut(this.eNode).key, kId: this.address, status: 5, timestamp: Date.now(), initiate: 1}
        ]
        for (let obj of enodeArr) {
          if (obj === this.eNode) continue
          data.gArr.push({eNode: obj, nodeKey: this.$$.eNodeCut(obj).key, kId: '', status: 0, timestamp: '', initiate: 0})
        }
      }
      // console.log(data)
      if (Number(this.swap.fromObj.accountType)) {
        // AddPersonTxns(this, dataUrl, data)
        if (this.networkMode) {
          this.$socket.emit('PersonAddTxns', data)
        } else {
          this.$db.AddPersonTxns(data)
        }
      } else {
        // AddGroupTxns(this, dataUrl, data)
        if (this.networkMode) {
          this.$socket.emit('GroupAddTxns', data)
        } else {
          this.$db.AddGroupTxns(data)
        }
      }
      // this.resetForm()
    },
    getAllCoins (res) {
      let arr = [], allCoins = []
      for (let obj of res) {
        arr.push({ p1: 'dcrm', p2: 'getAccountsBalance', p3: [obj.publicKey, this.address] })
      }
      this.$$.batchRequest(arr).then(res1 => {
        // console.log(res1)
        for (let i = 0, len = res1.length; i < len; i++) {
          let cbData = res1[i], arr1 = []
          if (typeof cbData === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            arr1 = cbData.Data.result.Balances
          }
          let coinArr = this.formatAccountCoins(arr1, res[i].accountType, res[i])
          // console.log(coinArr)
          allCoins.push(...coinArr)
        }
        for (let obj of allCoins) {
          if (!this.coinInfoObj[obj.coinType]) {
            this.coinInfoObj[obj.coinType] = []
          }
          this.coinInfoObj[obj.coinType].push(obj)
        }
        // console.log(allCoins)
        this.changeCoin()
        this.loading.init = false
      })
    },
    changeCoin () {
      this.selectCoinArr = this.coinInfoObj[this.selectCoin]
      for (let i = 0, len = this.selectCoinArr.length; i < len; i ++) {
        let obj = this.selectCoinArr[i]
        if (obj.publicKey === this.selectPubKey) {
          this.swap.fromIndex = i
          break
        }
      }
      if (this.swap.fromIndex === '') {
        this.swap.fromIndex = 0
      }
      this.changeFromAddr()
      // console.log(this.selectCoinArr)
    },
    changeFromAddr () {
      // console.log(this.swap.fromIndex)
      this.swap.fromObj = this.selectCoinArr[this.swap.fromIndex]
      // console.log(this.swap.fromObj)
      setTimeout(() => {
        this.getHistory()
      }, 300)
    },
    getHistory () {
      let data = {
        Address: this.swap.fromObj.address,
        Offset: 0,
        Limit: 20
      }
      // console.log(data)
      this.web3Fn.swap.GetSwapinHistory(data).then(res => {
        console.log(res)
        this.historyData = res.reverse()
      })
    },
    setHistoryState (num) {
      let status = 'Waiting'
      switch (num) {
        case 8: 
          status = 'Waiting'
          break
        case 9:
          status = 'Pending'
          break
        case 10:
          status = 'Success'
          break
        default:
          status = 'Failure'
      }
      return status
    },
    changeValue () {
      this.swap.toValue = ((1 - this.swapInfo.SwapFeeRate) * this.swap.fromValue).toFixed(10)
    }
  }
}
</script>