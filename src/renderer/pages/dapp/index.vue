<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{$t('NAV').DAPP}}</h1>
    </div>

    <div class="contView_box">
      <div class="dappView_list">
        <ul>
          <li v-for="item in iconData" :key="item.index" @click="openUrl(item.url, item.type)">
            <div class="iconImg"><img :src="item.icon"></div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="line"></div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "DAPP",
  data () {
    return {
      iconData: []
    }
  },
  computed: {
    address () {
      return this.$store.state.address
    },
    loginState () {
      return this.$store.state.loginState
    }
  },
  mounted () {
    console.log(this.address)
    this.iconData = [
      {icon: require("@etc/img/dex.svg"), title: "DEX", url: this.$$.config.dexappURL + '?address=' + this.address + '&loginState=' + this.loginState, type: 1},
      {icon: require("@etc/img/mining.svg"), title: "Mining"},
      {icon: require("@etc/img/TimeToken.svg"), title: "Time Token"},
      {icon: require("@etc/img/kyc.svg"), title: "KYC/AML"},
      {icon: require("@etc/img/pay.svg"), title: "Payment"},
      {icon: require("@etc/img/bond.svg"), title: "Bond"},
      {icon: require("@etc/img/abs.svg"), title: "ABS"},
      {icon: require("@etc/img/loan.svg"), title: "Loan"},
      {icon: require("@etc/img/dark.svg"), title: "Dark Pool"},
      {icon: require("@etc/img/etf.svg"), title: "ETF"},
      {icon: require("@etc/img/lssue.svg"), title: "Issue Asset"},
      {icon: require("@etc/img/stable.svg"), title: "Stable Coin"},
      {icon: require("@etc/img/custudy.svg"), title: "Custody"},
      {icon: require("@etc/img/lns.svg"), title: "Insurance"},
      {icon: require("@etc/img/MORE.svg"), title: "More"}
    ]
  },
  methods: {
    openUrl (url, type) {
      if (type === 1) {
        window.open(url)
      } else {
        this.$message.error(this.$t('ERROR_TIP').TIP_1)
      }
    }
  }
}
</script>
