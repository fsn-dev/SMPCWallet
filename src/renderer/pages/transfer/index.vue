<template>
  <div style="background:#fff">
    <div class="transferBtn_box flex-bc">
      <div class="transferBtn_btn flex-sc">
        <a @click="toUrl('/Transfer')" class="tranBtn flex-c cursorP" :class="navFlag ? 'currBg' : ''" id="tabBtnFirst">
          {{$t('BTN').RECEIVE}}
          <i class="arrow"></i>
        </a>
        <a @click="toUrl('/Transfer/tranSend')" class="tranBtn flex-c cursorP" :class="navFlag ? '' : 'currBg'">
          {{$t('BTN').SEND}}
          <i class="arrow"></i>
        </a>
      </div>
      <div class="biticonSelect_box">
        <div class="logo">
          <img src="@etc/img/Fusion.svg">
        </div>
        <div class="arrow flex-c">
          <i class="i"></i>
        </div>
        <!-- <select class="select" v-model="selectVal">
          <option v-for="(item, index) in SetcoinAndUrl" :key="index" :value="item.coin">{{item.coin}}</option>
        </select> -->
        <el-select v-model="selectVal" placeholder="" class="select">
          <el-option
            v-for="item in SetcoinAndUrl"
            :key="item.coinType"
            :label="item.coinType"
            :value="item.ERC20coin">
            <span style="float: left">{{ item.coinType }}</span>
            <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.coin }}</span> -->
            <div class="isErc20 fr isErc20_1" v-if="item.isERC20" :title="item.ERC20coin"> ERC20 </div>
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="transferCont_absolute">
      <div class="transferCont_box">
        <transition name="fade">
          <router-view :selectData="coinDataPage"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Transfer",
  data () {
    return {
      selectVal: "",
      SetcoinAndUrl: [],
      coinDataPage: {},
      coininfo: this.$$.coininfo,
      navFlag: true
    }
  },
  watch: {
    selectVal (cur, old) {
      this.$router.push({path: this.$route.path, query: {currency: this.selectVal}})
      this.getCoinInfo(cur)
    }
  },
  mounted () {
    this.pageRefresh()
    // console.log(this.$$.config.initCoin)
    this.selectVal = this.$route.query.currency ? this.$route.query.currency : this.$$.config.initCoin
    if (!this.selectVal) {
      this.getCoinInfo(this.selectVal)
    }
  },
  updated () {
    this.pageRefresh()
  },
  methods: {
    toUrl (url) {
      this.$router.push({path: url, query: {currency: this.selectVal}})
    },
    pageRefresh () {
      if (location.href.indexOf("tranSend") === -1) {
        this.navFlag = true
      } else {
        this.navFlag = false
      }
    },
    getCoinInfo (coin) {
      this.SetcoinAndUrl = []
      let coinlist = this.$store.state.coininfoArr.length > 0 ? this.$store.state.coininfoArr : []
      // console.log(coinlist)
      coinlist = [
         {
          coinType: 'FSN',
          ERC20coin: 'FSN',
          isERC20: 0,
          address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
          limit: 2,
          balance: 100,
          isConfirm: 1
        },
        {
          coinType: 'BTC',
          ERC20coin: 'BTC',
          isERC20: 0,
          address: '12dRugNcdxK39288NjcDV4GX7rMsKCGn6B',
          limit: 2,
          balance: 100,
          isConfirm: 1
        },
      ]
      if (coinlist.length > 0) {
        for (let i = 0; i < coinlist.length; i++) {
          // this.SetcoinAndUrl.push({coin: coinlist[i].coinType})
          this.SetcoinAndUrl.push({
            coinType: coinlist[i].coinType,
            isERC20: coinlist[i].isERC20,
            ERC20coin: coinlist[i].ERC20coin
          })
          if (coinlist[i].ERC20coin === coin) {
            this.coinDataPage = coinlist[i]
            this.coinDataPage.limit = this.coininfo[coin] && this.coininfo[coin].limit ? this.coininfo[coin].limit : 0
            this.coinDataPage.isConfirm = coinlist[0].isConfirm
          }
        }
      } else {
        let coinArr = this.$$.coininfo
        for (let name in coinArr) {
          this.SetcoinAndUrl.push({
            coin: name
          })
          if (name === coin) {
            this.coinDataPage = {
              coinType: coin,
              address: '',
              limit: this.coininfo[coin] && this.coininfo[coin].limit ? this.coininfo[coin].limit : 0,
              balance: 0
            }
          }
        }
      }
      // console.log(this.coinDataPage)
    }
  }
}
</script>
