<template>
  <div class="boxConntent1">
    <div class="confirmPage flex-c" v-if="!selectData.isConfirm">
      Please 'Apply Cross-Chain'!
    </div>
    <div class="confirmPage flex-c" v-if="!isSupportCoin">
      {{selectData.coinType}} does not support withdraw!
    </div>
    <div class="receiveContent_box" v-if="selectData.isConfirm && isSupportCoin">
      <!-- <div class="receiveAddress_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……"> -->
      <div class="receiveAddress_box">

        <el-form label-position="top" label-width="80px" @submit.native.prevent>
          <el-form-item :label="addressTitle + '：'">
            <el-input v-model="toAddress"></el-input>
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
          </div>
        </el-form>
        <div class="receiveAddress_btn flex-c">
          <!-- <button class="btn blue flex-c W240 mt-10" @click="privateSure">{{$t('TITLE').LOCKOUT}}</button> -->
          <el-button class="W240 mt-10" @click="privateSure" type="primary" :loading="lockinBtnLoading">{{$t('TITLE').LOCKOUT}}</el-button>
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
                      <li>{{$t('LABEL').ADDRESS}}：{{scope.row.contractTo}}</li>
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
      :title="$t('TITLE').LOCKOUT"
      :visible.sync="privateSureVisible"
      width="85%"
      :before-close="modalClick"
      >
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
          <li><h3>Data:</h3><span>{{dataPage.data}}</span></li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="modalClick">{{$t('BTN').GET_OUT}}</el-button>
        <el-button type="primary" size="small" @click="sendAmoundInfo" :disabled="sendBtnFlag">{{$t('BTN').YES_SURE}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "lockOut",
  props: ["selectData"],
  data () {
    return {
      // addressTitle: "",
      walletAddress: "",
      coinAddress: "",
      toAddress: "",
      historyData: [],
      sendAmound: "",
      sendBtnFlag: false,
      nonceNum: "",
      gasPriceNum: "",
      gasLimitNum: "",
      balanceNum: "",
      maxFee: "",
      netWorkInfo: "",
      dataPage: {},
      sendInfoVisible: false,
      privateSureVisible: false,
      activeNames: "",
      selfSet: false,
      fullscreenLoading: true,
      historyLoading: true,
      lockinBtnLoading: false,
      isRefreshStart: true,
      pageInfo: {
        pageNum: 1,
        total: 0,
        pageSize: 20,
      },
      refreshTable: null,
      isSupportCoin: true
    }
  },
  sockets: {
    sendTxns (res) {
      // res = res.data
      if (res.msg === 'Success') {
        this.getInitData()
        this.$message({ message: 'Success', type: 'success' })
      } else {
        this.$message.error(res.error)
      }
      this.modalClick()
    },
    lockOutHistory (res) {
      console.log(res)
      this.historyData = []
      if (res.msg === "Success") {
        for (let i = 0; i < res.info.length; i++) {
          res.info[i].status = this.$$.changeState(res.info[i].status)
          res.info[i].date = this.$$.timeChange({date: Number(res.info[i].timestamp), type:"yyyy-mm-dd hh:mm"})
          res.info[i].value = Number(Number(res.info[i].value).toFixed(16))
          this.historyData.push(res.info[i])
        }
        this.pageInfo.total = Math.ceil(res.total / this.pageInfo.pageSize)
      }
      this.historyLoading = false
      this.isRefreshStart = true
      clearTimeout(this.refreshTable)
      this.refreshTable = setTimeout(() => {
        this.getDatabaseInfo()
      }, 1000 * Number(this.$$.config.refreshDataTime))
    },
    changeWei (res) {
      let to_value = res.info
      to_value = Number(Number(to_value).toFixed(16))
      this.dataPage = {
        nonce: this.nonceNum,
        gasPrice: Number(this.gasPriceNum),//Number类型 
        gasLimit: Number(this.gasLimitNum),
        from: this.walletAddress,
        to: "0x00000000000000000000000000000000000000dc",
        value: Number(0),//Number类型
        data: "LOCKOUT:" + this.toAddress + ":" + to_value + ":" + this.selectData.ERC20coin,
        sendType: "LOCKOUT",
        coin: this.selectData.coinType,
        to_value: to_value,
        to_address: this.toAddress,
        to_from: this.coinAddress
      }
      this.privateSureVisible = true
      this.lockinBtnLoading = false
    },
    base (res) {
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
        // this.gasLimitNum = res.gasLimit * 6
        this.gasLimitNum = Number(res.gasLimit) * 10
      }
      if (res.balance || res.initBalance) {
        if (this.selectData.coinType === this.$$.config.initCoin) {
          this.balanceNum = res.initBalance
        } else {
          this.balanceNum = res.balance
        }
      }
      console.log(res)
      this.fullscreenLoading = false
    }
  },
  watch: {
    selectData (cur, old) {
      this.historyLoading = true
      this.getInitData()
      this.toAddress = ""
      this.sendAmound = ""
    }
  },
  computed: {
    addressTitle: function () {
      return this.selectData.coinType + " Withdraw Address"
    },
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    if (this.selectData) {
      this.getInitData()
    }
    if (this.$store.state.wallet.safeMode) {
      this.fullscreenLoading = false
      this.selfSet = true
      return
    }
  },
  methods: {
    prevClick () {
      this.pageInfo --
      this.getDatabaseInfo()
    },
    nextClick () {
      this.pageInfo ++
      this.getDatabaseInfo()
    },
    keyPressBtn (e) {
      if (e.which === 13) {
        this.privateSure()
      }
    },
    getInitData () {
      if (this.$store.state.wallet.safeMode) {
        this.fullscreenLoading = false
        this.historyLoading = false
        return
      }
      if (!this.selectData.isConfirm) {
        this.fullscreenLoading = false
        this.historyLoading = false
        return
      }
      let _nonceType = 3
      if (this.selectData.ERC20coin === 'BTC') {
        _nonceType = 2
      }
      // console.log(this.selectData)
      this.coinAddress = this.selectData.dcrmAddress
      this.isSupportCoin = this.selectData.isLockout
      this.getDatabaseInfo()
      this.$socket.emit('base', {
        from: this.$store.state.address,
        to: '0x00000000000000000000000000000000000000dc',
        url: this.$store.state.network.url,
        coin: this.selectData.ERC20coin,
        nonceType: _nonceType
      })
    },
    getElDialogView () {
      this.modalClick()
    },
    modalClick () {
      this.$router.push("/LILO/lockOut")
      this.privateSureVisible = false
      this.sendInfoVisible = false
      this.sendBtnFlag = false
    },
    getSignData (data) {
      if (data) {
        this.serializedTx = data
        this.sendInfoVisible = true
      } else {
        this.sendInfoVisible = false
        this.$message.error(this.$t('ERROR_TIP').TIP_6)
      }
      this.privateSureVisible = false
    },
    privateSure () {
      event.preventDefault()
      this.lockinBtnLoading = true
      if (!this.toAddress) {
        this.$message.error(this.selectData.coinType + this.$t('ERROR_TIP').TIP_11)
        this.lockinBtnLoading = false
        return
      }
      if (this.toAddress.toLowerCase() === this.walletAddress.toLowerCase()) {
        this.$message.error(this.$t('ERROR_TIP').TIP_4)
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
    sendAmoundInfo () {
      this.sendBtnFlag = true
      this.$socket.emit('sendTxns', {
        signSerializedTx: this.serializedTx,
        url: this.$store.state.network.url
      })
    },
    getDatabaseInfo () {
      if (!this.selectData.isConfirm) {
        return
      }
      this.isRefreshStart = false
      // console.log(this.walletAddress)
      // console.log(this.$store.state.address)
      this.$socket.emit('lockOutHistory', {
        from: this.walletAddress ? this.walletAddress : this.$store.state.address,
        coin: this.selectData.ERC20coin,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        url: this.$store.state.network.url
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.refreshTable)
    this.refreshTable = null
  }
}
</script>
