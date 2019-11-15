<template>
  <div class="supCoinView_container">
    <div class="walletBtn_box">
      <ul>
        <li>
          <router-link to="/createWallet" class="btnStyle btnBlue flex-c">
          <div class="icon">
            <img src="@etc/img/pageWhite.svg">
            </div>{{$t('BTN').REGISTER}}
          </router-link>
        </li>
        <li>
          <router-link to="/importWallet" class="btnStyle btnWhite flex-c">
          <div class="icon">
            <img src="@etc/img/Importwallet-blue.svg">
            </div>{{$t('BTN').LOGIN}}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="supCoinView_box">
      <hgroup class="supCoinView_title">
        <h3 class="title">{{$t('TITLE').COIN_SUPPORTED}}</h3>
      </hgroup>
      <div class="supCoinView_list">

        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" v-for="item in iconData" :key="item.index" class="item">
            <div class="iconImg">
              <img :src="item.icon">
            </div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="line"></div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div id="code"></div>

  </div>
</template>

<style>

</style>

<script>
export default {
  name: "index",
  data () {
    return {
      iconData: [],
    }
  },
  mounted () {
    let coinlist = this.$$.coininfo
    const coinArr = [this.$$.config.initCoin, 'BTC', 'ETH', 'TRX', 'BNB', 'MKR', 'GUSD', 'HT', 'BNT']
    for (let i of coinArr) {
      // console.log(i)
      this.iconData.push({
        icon: coinlist[i].logo,
        title: i
      })
    }
    // this.$store.commit('storeAddress', '')
    this.$$.quitApp(this)
    // console.log(this.$$.web3)
    // console.log(this.$$.web3.isConnected())
    // setTimeout(() => {
    //   console.log(this.$$.web3.dcrm.reqDcrmAddr('0x006654AAe27394f0C78d2c642Eb46c28B367bc6F', 'ALL'))
    //   console.log(this.$$.web3.dcrm.getNonce('0x006654AAe27394f0C78d2c642Eb46c28B367bc6F', 'ETH'))
    //   console.log(this.$$.web3.dcrm.getBalance('0x006654AAe27394f0C78d2c642Eb46c28B367bc6F', 'ETH'))
    //   console.log(this.$$.web3.dcrm.lockOut('0xf8a101840d3ed78e8484746b8e9400000000000000000000000000000000000000dc80b83b4c4f434b4f55543a3078303036363534414165323733393466304337386432633634324562343663323842333637626336303a313030303a4554481ba0a1940ce4d7a3a4c9621bfb6476a69ed9b47445448ed9e01eecd11429cf6b9614a05b6660f8f0e119c4bedae5f083480ed47eff6ae16877c685c81d803e64bfccf0'))
    // }, 10000)
    // console.log(this.$$.getCoinInfo('FSN'))
  },
  methods: {
    
  }
}
</script>
