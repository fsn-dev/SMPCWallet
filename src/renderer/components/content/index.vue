<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="headerTop_box flex-bc">
      <div class="logo flex-c">
        <router-link :to="token ? (Number(this.safeMode) ? 'person' : 'group') : '/'" class="logoImg flex-c">
          <img src="@etc/img/logo.svg" class="logoImgVisibleLg">
          <img src="@etc/img/logoxs.svg" class="logoImgVisibleXs">
        </router-link>
      </div>

      <div class="flex-c headerTop_account">
        <p class="item" :class="Number(safeMode) === 1 ? 'active' : ''" @click="changeMode('1')">个人账户</p>
        <p class="item" :class="Number(safeMode) === 0 ? 'active' : ''" @click="changeMode('0')">共管账户</p>
      </div>
      <div class="headerTop_setBox flex-ec" id="topSetView">
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
          <li><a class="setBtn flex-c cursorP" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :is-dot="news.t" class="item"><i class="el-icon-bell"></i></el-badge></a></li>
          <li><a class="setBtn flex-c cursorP" @click="toUrl('/gNewsList')" title="共管账户消息"><el-badge :is-dot="news.g" class="item"><i class="el-icon-folder-opened"></i></el-badge></a></li>
          <li><a class="setBtn flex-c cursorP" @click="toUrl('createGroup')" title="创建共管账户"><i class="el-icon-plus"></i></a></li>
          <li><div class="setBtn flex-c cursorP" @click="Refresh" title="刷新"><i class="el-icon-refresh-right"></i></div></li>
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

    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<style lang="scss">
.headerTop_account {
  font-size: 14px;
  .item {
    padding: 0 10px;cursor: pointer;
    &.active {
      background: #0099ff;color:#fff;border-radius: 5px;
    }
  }
}
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
      isRouterAlive: true,
      news: {
        g: false,
        t: false
      },
      intervalSwitch: ''
    }
  },
  watch: {
    address (cur, old) {
      console.log(cur)
      if (cur) {
        this.walletAdressTop = this.$$.cutOut(cur, 6, 5)
      }
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    if (this.address) {
      this.walletAdressTop = this.$$.cutOut(this.address, 6, 5)
    }
    // console.log(this.safeMode)
    // console.log(this.$store.state.safeMode)
    // this.intervalNews()
    // this.intervalSwitch = setInterval(() => {
    //   this.intervalNews()
    // }, 1000 * 5)
  },
  methods: {
    intervalNews () {
      this.$$.getPendingGroup().then(res => {
        if (res.info.length > 0) {
          this.news.g = true
        } else {
          this.news.g = false
        }
      }).catch(err => {
        console.log(err)
        this.news.g = false
      })
      this.$$.getTxnsList().then(res => {
        if (res.info.length > 0) {
          this.news.t = true
        } else {
          this.news.t = false
        }
      }).catch(err => {
        console.log(err)
        this.news.t = false
      })
    },
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
    changeMode (type) {
      if (Number(type)) {
        this.toUrl('/person')
      } else {
        this.toUrl('/group')
      }
      this.$store.commit('setSafeMode', {info: type})
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
    quitMethod () {
      this.$$.quitApp(this)
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalSwitch)
    this.intervalSwitch = null
  }
}

</script>
