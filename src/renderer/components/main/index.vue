<template>
  <div class="boxContent">
    <header class="headerTop_box flex-bc">
      <div class="logo flex-c">
        <router-link :to="token ? '/myAssets' : '/'" class="logoImg flex-c">
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
              <img src="@etc/img/copy2.svg">
            </a>
          </li>
          <li :title="'Give me ' + $$.config.initCoin"><a class="setBtn flex-c cursorP" @click="isFaucetModel = true"><img src="@etc/img/faucet.jpg"></a></li>
          <!-- <li :title="'Backups'"><a class="setBtn flex-c cursorP" @click="tobackupWallet"><img src="@etc/img/Setting2.svg"></a></li>
          <li :title="'Help'"><router-link class="setBtn flex-c" to="/"><img src="@etc/img/Help.svg"></router-link></li> -->
          <li :title="'Refresh'"><div class="setBtn flex-c cursorP" @click="Refresh"><img src="@etc/img/Refresh.svg"></div></li>
          <li :title="'Sign out'"><div class="setBtn flex-c cursorP" @click="quitMethod"><img src="@etc/img/Quit.svg"></div></li>
          
        </ul>
      </div>
    </header>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    
    <section id="boxContent_box" v-if="!address">
      <transition name="fade">
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>

    <section id="boxContent_box" v-if="address">
      <div class="boxConntent1 navBox">
        <nav class="navLeft_box">
          <ul>
            <li><router-link to="/MyAssets" class="item flex-ai-c"><div class="icon"><img src="@etc/img/MyAssets.svg"></div><p>{{$t('NAV').MY_ASSETS}}</p></router-link></li>
            <li><router-link to="/Transfer" class="item flex-ai-c"><div class="icon"><img src="@etc/img/Transfer.svg"></div><p>{{$t('NAV').TRANSFER}}</p></router-link></li>
            <li><router-link to="/LILO" class="item flex-ai-c"><div class="icon"><img src="@etc/img/LILO.svg"></div><p>{{$t('NAV').LILO}}</p></router-link></li>
            <li><router-link to="/DAPP" class="item flex-ai-c"><div class="icon"><img src="@etc/img/DAPP.svg"></div><p>{{$t('NAV').DAPP}}</p></router-link></li>
            <!-- <li><router-link to="/exchangeEnter" class="item flex-ai-c"><div class="icon"><img src="@etc/img/DAPP.svg"></div><p>Exchange</p></router-link></li> -->
          </ul>
        </nav>
        <div class="navContent_box">
          <div style="width:100%;height:100%;position:absolute;top:0;left:0;overflow:auto;overflow-x:hidden;">
            <div style="width:100%;height:100%;position:relative;">
              <transition name="fade">
                <router-view v-if="childRefresh"></router-view>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footerBottom_box flex-c">
      <ul class="flex-c">
        <li><a :href="$$.config.otherUrl.mainNetwork" target="_blank"><img src="@etc/img/logo-white.svg" width="61" height="16"></a></li>
        <li class="center flex-c">
          <a class="mr-10 flex-c" :href="$$.config.otherUrl.github" target="_blank"><img src="@etc/img/GIT.svg" width="16" height="16"></a>
          <a class="flex-c" :href="$$.config.otherUrl.gitter" target="_blank"><img src="@etc/img/GIT2.svg" width="16" height="16"></a>
        </li>
        <li>{{$$.config.copyRight}}</li>
      </ul>
    </footer>

    <el-dialog :title="$t('TITLE').CUSTOM_NODE" :visible.sync="networkVisible" :close-on-click-modal="false" width="30%" center>
      <el-input placeholder="HTTPS://" v-model="network" clearable> </el-input>
      <div class="H20"></div>
      <el-input placeholder="chainId" v-model="chainId" clearable> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomNet">{{$t('BTN').CANCEL}}</el-button>
        <el-button type="primary" @click="customNet">{{$t('BTN').CONFIRM}}</el-button>
      </span>
    </el-dialog>


    <el-dialog :title="$$.config.AppName + 'DCRM Faucet'" :visible.sync="isFaucetModel" :close-on-click-modal="false" width="50%" center>
      <div v-loading="faucetLoading">
        <el-input placeholder="Please enter your account." v-model="faucetVal" :disabled="true" clearable>
          <template slot="prepend">{{$$.config.initCoin}}:</template>
        </el-input>
        <div class="H20"></div>
        <span slot="footer" class="dialog-footer flex-c">
          <el-button @click="isFaucetModel = false">{{$t('BTN').CANCEL}}</el-button>
          <el-button type="primary" @click="faucetModelBtn"> Give me {{$$.config.initCoin}}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
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
      childRefresh: true,
      networkVisible: false,
      chainId: '',
      isSelectOrSet: true,
      isFaucetModel: false,
      faucetVal: '',
      faucetLoading: false
    }
  },
  watch: {
    address (cur, old) {
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
      this.childRefresh = false
			this.$nextTick(() => {
				this.childRefresh = true
			})
    },
    reload () {
			this.isRouterAlive = false
			this.$nextTick(() => {
				this.isRouterAlive = true
			})
    },
    faucetModelBtn () {
      if (!this.faucetVal) {
        this.$message({
          showClose: true,
          message: 'Address is null!',
          type: 'error'
        })
        return
      }
      this.faucetVal = this.faucetVal.replace(/\s/g, '')
      // console.log(this.faucetVal)
      if ('WebSocket' in window) {
        try {
          this.faucetLoading = true
          let ws = new WebSocket(this.$$.config.faucetURL)
          // console.log(ws)
          ws.onopen = () => {
            console.log('connect')
            ws.send(JSON.stringify({address: this.faucetVal, cointype: this.$$.config.initCoin}))
          }
          ws.onmessage = (res) => {
            let data = JSON.parse(res.data)
            if (data.state && data.state === 'ERR') {
              this.$message({
                showClose: true,
                message: data.msg,
                type: 'error'
              })
            } else if (data.state && data.state === 'OK') {
              this.$message({
                showClose: true,
                message: data.msg,
                type: 'error'
              })
              setTimeout(() => {
                this.reload()
              }, 3000)
            }
            // console.log(JSON.parse(res.data))
            this.isFaucetModel = false
            this.faucetLoading = false
          }
          ws.onerror = (err) => {
            console.log(err)
            this.isFaucetModel = false
            this.faucetLoading = false
          }
          ws.onclose = () => {
            console.log('close')
            this.isFaucetModel = false
            this.faucetLoading = false
          }
        } catch (error) {
          this.faucetLoading = false
          this.isFaucetModel = false
          console.log(error)
          this.$message({
            showClose: true,
            message: error.toString(),
            type: 'warning'
          })
        }
      } else {
        alert('您的浏览器不支持 WebSocket!')
      }
    },
    customNet () {
      if (!this.network) {
        this.$message({
          showClose: true,
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
        showClose: true,
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
        showClose: true,
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
