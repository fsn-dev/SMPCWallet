<template>
  <div class="boxConntent1">
    <div class="confirmPage flex-c" v-if="!selectData.isConfirm">
      Please 'Apply Cross-Chain'!
    </div>
    <div class="confirmPage flex-c" v-if="!isSupportCoin">
      {{selectData.coinType}} does not support Deposit!
    </div>
    <div class="receiveContent_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……" v-if="selectData.isConfirm && isSupportCoin">
      <div class="receiveAddress_box">
        <el-form label-position="top" label-width="80px">
          <el-form-item :label="addressTitle">
            <el-input v-model="selectData.dcrmAddress" id="walletAdressHide" class="font24" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c" @click="qrcode(selectData.dcrmAddress)"><div class="icon"><img src="@etc/img/QRcode.svg"></div>{{$t('BTN').SHOW_QR_CODE}}</button>
          <button class="btn cyan flex-c" @click="copyAddress('walletAdressHide')">
            <div class="icon"><img src="@etc/img/copy.svg"></div>
            <el-popover
              trigger="hover"
              :content="$t('BTN').COPY_CLIPBOARD">
              <div class="addreess" slot="reference">{{$t('BTN').COPY_CLIPBOARD}}</div>
            </el-popover>
          </button>
        </div>
      </div>

      <div class="customTxn_box" v-if="selectData.isConfirm">
        <el-form label-position="top" label-width="80px" @submit.native.prevent>
          <el-form-item label="Advanced:">
            <el-switch
              v-model="customTxhax"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </el-form-item>
          <div v-if="customTxhax">
            <el-form-item label="Transaction hash：">
              <el-input v-model="customTxhaxVal" placeholder=""></el-input>
            </el-form-item>
            <div class="receiveAddress_btn flex-c">
              <el-button class="W240 mt-10" @click="getCoinTxn" type="primary" :loading="lockinBtnLoading">{{$t('TITLE').LOCKIN}}</el-button>
            </div>
          </div>
        </el-form>
      </div>

      <div class="tableHistory_box" v-if="selectData.isConfirm">
        <hgroup class="tableHistory_title">
          <h3 class="title">{{$t('TITLE').HISTORY}}:</h3>
        </hgroup>
        <div class="tableHistory_table table-responsive" 
          v-loading="historyLoading"
          element-loading-text="Loading……">
          <el-table
            :data="historyData"
            empty-text="Null"
            style="width: 100%">
            <el-table-column
              :label="$t('THEAD').PUBLIC.STATUS"
              width="80"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.status" :class="scope.row.status !== 'Success' ? 'red' : ''"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').COIN" width="80">
              <template>
                <span>{{selectData.coinType}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.AMOUNT" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.value}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.DATE" prop="date" width="180"></el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.INFORMATION" min-width="360">
              <template slot-scope="scope">
                <el-collapse class="moreInfo_box" accordion v-model="activeNames">
                  <el-collapse-item :title="scope.row.hash">
                    <ul class="list">
                      <li>{{$t('LABEL').TXID}}：{{scope.row.hash}}</li>
                      <li>{{$t('LABEL').ADDRESS}}：{{scope.row.from}}</li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').ACTIONS" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="scope.row.status === 'New'" @click="privateSure({
                  value: scope.row.value2,
                  hash: scope.row.hash
                })">
                  {{$t('TITLE').LOCKIN}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-dialog :visible.sync="codeViewVisible" width="380px">
        <div class="qrcodeCont_box">
          <div id="qrcode" class="flex-c"></div>
          <div class="qrcodeCont_title">
            <h3>{{$t('TITLE').YOUR_ADDREAA}}</h3>
          </div>
        </div>
      </el-dialog>

    </div>

    <el-dialog :title="$t('TITLE').LOCKIN" :visible.sync="privateSureVisible" width="85%" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>

  </div>
</template>


<script>
export default {
  name: "lockIn",
  props: ["selectData"],
  data () {
    return {
      walletAddress: "",
      historyData: [],
      dataPage: {},
      codeViewVisible: false,
      privateSureVisible: false,
      activeNames: "",
      fullscreenLoading: true,
      historyLoading: true,
      lockinBtnLoading: false,
      customTxhax: false,
      customTxhaxVal: '',
      refreshTable: null,
      isRefreshStart: true,
      isSupportCoin: true,
      coinOtherArr: this.$$.coinOtherArr
    }
  },
  sockets: {
    lockin (res) {
      // console.log(res)
      if (res.msg === 'Success') {
        this.privateSure({
          value: res.info,
          hash: this.customTxhaxVal
        })
      } else {
        this.$message.error(res.info)
      }
      this.lockinBtnLoading = false
    },
    lockInHistory (res) {
      // console.log(res)
      this.historyData = []
      if (res.msg === 'Error') {
        this.historyLoading = false
        return
      }
      this.historyData = []
      for (let arr of res.info) {
        arr.status = this.$$.changeState(arr.status)
        arr.date = this.$$.timeChange({date: Number(arr.timestamp), type:"yyyy-mm-dd hh:mm"})
        this.historyData.push(arr)
      }
      let compare = function compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (value1 > value2) {
            return -1
          } else if (value1 < value2) {
            return 1
          } else {
            return 0
          }
        }
      }
      this.historyData.sort(compare("timestamp"))
      this.historyLoading = false
      clearTimeout(this.refreshTable)
      this.refreshTable = setTimeout(() => {
        this.getInitData()
      }, 1000 * Number(this.$$.config.refreshDataTime))
    },
    sendTxns (res) {
      if (res.msg === 'Success') {
        this.getAll()
        this.$message({ message: 'Success', type: 'success' })
      } else {
        this.$message.error(res.error)
      }
    },
    base (res) {
      res = res.info
      let data = {}
      if (!isNaN(res.gasLimit)) {
        data.gas = res.gasLimit * 6
      } else {
        console.log(res.gasLimit)
        this.$message.error(res.gasLimit)
        return
      }
      if (!isNaN(res.nonce)) {
        data.nonce = res.nonce
      } else {
        console.log(res.nonce)
        this.$message.error(res.nonce)
        return
      }
      if (res.gasPrice) {
        data.gasPrice = res.gasPrice
      } else {
        console.log(res.gasPrice)
        this.$message.error(res.gasPrice)
        return
      }
      let to_value = this.dataPage.to_value
      if (res.value) {
        to_value = res.value
      }
      to_value = Number(Number(to_value).toFixed(16))
      data.hash = this.dataPage.hash
      if (!data.hash) {
        return
      }
      this.dataPage = {
        nonce: Number(data.nonce),
        gasPrice: Number(data.gasPrice),//Number类型 
        gasLimit: Number(data.gas),
        from: this.walletAddress,
        to: "0x00000000000000000000000000000000000000dc",
        value: Number(0),//Number类型
        data: "LOCKIN:" + data.hash + ":" + to_value + ":" + this.selectData.ERC20coin,
        to_value: to_value,
        sendType: "LOCKIN",
        coin: this.selectData.coinType,
        hash: data.hash,
        url: this.$store.state.network.url
      }
      console.log(this.dataPage)
      this.privateSureVisible = true
      this.lockinBtnLoading = false
    }
  },
  watch: {
    selectData (cur, old) {
      // console.log(cur)
      this.historyLoading = true
      this.historyData = []
      this.getInitData()
    }
  },
  computed: {
    addressTitle: function () {
      return this.selectData.coinType + " Deposit Address"
    },
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    if (this.selectData) {
      setTimeout(() => {
        this.getInitData()
      }, 100)
    }
  },
  methods: {
    getInitData () {
      if (!this.selectData.isConfirm) {
        this.fullscreenLoading = false
        this.historyLoading = false
        return
      }
      this.isSupportCoin = this.selectData.isLockin
      if (this.isSupportCoin) {
        // console.log(123)
        this.getAll()
      }
      this.fullscreenLoading = false
    },
    validTxHax (hash, coin) {
      coin = coin ? coin : this.selectData.coinType
      if (typeof this.coinOtherArr[coin] === 'undefined' || !this.coinOtherArr[coin].hashFM) return hash
      if (this.coinOtherArr[coin].hashFM) {
        hash = hash.indexOf(this.coinOtherArr[coin].hashFM) === 0 ? hash : (this.coinOtherArr[coin].hashFM + hash)
      }
      return hash
    },
    getCoinTxn () {
      event.preventDefault()
      this.lockinBtnLoading = true
      // console.log(event)
      // this.customTxhaxVal = '1b872f4c434f1d41b92fcf51cf9ac0d34c4b4ea1c4119407ad9e091c9ba8c323'
      this.customTxhaxVal = this.customTxhaxVal.replace(/\s/g, '')
      this.customTxhaxVal = this.validTxHax(this.customTxhaxVal)
      this.$socket.emit('lockin', {
        hash: this.customTxhaxVal,
        dcrmAddress: this.selectData.dcrmAddress,
        coin: this.selectData.ERC20coin
      })
    },
    getElDialogView () {
      this.modalClick()
    },
    modalClick () {
      this.$router.push("/LILO/lockIn")
      this.privateSureVisible = false
    },
    getSignData (data) {
      if (data) {
        this.dataPage.serializedTx = data
        this.sendAmoundInfo()
      } else {
        this.$message.error(this.$t('ERROR_TIP').TIP_6)
      }
      this.privateSureVisible = false
    },
    sendAmoundInfo () {
      this.$socket.emit('sendTxns', {
        signSerializedTx: this.dataPage.serializedTx ? this.dataPage.serializedTx : '',
        url: this.$store.state.network.url
      })
    },
    privateSure (data) {
      let _nonceType = 1
      if (this.selectData.ERC20coin === 'BTC') {
        _nonceType = 0
      }
      console.log(data)
      this.dataPage.to_value = data.value
      this.dataPage.hash = data.hash
      this.$socket.emit('base', {
        from: this.$store.state.address,
        to: '0x00000000000000000000000000000000000000dc',
        url: this.$store.state.network.url,
        coin: this.selectData.ERC20coin,
        nonceType: _nonceType
      })
    },
    qrcode (cont) {
      this.codeViewVisible = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    copyAddress (id) {
      document.getElementById(id).select()
      document.execCommand("Copy")
      this.$message({
        message: this.$t('SUCCESS_TIP').TIP_0,
        type: 'success'
      })
    },
    getAll () {
      if (!this.selectData.dcrmAddress) {
        return
      }
      this.isRefreshStart = false
      this.$socket.emit('lockInHistory', {
        from: this.walletAddress,
        dcrmAddress: this.selectData.dcrmAddress,
        coin: this.selectData.ERC20coin,
        // from: 'mtjq9RmBBDVne7YB4AFHYCZFn3P2AXv9D5',
        // coin: 'BTC',
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
