<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="headerTop_box flex-bc">
      <div class="logo flex-c">
        <router-link :to="token ? '/group' : '/'" class="logoImg flex-c">
          <img src="@etc/img/logo.svg" class="logoImgVisibleLg">
          <img src="@etc/img/logoxs.svg" class="logoImgVisibleXs">
        </router-link>
      </div>
      <div id="topSearchView" v-if="isSelectOrSet">
        <div class="flex-ec">
          <div class="headerTop_langBox">
            <el-select v-model="language" size="mini" @change="changLanguage">
              <el-option v-for="item in languageOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="headerTop_serBox">
            <img src="@etc/img/wifi.png" class="wifi">
            <i class="arrow"></i>
            <el-select v-model="network" @change="changNetwork" class="select">
              <el-option v-for="item in networkOPtion" :key="item.url" :label="item.name" :value="item.url" no-data-text="Custom" >
              </el-option>
              <el-option value="https://" label="Custom" ></el-option>
              <el-option value="offLine" label="off-line" ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="headerTop_setBox flex-ec" id="topSetView" v-if="!isSelectOrSet">
        <div class="headerTop_langBox">
          <el-select v-model="language" size="mini" @change="changLanguage">
            <el-option v-for="item in languageOption" :key="item.value" :label="item.label" :value="item.value" >
            </el-option>
          </el-select>
        </div>
        <ul class="flex-ec">
          <li id="copyAddress" @click="copyAddress('addressCopy','copyAddress')" class="cursorP">
            <a class="setBtn flex-ec">
              <el-popover trigger="hover" :content="$t('BTN').COPY_CLIPBOARD">
                <div class="address" slot="reference">{{walletAdressTop}}</div>
              </el-popover>
              <!-- <img src="@etc/img/copy2.svg"> -->
              <i class="el-icon-document"></i>
            </a>
          </li>
          <!-- <li><a class="setBtn flex-c cursorP" @click="isFaucetModel = true"><img src="@etc/img/faucet.jpg"></a></li> -->
          <li><a class="setBtn flex-c cursorP" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :is-dot="isHaveNews" class="item"><i class="el-icon-bell"></i></el-badge></a></li>
          <li><a class="setBtn flex-c cursorP" @click="toUrl('/gNewsList')" title="共管账户消息"><el-badge :is-dot="isHaveNews" class="item"><i class="el-icon-folder-opened"></i></el-badge></a></li>
          <li><a class="setBtn flex-c cursorP" @click="toUrl('createGroup')" title="创建共管账户"><i class="el-icon-plus"></i></a></li>
          <!-- <li :title="'Refresh'"><div class="setBtn flex-c cursorP" @click="Refresh"><img src="@etc/img/Refresh.svg"></div></li> -->
          <li><div class="setBtn flex-c cursorP" @click="Refresh" title="刷新"><i class="el-icon-refresh-right"></i></div></li>
          <!-- <li :title="'Sign out'"><div class="setBtn flex-c cursorP" @click="quitMethod"><img src="@etc/img/Quit.svg"></div></li> -->
          <li><div class="setBtn flex-c cursorP" @click="quitMethod" title="退出"><i class="el-icon-s-unfold"></i></div></li>
        </ul>
      </div>
    </header>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    
    <!-- <section id="boxContent_box" v-if="!address"> -->
    <section id="boxContent_box">
      <transition name="fade">
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>

    <el-dialog :title="$t('TITLE').CUSTOM_NODE" :visible.sync="networkVisible" :close-on-click-modal="false" width="30%" center>
      <el-input placeholder="HTTPS://" v-model="network" clearable> </el-input>
      <div class="H20"></div>
      <el-input placeholder="chainId" v-model="chainId" clearable> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomNet">{{$t('BTN').CANCEL}}</el-button>
        <el-button type="primary" @click="customNet">{{$t('BTN').CONFIRM}}</el-button>
      </span>
    </el-dialog>

    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<style>

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
// import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      walletAdressTop: '',
      language: this.$i18n.locale,
      languageOption: [
        {value: 'en-US', label: 'English'},
        {value: 'zh-CN', label: '中文简体'}
      ],
      network: this.$$.config.serverRPC,
      networkOPtion: require('@etc/js/config/network').net,
      isRouterAlive: true,
      networkVisible: false,
      chainId: '',
      isSelectOrSet: true,
      isHaveNews: false
    }
  },
  watch: {
    address (cur, old) {
      console.log(cur)
      if (cur) {
        this.faucetVal = cur
        this.walletAdressTop = this.$$.cutOut(cur, 6, 5)
        this.isSelectOrSet = false
      } else {
        this.isSelectOrSet = true
      }
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    if (this.address) {
      this.faucetVal = this.address
      
      this.walletAdressTop = this.$$.cutOut(this.address, 6, 5)
      this.isSelectOrSet = false
    } else {
      this.isSelectOrSet = true
    }
    this.setNetwort(this.network)
  },
  methods: {
    Refresh (data) {
      this.isRouterAlive = false
			this.$nextTick(() => {
				this.isRouterAlive = true
			})
    },
    reload () {
			this.isRouterAlive = false
			this.$nextTick(() => {
				this.isRouterAlive = true
			})
    },
    customNet () {
      if (!this.network) {
        this.$message({
          message: 'The URL cannot be null',
          type: 'warning'
        })
        return
      }
      this.$store.commit("storeNetwork", {
        name: "Custom",
        url: this.network,
        chainId: this.chainId
      })
      this.$message({
        message: 'Success',
        type: 'success'
      })
      this.networkVisible = false
    },
    cancelCustomNet () {
      this.networkVisible = false
      this.network = this.$$.config.serverRPC
      this.setNetwort(this.network)
    },
    changNetwork() {
      if (this.network === "https://") {
        this.networkVisible = true
      } else if (this.network === "offLine") {
        this.$$.setCookies(this.$$.config.cookies.safeMode, 1)
      } else {
        this.setNetwort(this.network)
      }
    },
    setNetwort (val) {
      let _net = this.networkOPtion
      for (let i = 0; i < _net.length; i++) {
        if (_net[i].url === val) {
          this.$store.commit("storeNetwork", _net[i])
          break
        }
      }
      // console.log(web3.isConnected())
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand('Copy')
      this.$message({
        message: this.$t('SUCCESS_TIP').TIP_0,
        type: 'success'
      })
    },
    changLanguage (type) {
      if (type) {
        this.language = type
      }
      this.$i18n.locale = this.language
      localStorage.setItem(this.$$.config.AppName + '_WALLET_LANGUAGE_TYPE', this.language)
      // this.changeLang(this.language)
      this.reload()
    },
    tobackupWallet () {
      this.$router.push({
        path: '/importWallet',
        query: {
          isBackup: true
        }
      })
    },
    quitMethod () {
      this.$$.quitApp(this)
    }
  }
}

</script>
