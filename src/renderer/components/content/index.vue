<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="header-top-box flex-bc">
      <div class="header-logo flex-c">
        <router-link :to="typeof token !== 'undefined' ? (Number(this.safeMode) ? '/person' : '/group') : '/'" class="logoImg flex-sc">
          <img src="@etc/img/logo/logo.svg" class="logoImgVisibleLg">
          <p class="appTitle ml-10 flex-c font18" v-html="$t('title').walletTitle"></p>
        </router-link>
      </div>

      <div class="flex-c header-top-account">
        <p class="item" :class="Number(safeMode) === 1 ? 'active' : ''" @click="changeMode('1')">{{$t('btn').person}}</p>
        <p class="item" :class="Number(safeMode) === 0 ? 'active' : ''" @click="changeMode('0')">{{$t('btn').group}}</p>
      </div>
      <div class="header-top-set-box flex-ec">
        <div class="header-top-nav">
          <ul class="flex-c HH100">
            <li class="item flex-c" :class="newsActive === 1 ? 'active' : ''" @click="toUrl('/waitNews')" title="待办"><el-badge :value="news.g > 0 ? news.g : ''" :max="99" class="flex-c">待办</el-badge></li>
            <!-- <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="toUrl('/createGroup')" title="创建共管账户">创建共管账户</li> -->
            <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="drawer.create = true" title="创建共管账户">创建共管账户</li>
            <!-- <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :value="news.t > 0 ? news.t : ''" :max="99" class="flex-c">通知</el-badge></li> -->
          </ul>
        </div>
        <div class="header-top-lang">
          <el-select v-model="language" size="mini" @change="changLanguage">
            <el-option v-for="item in languageOption" :key="item.value" :label="item.label" :value="item.value" >
            </el-option>
          </el-select>
        </div>
        <div class="header-top-refresh cursorP" @click="Refresh" title="刷新">
          <i class="el-icon-refresh-right"></i>
        </div>
        <div class="header-top-dn cursorP" @click="changeDn">
          <span class="round" :class="Number(dayAndNight) ? 'el-icon-sunny day' : 'el-icon-moon moon'"></span>
        </div>
        
        <div class="header-top-user">
          <!-- <div class="headImg box_Wshadow1" @click="isUserView = !isUserView"><img src="@etc/img/logoxs.svg"></div> -->
          <div class="headImg box_Wshadow1" @click="isUserView = !isUserView"><img :src="headerImg"></div>
          <ul class="user-list box_Wshadow1" v-show="isUserView">
            <li class="item" @click="toUrl('createGroup');changeUserView()" title="创建共管账户"><i class="el-icon-plus mr-5"></i>创建共管账户</li>
            <li class="item" @click="changeMode('1')" title="个人账户"><i class="el-icon-user mr-5"></i>个人账户</li>
            <li class="item" @click="changeMode('0')" title="共管账户"><i class="el-icon-money mr-5"></i>共管账户</li>
            <li class="item" @click="quitMethod" title="安全退出"><i class="el-icon-s-unfold mr-5"></i>安全退出</li>
          </ul>
        </div>
      </div>
    </header>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    
    <section id="boxContent_box" @click="changeUserView">
      <transition name="fade">
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>

    
    <w-drawer v-model="drawer.create" v-if="drawer.create">
      <create-account :formBoxClass="false"></create-account>
    </w-drawer>
    <w-drawer v-model="drawer.user" v-if="drawer.user">

    </w-drawer>
  </div>
</template>

<style lang="scss">

.header-top-box {
  width:100%;height:size(70);position:absolute;top:0;left:0;padding:0 2%;background: #f1f1f1;z-index: 2001;
  .header-logo {
    min-width:40px;max-width:350px;height: size(35);
    .logoImg{
      width:100%;height: 100%;
      img {
        height: 100%
      }
    }
  }
  .header-top-account {
    font-size: 14px;
    .item {
      padding: 0 10px;cursor: pointer;
      &.active {
        background: $color-primary;color:#fff;border-radius: 5px;
      }
    }
  }
  .header-top-set-box {
    height: 100%;
    .header-top-nav {
      height: 100%;font-size: $text-normal;color: $color-black;font-weight:bold;margin-right:size(100);
      .item {
        height: 100%;padding: size(8) size(20);cursor: pointer;
        &.active {
          background: $color-primary;color: #fff;
        }
        &:hover {
          background: $color-primary;color: #fff;
        }
      }
    }
    .header-top-lang {
      width: 80px;
      .el-input__inner{
        border:none;padding-left: 0;background: none;color: $color-gray-sm;
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
      .moon {
        right: 0;
      }
    }
    .header-top-user {
      $hImg: 30;
      position: relative;
      .headImg {
        width: size($hImg);height: size($hImg);border-radius: 100%;cursor: pointer;overflow: hidden;
        img {
          height: 100%;
        }
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
}

#boxContent_box{width:100%;position:absolute;top:70px;right:0;bottom:0px;left:0;overflow: auto;overflow-x: hidden;background: #fff;}

.night {
  .header-top-box {
    background: $night-bg-color-sm;
    .header-top-account {
      color: #fff;
    }
    .header-top-set-box {
      .header-top-nav {
        color: #fff;
      }
    }
  }
  #boxContent_box {
    background: $night-bg-color;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import createAccount from '@/pages/group/createGroup'
export default {
  name: 'index',
  provide () {
    return {
      reload: this.Refresh
    }
  },
  data () {
    return {
      language: this.$i18n.locale,
      languageOption: [
        {value: 'en-US', label: 'English'},
        {value: 'zh-CN', label: '中文简体'}
      ],
      isRouterAlive: true,
      news: {
        g: 0,
        t: 0
      },
      intervalSwitch: '',
      isUserView: false,
      newsActive: 0,
      drawer: {
        user: false,
        create: false
      },
      headerImg: ''
    }
  },
  watch: {
    '$route' (cur) {
      // console.log(cur)
      this.newsView(cur)
    },
  },
  computed: {
    ...computedPub
  },
  components: {createAccount},
  mounted () {
    // console.log(this.$route)
    this.newsView(this.$route)
  // console.log(require(this.$$.config.file.img.url + this.address + this.$$.config.file.img.type))
    // console.log(this.$$.config.file.img.url + this.address + this.$$.config.file.img.type)
    this.headerImg = this.$$.config.file.img.url + this.address + this.$$.config.file.img.type
    // console.log(this.dayAndNight)
    // console.log(this.safeMode)
    // console.log(this.$store.state.safeMode)
    // this.intervalNews()
    // this.intervalSwitch = setInterval(() => {
    //   this.intervalNews()
    // }, 1000 * 5)
  },
  methods: {
    newsView (cur) {
      if (cur.path.indexOf('waitNews') !== -1) {
        this.newsActive = 1
      } else if (cur.path.indexOf('createGroup') !== -1) {
        this.newsActive = 2
      } else {
        this.newsActive = 0
      }
    },
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
      // console.log(this.dayAndNight)
      // this.Refresh()
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
      this.changeUserView()
      this.$store.commit('setSafeMode', {info: type})
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
