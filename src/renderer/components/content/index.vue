<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="header-top-box flex-bc">
      <div class="header-logo flex-c">
        <router-link :to="token ? (Number(this.safeMode) ? 'person' : 'group') : '/'" class="logoImg flex-sc">
          <img src="@etc/img/logo/logo.svg" class="logoImgVisibleLg">
          <p class="appTitle ml-10 flex-c font18"><span>SMPC</span> Wallet</p>
        </router-link>
      </div>

      <div class="flex-c headerTop_account">
        <p class="item" :class="Number(safeMode) === 1 ? 'active' : ''" @click="changeMode('1')">个人账户</p>
        <p class="item" :class="Number(safeMode) === 0 ? 'active' : ''" @click="changeMode('0')">共管账户</p>
      </div>
      <div class="header-top-set-box flex-ec">
        <div class="header-top-nav">
          <ul class="flex-c">
            <li class="item" @click="toUrl('/gNewsList')" title="共管账户消息"><el-badge :is-dot="news.g" class="item">活动任务</el-badge></li>
            <li class="item" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :is-dot="news.t" class="item">消息通知</el-badge></li>
          </ul>
        </div>
        <div class="header-top-lang">
          <el-select v-model="language" size="mini" @change="changLanguage">
            <el-option v-for="item in languageOption" :key="item.value" :label="item.label" :value="item.value" >
            </el-option>
          </el-select>
        </div>
        <div class="header-top-dn cursorP" @click="changeDn">
          <el-input v-model="dayAndNight" v-show="false"></el-input>
          <span class="round" :class="Number(dayAndNight) ? 'el-icon-sunny day' : 'el-icon-moon night'"></span>
          <!-- <span class="round night el-icon-moon" v-if="!Number(dayAndNight)"><img src=""></span> -->
        </div>
        <div class="header-top-user">
          <div class="headImg" @click="isUserView = !isUserView"><img src="@etc/img/logoxs.svg"></div>
          <ul class="user-list" v-show="isUserView">
            <li class="item" @click="toUrl('createGroup')" title="创建共管账户"><i class="el-icon-plus mr-5"></i>创建共管账户</li>
            <li class="item" @click="quitMethod" title="退出"><i class="el-icon-s-unfold mr-5"></i>退出</li>
            <!-- <li class="item"><div class="setBtn" @click="Refresh" title="刷新"><i class="el-icon-refresh-right"></i></div></li>
            <li class="item"><div class="setBtn" @click="quitMethod" title="退出"><i class="el-icon-s-unfold"></i></div></li> -->
          </ul>
        </div>
        <ul class="flex-ec">
          <!-- <el-menu>
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu> -->
          <!-- <li id="copyAddress" @click="copyAddress('addressCopy','copyAddress')" class="cursorP">
            <a class="setBtn flex-ec">
              <el-popover trigger="hover" :content="$t('BTN').COPY_CLIPBOARD">
                <div class="address" slot="reference">{{walletAdressTop}}</div>
              </el-popover>
              <i class="el-icon-document"></i>
            </a>
          </li> -->
          <!-- <li><a class="setBtn flex-c cursorP" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :is-dot="news.t" class="item"><i class="el-icon-bell"></i></el-badge></a></li>
          <li><a class="setBtn flex-c cursorP" @click="toUrl('/gNewsList')" title="共管账户消息"><el-badge :is-dot="news.g" class="item"><i class="el-icon-folder-opened"></i></el-badge></a></li> -->
          <!-- <li><a class="setBtn flex-c cursorP" @click="toUrl('createGroup')" title="创建共管账户"><i class="el-icon-plus"></i></a></li>
          <li><div class="setBtn flex-c cursorP" @click="Refresh" title="刷新"><i class="el-icon-refresh-right"></i></div></li>
          <li><div class="setBtn flex-c cursorP" @click="quitMethod" title="退出"><i class="el-icon-s-unfold"></i></div></li> -->
        </ul>
      </div>
    </header>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    
    <!-- <section id="boxContent_box" v-if="!address"> -->
    <section id="boxContent_box" @click="changeUserView">
      <transition name="fade">
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>

    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<style lang="scss">
.header-top-box {
  width:100%;height:size(70);position:absolute;top:0;left:0;padding:0 2%;background: #f1f1f1;z-index: 9;
  .header-logo {
    min-width:40px;max-width:350px;height: size(35);
    .logoImg{
      width:100%;height: 100%;
      img {
        height: 100%
      }
    }
  }
  .header-top-set-box {
    .header-top-nav {
      font-size: $text-normal;color: $color-black;font-weight:bold;
      .item {
        padding: size(8) size(8);
      }
    }
  }
  .header-top-lang {
    width: 80px;
    .el-input__inner{
      border:none;padding-left: 0;background: none;
    }
  }
  .header-top-dn {
    $dn-h: 28;
    width: size(50);height: size($dn-h);border: size(1) solid #ddd;border-radius: size(15);position: relative;margin: 0 size(15);
    .round {
      width: size($dn-h - 2);height: size($dn-h - 2);line-height: size($dn-h - 2);text-align:center;display: inline-block;background: #fff;color: $color-primary;border-radius: 100%;position: absolute;top:size(0);
    }
    .day {
      left: 0;
    }
    .night {
      right: 0;
    }
  }
  .header-top-user {
    $hImg: 30;
    position: relative;
    .headImg {
      width: size($hImg);height: size($hImg);border-radius: 100%;background: $color-primary;cursor: pointer;
    }
    .user-list {
      width: size(200);position: absolute;top: size($hImg + 10);right: size(8);background: #fff;padding: size(8) size(0);border-radius: size(3);
      .item {
        padding: size(8) size(15);text-align: left;cursor: pointer;font-size: $text-normal;line-height: size(21);
        &:hover {
          background: #f1f1f1;
        }
      }
    }
  }
}



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
      intervalSwitch: '',
      isUserView: false,
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
    // console.log(this.dayAndNight)
    // console.log(this.safeMode)
    // console.log(this.$store.state.safeMode)
    // this.intervalNews()
    // this.intervalSwitch = setInterval(() => {
    //   this.intervalNews()
    // }, 1000 * 5)
  },
  methods: {
    changeUserView () {
      this.isUserView = false
    },
    changeDn () {
      // console.log(this.dayAndNight)
      if (Number(this.dayAndNight)) {
        this.$store.commit('setDayAndNight', {info: '0'})
      } else {
        this.$store.commit('setDayAndNight', {info: '1'})
      }
      this.Refresh()
    },
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
