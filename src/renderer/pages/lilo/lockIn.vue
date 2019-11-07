<template>
  <div class="boxConntent1">
    <div class="confirmPage flex-c" v-if="!selectData.isConfirm">
      Please 'Apply Cross-Chain'!
    </div>
    <div class="confirmPage flex-c" v-if="!isSupportCoin">
      {{selectData.coinType}} does not support Deposit!
    </div>
    <div class="receiveContent_box"
        v-loading="loading.screen"
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
              <div class="address" slot="reference">{{$t('BTN').COPY_CLIPBOARD}}</div>
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
              <el-button class="W240 mt-10" @click="getCoinTxn" type="primary" :loading="loading.btn">{{$t('TITLE').LOCKIN}}</el-button>
            </div>
          </div>
        </el-form>
      </div>

      <div class="tableHistory_box" v-if="selectData.isConfirm">
        <hgroup class="tableHistory_title">
          <h3 class="title">{{$t('TITLE').HISTORY}}:</h3>
        </hgroup>
        <div class="tableHistory_table table-responsive" 
          v-loading="loading.history"
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
import {data, computed} from '@/assets/js/pages/txnsPages'
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: "lockIn",
  props: ["selectData"],
  data () {
    return {
      ...data,
      historyData: [],
      dataPage: {},
      codeViewVisible: false,
      privateSureVisible: false,
      activeNames: "",
      customTxhax: false,
      customTxhaxVal: '',
      refreshTable: null,
      isRefreshStart: true,
      isSupportCoin: true,
      coininfo: this.$$.coininfo
    }
  },
  watch: {
    selectData (cur, old) {
      // console.log(cur)
      this.loading.history = true
      this.historyData = []
      this.isSupportCoin = this.selectData.isLockin
      this.getInitData()
    }
  },
  computed: {
    ...computedPub,
    ...computed,
    addressTitle: function () {
      return this.selectData.coinType + " Deposit Address"
    },
  },
  mounted () {
    if (this.selectData) {
      setTimeout(() => {
        this.getInitData()
      }, 100)
    }
    this.rawTx.from = this.address
  },
  methods: {
    getInitData () {
      if (!this.selectData.isConfirm) {
        this.loading.screen = false
        this.loading.history = false
        return
      }
      this.isSupportCoin = this.selectData.isLockin
      if (this.isSupportCoin) {
        // console.log(123)
        this.getAll()
      }
      this.loading.screen = false
    },
    validTxHax (hash, coin) {
      coin = coin ? coin : this.selectData.coinType
      if (typeof this.coininfo[coin] === 'undefined' || !this.coininfo[coin].hashFM) return hash
      if (this.coininfo[coin].hashFM) {
        hash = hash.indexOf(this.coininfo[coin].hashFM) === 0 ? hash : (this.coininfo[coin].hashFM + hash)
      }
      return hash
    },
    getCoinTxn () {
      event.preventDefault()
      this.loading.btn = true
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
        from: this.address,
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
