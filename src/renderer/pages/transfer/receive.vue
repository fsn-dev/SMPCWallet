<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <el-form label-position="top" label-width="80px" @submit.native.prevent>
          <el-form-item :label="addressTitle">
            <el-input v-model="walletAddress" id="walletAdressHide" class="font24" :readonly	="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="receiveAddress_btn flex-c" id="receiveAddressBtn">
          <button class="btn blue flex-c" @click="qrcode(walletAddress)">
            <div class="icon">
              <img src="@etc/img/QRcode.svg">
            </div>
            {{$t('BTN').SHOW_QR_CODE}}
          </button>
          <button
            class="btn cyan flex-c"
            @click="copyAddress('walletAdressHide', 'receiveAddressBtn')"
          >
            <div class="icon"><img src="@etc/img/copy.svg"></div>
            <el-popover
              trigger="hover"
              :content="$t('BTN').COPY_CLIPBOARD">
              <div class="addreess" slot="reference">{{$t('BTN').COPY_CLIPBOARD}}</div>
              <!-- <el-button slot="reference">hover 激活</el-button> -->
            </el-popover>
            <!-- {{$t('BTN').COPY_CLIPBOARD}} -->
          </button>
        </div>
      </div>

      <div class="tableHistory_box" v-if="selectData.isConfirm || selectData.coinType === $$.config.initCoin">
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
            <el-table-column :label="$t('THEAD').PUBLIC.AMOUNT" prop="value" width="120">
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
                      <li>{{$t('LABEL').ADDRESS}}：{{scope.row.from}}</li>
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

      <el-dialog
        :visible.sync="codeViewVisible"
        width="380px"
        >
        <div class="qrcodeCont_box">
          <div id="qrcode" class="flex-c"></div>
          <div class="qrcodeCont_title">
            <h3>{{$t('TITLE').YOUR_ADDREAA}}</h3>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "receive",
  props: ["selectData"],
  data () {
    return {
      // addressTitle: "",
      walletAddress: "",
      historyData: [],
      refreshTable: null,
      codeViewVisible: false,
      historyLoading: true,
      activeNames: "",
      isRefreshStart: true,
      pageInfo: {
        pageNum: 1,
        total: 0,
        pageSize: 20,
      }
      // count: 0
    }
  },
  sockets: {
    receiveHistory (res) {
      // console.log(res)
      this.historyData = []
      if (res.msg === "Success" && res.info.length > 0) {
        for (let i = 0; i < res.info.length; i++) {
          if (res.info[i].coinType === this.selectData.ERC20coin && res.info[i].hash) {
            res.info[i].status = this.$$.changeState(res.info[i].status)
            res.info[i].date = this.$$.timeChange({date: res.info[i].timestamp, type:"yyyy-mm-dd hh:mm"})
            this.historyData.push(res.info[i])
          }
        }
        this.pageInfo.total = Math.ceil(res.total / this.pageInfo.pageSize)
      }
      this.historyLoading = false
      this.isRefreshStart = true
      clearTimeout(this.refreshTable)
      this.refreshTable = setTimeout(() => {
        this.getSendHistory()
      }, 1000 * Number(this.$$.config.refreshDataTime))
    }
  },
  watch: {
    selectData (cur, old) {
      console.log(cur)
      this.historyLoading = true
      this.getSendHistory()
    }
  },
  computed: {
    addressTitle () {
      return this.selectData.coinType + " Receiving Address"
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    if (this.selectData.coinType) {
      this.getSendHistory()
    }
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
    qrcode (cont) {
      this.codeViewVisible = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand("Copy")
      this.$message({
        message: this.$t('SUCCESS_TIP').TIP_0,
        type: 'success'
      })
    },
    getSendHistory () {
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
      this.$socket.emit('receiveHistory', {
        status: 1,
        to: this.walletAddress,
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
