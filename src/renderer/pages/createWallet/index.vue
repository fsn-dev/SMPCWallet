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
    let coinlist = this.$$.coinOtherArr
    const coinArr = [this.$$.config.initCoin, 'BTC', 'ETH', 'TRX', 'BNB', 'MKR', 'GUSD', 'HT', 'BNT']
    for (let i of coinArr) {
      // console.log(i)
      this.iconData.push({
        icon: coinlist[i].logo,
        title: i
      })
    }
    this.$store.commit('storeAddress', '')

    // console.log(this.$$.getCoinInfo('FSN'))
  },
  methods: {
    
  }
}
</script>
