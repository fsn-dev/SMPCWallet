<template>
  <div style="background:#fff;min-height:100%"
        v-loading="loading.screen"
        element-loading-text="Loading……">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{$t('NAV').MY_WALLET}}</h1>
      <h2 class="contentHeader_title">$ {{$$.thousandBit(myAssetsTotal, 2)}}</h2>
    </div>

    <div class="myAssetsSear_box flex-bc">
      <!-- <el-button type="primary" size="mini" @click="applyAll">Application For All</el-button> -->
      <!-- <div style="opacity: 0.5;font-size:14px;">Address Generation . . .</div> -->
      <div v-if="isWaiting" style="opacity: 0.5;font-size:14px;">Address Generation . . .</div>
      <div v-if="!isWaiting">
        <div v-if="isConfirmCount"></div>
        <el-button type="primary" size="mini" @click="confirmAll" :disabled="publicKey === '' ? true : false" v-if="!isConfirmCount">Apply Cross-Chain</el-button>
      </div>
      <div class="myAssetsSear_input">
        <input type="text" :placeholder="$$.config.initCoin" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="@etc/img/search.png"></div></div>
      </div>
    </div>

    <div class="myAssetsTable_box">
      <el-table :data="bitIconTypeSearch" style="width: 100%" :height="tableH" empty-text="Null">
        <el-table-column :label="$t('THEAD').COIN" min-width="180">
          <template slot-scope="scope">
            <div class="flex-sc relative">
              <!-- {{scope.row.logo}} -->
              <div class="logoT" v-if="scope.row.logo"><img :src="scope.row.logo"></div>
              <div v-if="!scope.row.logo" class="coinChat">
                {{scope.row.coinType.split('')[0]}}
              </div>
              <div class="title">
                <!-- <h2 class="span" v-html="scope.row.nameSimplicity"></h2>
                <h3 class="p" v-html="scope.row.nameFull"></h3> -->
                <h2 class="span" v-html="scope.row.coinType" :style="scope.row.coinType.length > 10 ? 'font-size:13px' : ''"></h2>
                <!-- <h3 class="p" v-html="scope.row.coin"></h3> -->
              </div>
              <div class="isErc20" v-if="scope.row.isERC20" :title="scope.row.ERC20coin"> ERC20 </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('THEAD').ASSETS.AVAILABLE_BALANCE" prop="availbleBalance" width="200"></el-table-column> -->
        <el-table-column :label="$t('THEAD').ASSETS.AVAILABLE_BALANCE" min-width="160">
          <template slot-scope="scope">
            {{Number(scope.row.available) === 0 ? '0.00' : $$.thousandBit(scope.row.available, 'no')}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('THEAD').ASSETS.FREEZE" min-width="160">
          <template slot-scope="scope">
            {{Number(scope.row.freeze) === 0 ? '0.00' : $$.thousandBit(scope.row.freeze, 'no')}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('THEAD').ASSETS.TOTAL_BALANCE" min-width="140">
          <template slot-scope="scope">
            <span class="span">{{Number(scope.row.balance) === 0 ? '0.00' : $$.thousandBit(scope.row.balance, 'no')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('THEAD').ASSETS.DOLLAR" min-width="160">
          <template slot-scope="scope">
            <!-- {{typeof scope.row.dollar}} -->
            $ {{
                isNaN(scope.row.dollar) && typeof scope.row.dollar !== 'undefined' ? scope.row.dollar : (
                  Number(scope.row.dollar) === 0 ? '0.00' : $$.thousandBit(scope.row.dollar, 2) 
                )
              }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('THEAD').ACTIONS" width="200">
          <template slot-scope="scope">
            <div class="flex-sc">
              <div v-if="isConfirmCount || scope.row.coinType === $$.config.initCoin">
                <!-- <router-link :to="{path:'/Transfer/tranReceive', query: {currency: scope.row.coin}}" class="setBtn" title="Receive">R</router-link> -->
                <router-link :to="{path:'/Transfer/tranSend', query: {currency: scope.row.ERC20coin}}" class="setBtn" title="Send">{{$t('BTN').SEND}}</router-link>
                <router-link :to="{path:'/LILO', query: {currency: scope.row.ERC20coin}}" class="setBtn" title="Deposit" v-if="scope.row.coinType !== $$.config.initCoin && scope.row.isLockin">{{$t('TITLE').LOCKIN}}</router-link>
                <router-link :to="{path:'/LILO/lockOut', query: {currency: scope.row.ERC20coin}}" class="setBtn" title="Withdraw" v-if="scope.row.coinType !== $$.config.initCoin && scope.row.isLockout">{{$t('TITLE').LOCKOUT}}</router-link>
              </div>
              <div v-if="!isConfirmCount && scope.row.coinType !== $$.config.initCoin">
                <div v-if="!scope.row.isConfirm" style="opacity: 0.5">
                  <a class="setBtn" title="Send">{{$t('BTN').SEND}}</a>
                  <a class="setBtn" title="Deposit" v-if="scope.row.coin !== $$.config.initCoin && scope.row.isLockin">{{$t('TITLE').LOCKIN}}</a>
                  <a class="setBtn" title="Withdraw" v-if="scope.row.coin !== $$.config.initCoin && scope.row.isLockout">{{$t('TITLE').LOCKOUT}}</a>
                </div>
                <!-- <a class="setBtn" style="opacity: 0.4">{{$t('BTN').APPLY_CROSS_CHAIN}}</a> -->
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="$t('BTN').UNLOCK" :visible.sync="privateSureVisible" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="privateSureVisible"></pwdSure>
    </el-dialog>

    <el-dialog :title="$t('TITLE').REQUEST_CONFIRM" :visible.sync="confirmDcrmVisible" width="60%" :before-close="modalClick">
      <div class="">
        {{$t('WARNING_TIP').TIP_1}}
      </div>
      <span slot="footer" class="dialog-footer">
        <button type="button" class="btn btn-default" @click="modalClick">{{$t('BTN').GET_OUT}}</button>
        <button type="button" class="btn btn-primary" @click="sendRawTransion(confirmData)">{{$t('BTN').YES_SURE}}</button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
/* .isErc20 {position:absolute;top:-5px;right: 0;font-size: 10px;color:#fff;font-style: italic;padding:0 5px;background: #004a7c;border-radius: 5px;transform: scale(0.6);} */
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: "myAssets",
  // inject: ['reload'],
  data () {
    return {
      loading: {
        screen: true
      },
      myAssetsTotal: 0.00,
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      dataPage: {},
      searchContent: "",
      refreshTable: "",
      confirmData: "",
      privateSureVisible: false,
      confirmDcrmVisible: false,
      count: 0,
      tableH: 0,
      publicKey: '',
      isConfirmCount: false,
      isWaiting: false,
      coininfo: this.$$.coininfo
    }
  },
  sockets: {
    getCoinDollar (res) {
      // console.log(res)
      if (res.length > 0) {
        this.$store.commit("storeCoinDollarArr", res)
      } else {
        this.$store.commit("storeCoinDollarArr", [])
      }
    },
    getDollar (res) {
      // console.log(res)
      if (res.length > 0) {
        this.$store.commit("storeCoinDollarArr", res)
      } else {
        this.$store.commit("storeCoinDollarArr", [])
      }
    }
  },
  watch: {
    bitIconTypeData (cur, old) {
      this.$store.commit('storeCoininfoArr', cur)
      this.searchInput()
    },
    coinDollarArr (cur) {
      this.$socket.emit('queryAccount', {
        address: this.address,
        url: this.$store.state.network.url
      })
    }
  },
  computed: {
    ...computedPub,
    coinDollarArr () {
      return this.$store.state.coinDollarArr
    }
  },
  mounted () {
    if (!Number(this.$$.getCookies(this.$$.config.cookies.safeMode))) {
      // this.$socket.emit('queryAccount', {
      //   address: this.address,
      //   url: this.$store.state.network.url
      // })
      // this.$socket.emit('getCoinDollar')
    }
    else {
      this.loading.screen = false
    }
    this.loading.screen = false
  },
  updated () {
    this.tableHeight()
    window.onresize = () => {
      this.tableHeight()
    }
  },
  methods: {
    setDollar (coin, index) {
      for (let obj of this.coinDollarArr) {
        if (obj.coin === coin) {
          return obj
        }
      }
      return ''
    },
    confirmAll () {
      if (!this.publicKey) {
        this.$message.error('Coin is null!')
        return
      }
      this.privateSure ('ALL', this.publicKey)
    },
    tableHeight () {
      let headerH= '', countH= '', searchH= '', footH= '', bodyH = ''
      try {
        headerH = document.querySelector('.headerTop_box').clientHeight
        countH = document.querySelector('.contentHeader_box').clientHeight
        searchH = document.querySelector('.myAssetsSear_box').clientHeight
        footH = document.querySelector('.footerBottom_box').clientHeight
        bodyH = document.body.clientHeight
      } catch (error) {
        // console.log(error)
      }
      this.tableH = bodyH - (headerH + countH + searchH + footH) - 40
    },
    modalClick () {
      this.$router.push("/MyAssets")
      this.privateSureVisible = false
      this.confirmDcrmVisible = false
    },
    searchInput () {
      this.bitIconTypeSearch = []
      let searchTxt = this.searchContent ? this.searchContent.toLowerCase() : ''
      this.myAssetsTotal = 0
      this.bitIconTypeSearch = this.bitIconTypeData.filter(item => {
        // console.log(this.myAssetsTotal)
        if (searchTxt === "") {
          this.myAssetsTotal += item.dollar && !isNaN(item.dollar) ? Number(item.dollar) : 0
          return item
        } else {
          if (!isNaN(searchTxt)) {
            searchTxt = this.$$.thousandBit(searchTxt, "no")
          }
          item.dollar = item.dollar ? item.dollar : ''
          if (
               item.coinType.toLowerCase().indexOf(searchTxt) !== -1
            || item.balance.toString().indexOf(searchTxt) !== -1
            || item.freeze.toString().indexOf(searchTxt) !== -1
            || item.dollar.toString().indexOf(searchTxt) !== -1
            || item.ERC20coin.toLowerCase().indexOf(searchTxt) !== -1
          ) {
            this.myAssetsTotal += item.dollar ? Number(item.dollar) : 0
            // console.log(item)
            return item
          }
        }
      })
    },
    privateSure (coin, data) {
      this.dataPage = {
        coin: coin,
        sendType: "MYWALLET",
        from: this.address,
        data: "DCRMCONFIRMADDR:" + data + ":" + coin
      }
      this.privateSureVisible = true
    },
    getSignData (data) {
      console.log(data)
      if (data.signTx) {
        this.sendRawTransion(data.signTx)
      } else {
        this.$message.error(this.$t('ERROR_TIP').TIP_6)
      }
      this.privateSureVisible = false
    },
    sendRawTransion (signTx) {
      this.$$.sendTxns(signTx).then(res => {
        this.$message({ message: 'Success', type: 'success' })
      }).catch(err => {
        this.$message.error(res.error)
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.refreshTable)
    this.refreshTable = null
  }
}
</script>
