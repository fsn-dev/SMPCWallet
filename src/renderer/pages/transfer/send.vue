<template>
  <div class="boxConntent1">
    <!-- <div class="receiveContent_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……"> -->
    <div class="confirmPage flex-c" v-if="!selectData.isConfirm && selectData.coinType !== $$.config.initCoin">
      Please 'Apply Cross-Chain'!
    </div>
    <div class="receiveContent_box" v-if="selectData.isConfirm || selectData.coinType === $$.config.initCoin">
      <div class="receiveAddress_box">
        <el-form label-position="top" label-width="80px" @submit.native.prevent>
          <el-form-item :label="addressTitle + '：'">
            <el-input v-model="toAddress" @change="toaddresGas"></el-input>
          </el-form-item>
          <el-form-item :label="$t('LABEL').AMOUNT + '：'">
            <el-input v-model="sendAmound" @keypress="keyPressBtn"></el-input>
            <span :class="Number(balanceNum) === 0 ? 'color_red' : 'color_99'" v-if="balanceNum">{{Number(balanceNum) === 0 ? "Insufficient balance" : "Account Balance: " + balanceNum}}</span>
          </el-form-item>
          <el-form-item label="Advanced:">
            <el-switch
              v-model="selfSet"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </el-form-item>
          <div v-if="selfSet">
            <el-form-item label="Nonce：">
              <el-input v-model="nonceNum"></el-input>
            </el-form-item>
            <el-form-item label="Gas Price：">
              <el-input v-model="gasPriceNum"></el-input>
            </el-form-item>
            <el-form-item label="Gas Limit：">
              <el-input v-model="gasLimitNum"></el-input>
            </el-form-item>
            <el-form-item label="Hex Data：" v-if="selectData.coinType === $$.config.initCoin">
              <el-input v-model="sendData" placeholder="0x"></el-input>
            </el-form-item>
            <el-form-item label="Signed Transaction：" v-if="serializedTxView">
              <el-col :span="13">
                <el-input type="textarea" v-model="serializedTxVal" placeholder="0x" :rows="12" style="margin-top:8px"></el-input>
              </el-col>
              <el-col class="line" :span="2"></el-col>
              <el-col :span="11">
                <div class="flex-ec">
                  <div id="qrcode"></div>
                </div>
              </el-col>
            </el-form-item>
          </div>
        </el-form>
        <div class="receiveAddress_btn flex-c">
          <!-- <button class="btn blue flex-c W240 mt-10" @click="privateSure">{{$store.state.safeMode ? $t('BTN').GENERATE_INFORMATION : $t('BTN').SEND}}</button> -->
          <el-button class="W240 mt-10" @click="privateSure" type="primary" :loading="lockinBtnLoading">{{$store.state.safeMode ? $t('BTN').GENERATE_INFORMATION : $t('BTN').SEND}}</el-button>
          <!-- <button class="btn blue flex-c W240 mt-10" @click="privateSure" v-if="$store.state.safeMode">{{$t('BTN').GENERATE_INFORMATION}}</button> -->
        </div>
      </div>

      <div class="tableHistory_box">
        <hgroup class="tableHistory_title">
          <h3 class="title">{{$t('TITLE').HISTORY}}:</h3>
        </hgroup>
        <div class="tableHistory_table table-responsive"
          v-loading="historyLoading"
          element-loading-text="Loading……">
          <el-table
            :data="historyData"
            style="width: 100%"
            empty-text="Null"
          >
            <el-table-column
              :label="$t('THEAD').PUBLIC.STATUS"
              width="80"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.status" :class="scope.row.status !== 'Success' ? 'red' : ''"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').COIN" prop="coinType" width="80"></el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.AMOUNT" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.contractValue ? scope.row.contractValue : scope.row.value}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.DATE" prop="date" width="180"></el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.INFORMATION" min-width="360">
              <template slot-scope="scope">
                <el-collapse class="moreInfo_box" accordion v-model="activeNames">
                  <el-collapse-item :title="scope.row.hash">
                    <ul class="list">
                      <li>{{$t('LABEL').TXID}}：{{scope.row.hash}}</li>
                      <li>{{$t('LABEL').ADDRESS}}：{{scope.row.contractTo ? scope.row.contractTo : scope.row.to}}</li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex-ec mt-20" v-if="pageInfo.total > 1">
            <el-pagination
              @prev-click="prevClick"
              @next-click="nextClick"
              :page-size="pageInfo.pageNum"
              :pager-count="5"
              layout="prev, pager, next"
              :total="pageInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="Send Ether & Tokens"
      :visible.sync="privateSureVisible"
      width="85%"
      :before-close="modalClick"
      >
      <!-- <router-view @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView"></router-view> -->
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>

    <el-dialog
      :title="$t('TITLE').TO_SEND"
      :visible.sync="sendInfoVisible"
      width="60%"
      :before-close="modalClick"
      >
      <div class="sendInfo_box">
        <ul>
          <li><h3>To Address:</h3><span>{{toAddress}}</span></li>
          <li><h3>From Address:</h3><span>{{walletAddress}}</span></li>
          <li><h3>Amount to Send:</h3><span>{{sendAmound}}</span></li>
          <li><h3>Account Balance:</h3><span>{{Number(balanceNum)}} {{selectData.coinType}}</span></li>
          <li><h3>Coin:</h3><span>{{selectData.coinType}}</span></li>
          <li><h3>Network:</h3><span>{{netWorkInfo}}</span></li>
          <li><h3>Gas Limit:</h3><span>{{gasLimitNum}}</span></li>
          <li><h3>Gas Price:</h3><span>{{gasPriceNum}}</span></li>
          <li><h3>Max TX Fee:</h3><span>{{maxFee}}</span></li>
          <li><h3>Nonce:</h3><span>{{nonceNum}}</span></li>
          <li><h3>Data:</h3><span>{{dataPage.data || "(none)"}}</span></li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="modalClick">{{$t('BTN').GET_OUT}}</el-button>
        <el-button type="primary" size="small" @click="sendDatabase" :disabled="sendBtnFlag">{{$t('BTN').YES_SURE}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style>
</style>


<script>
export default {
  name: "send",
  props: ["selectData"],
  data () {
    return {
      toAddress: "",
      historyData: [],
      walletAddress: "",
      sendAmound: "",
      gasPriceNum: "",
      gasLimitNum: "",
      balanceNum: "",
      nonceNum: "",
      dataPage: "",
      serializedTx: "",
      maxFee: "",
      netWorkInfo: "",
      refreshTable: null,
      sendInfoVisible: false,
      privateSureVisible: false,
      sendBtnFlag: false,
      activeNames: "",
      selfSet: false,
      sendData: "",
      fullscreenLoading: true,
      historyLoading: true,
      lockinBtnLoading: false,
      serializedTxView: false,
      serializedTxVal: "",
      isRefreshStart: true,
      pageInfo: {
        pageNum: 1,
        total: 0,
        pageSize: 20,
      }
    }
  },
  sockets: {
    sendTxns (res) {
      if (res.msg === "Success") {
        this.getInitData()
        this.$message({ message: 'Success', type: 'success' })
      } else {
        this.$message.error(res.error)
      }
      this.modalClick()
    },
    history (res) {
      // console.log(res)
      this.historyData = []
      if (res.msg === "Success" && res.info.length > 0) {
        for (let i = 0; i < res.info.length; i++) {
          res.info[i].status = this.$$.changeState(res.info[i].status)
          res.info[i].date = this.$$.timeChange({date: res.info[i].timestamp, type:"yyyy-mm-dd hh:mm"})
        }
        this.historyData = res.info
        // console.log(this.historyData)
        this.pageInfo.total = Math.ceil(res.total / this.pageInfo.pageSize)
      }
      this.historyLoading = false
      this.isRefreshStart = true

      clearTimeout(this.refreshTable)
      this.refreshTable = setTimeout(() => {
        this.getSendHistory()
      }, 1000 * Number(this.$$.config.refreshDataTime))
    },
    base (res) {
      // console.log(res)
      if (res.msg === 'Success') {
        res = res.info
        if (!isNaN(res.nonce)) {
          this.nonceNum = res.nonce
        }
        if (!isNaN(res.gasPrice)) {
          this.gasPriceNum = res.gasPrice
        }
        if (res.netWorkInfo) {
          this.netWorkInfo = res.netWorkInfo
        }
        if (!isNaN(res.gasLimit)) {
          this.gasLimitNum = res.gasLimit * 6
        }
        if (res.balance || res.initBalance) {
          if (this.selectData.coinType === this.$$.config.initCoin) {
            this.balanceNum = res.initBalance
          } else {
            this.balanceNum = res.balance
          }
        }
      } else {
        this.$message.error(res.info)
      }
    },
    changeWei (res) {
      let to_value = res.info
      to_value = Number(Number(to_value).toFixed(16))
      this.dataPage = {
        nonce: this.nonceNum,
        gasPrice: Number(this.gasPriceNum),//Number类型 
        gasLimit: Number(this.gasLimitNum),
        from: this.walletAddress,
        to: this.toAddress,
        value: Number(to_value),//Number类型,
        coin: this.selectData.coinType,
        to_value: to_value,
        to_address: this.toAddress
      }
      if (this.selectData.coinType !== this.$$.config.initCoin) {
        this.dataPage.data = this.sendData ? this.sendData : "TRANSACTION:" + this.toAddress + ":" + to_value + ":" + this.selectData.ERC20coin
        this.dataPage.sendType = "SENDDCRM"
        this.dataPage.to = "0x00000000000000000000000000000000000000dc"
        this.dataPage.value = "0"
      }
      this.privateSureVisible = true
      this.lockinBtnLoading = false
      console.log(this.dataPage)
    }
  },
  watch: {
    selectData (cur, old) {
      console.log(cur)
      this.sendData = ''
      this.historyLoading = true
      this.getInitData()
      this.toAddress = ""
      this.sendAmound = ""
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    if (this.selectData.coinType) {
      setTimeout(() => {
        this.getInitData()
      }, 100)
    }
    if (this.$store.state.wallet.safeMode) {
      this.selfSet = this.$store.state.wallet.safeMode
      this.fullscreenLoading = false
    }
  },
  computed: {
    addressTitle: function () {
      return this.selectData.coinType + " Send Address"
    },
  },
  methods: {
    prevClick () {
      this.pageInfo --
      this.getSendHistory()
    },
    nextClick () {
      this.pageInfo ++
      this.getSendHistory()
    },
    getElDialogView () {
      this.modalClick()
    },
    keyPressBtn (e) {
      if (e.which === 13) {
        this.privateSure()
      }
    },
    toaddresGas() {
      if (this.$store.state.wallet.safeMode || !this.toAddress) {
        return
      }
      let toAddress = '0x00000000000000000000000000000000000000dc'
      if (this.selectData.coinType === this.$$.config.initCoin) {
        toAddress = this.toAddress
      }
      this.$socket.emit('base', {
        from: this.$store.state.address,
        to: toAddress,
        url: this.$store.state.network.url,
        coin: this.selectData.ERC20coin,
        nonceType: 7
      })
    },
    getInitData () {
      if (this.$store.state.wallet.safeMode) {
        this.historyLoading = false
        this.fullscreenLoading = false
        return
      }
      if (!this.selectData.isConfirm && this.selectData.coinType !== this.$$.config.initCoin) {
        this.historyLoading = false
        return
      }
      
      this.getSendHistory()
      let toAddress = '0x00000000000000000000000000000000000000dc'
      if (this.selectData.coinType === this.$$.config.initCoin) {
        toAddress = this.toAddress
      }
      this.$socket.emit('base', {
        from: this.$store.state.address,
        to: toAddress,
        url: this.$store.state.network.url,
        coin: this.selectData.ERC20coin,
        nonceType: 7
      })
      this.fullscreenLoading = false
    },
    modalClick () {
      this.privateSureVisible = false
      this.sendInfoVisible = false
      this.sendBtnFlag = false
    },
    privateSure () {
      event.preventDefault()
      this.lockinBtnLoading = true
      if (!this.toAddress) {
        this.$message.error(this.selectData.coinType + this.$t('ERROR_TIP').TIP_2)
        this.lockinBtnLoading = false
        return
      }
      if (this.toAddress.toLowerCase() === this.walletAddress.toLowerCase()) {
        this.$message.error(this.selectData.coinType + this.$t('ERROR_TIP').TIP_4)
        this.lockinBtnLoading = false
        return
      }
      if (this.selectData.coinType !== "BTC" && this.toAddress.indexOf("0x") !== 0) {
        this.$message.error(this.selectData.coinType + this.$t('ERROR_TIP').TIP_5)
        this.lockinBtnLoading = false
        return
      }
      let getAmountTip = this.$$.limitCoin(this.sendAmound, this.selectData.limit, this.selectData.number)
      if (getAmountTip.flag) {
        this.$message.error(getAmountTip.msg)
        this.lockinBtnLoading = false
        return
      }
      this.maxFee = this.$$.fromWei(Number(this.gasLimitNum) * Number(this.gasPriceNum), "ether")
      this.$socket.emit('changeWei', {
        type: 'toWei',
        coin: this.selectData.coinType,
        balance: this.sendAmound
      })
    },
    getSignData (data) {
      console.log(data)
      if (data) {
        if (data.type && data.type === "METAMASK" && !this.$store.state.wallet.safeMode) {
          this.sendDatabase(data.txhax)
        } else if (this.$store.state.wallet.safeMode) {
          this.serializedTxVal = data.serializedTx ? data.serializedTx : data
          this.serializedTxView = true
          this.sendInfoVisible = false
          this.qrcode(this.serializedTxVal)
        } else {
          this.serializedTx = data
          this.sendInfoVisible = true
        }
      } else {
        this.sendInfoVisible = false
        this.$message.error(this.selectData.coinType + this.$t('ERROR_TIP').TIP_6)
      }
      this.privateSureVisible = false
    },
    qrcode (cont) {
      this.serializedTxView = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    changeAmount () {
      this.sendAmound = this.$$.thousandChange(this.sendAmound, 18)
    },
    sendDatabase (hash) {
      console.log(hash)
      this.sendBtnFlag = true
      this.$socket.emit('sendTxns', {
        signSerializedTx: this.serializedTx ? this.serializedTx : '',
        url: this.$store.state.network.url
      })
    },
    async getSendHistory () {
      if (this.$store.state.wallet.safeMode) {
        this.historyLoading = false
        return
      }
      if (!this.walletAddress || !this.selectData.coinType) {
        this.historyLoading = false
        return
      }
      if (!this.selectData.isConfirm && this.selectData.coinType !== this.$$.config.initCoin) {
        this.historyLoading = false
        return
      }
      this.isRefreshStart = false
      this.$socket.emit('history', {
        from: this.walletAddress,
        coin: this.selectData.ERC20coin,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        url: this.$store.state.network.url
      })
    },
  },
  beforeDestroy () {
    clearTimeout(this.refreshTable)
    this.refreshTable = null
  }
}
</script>
