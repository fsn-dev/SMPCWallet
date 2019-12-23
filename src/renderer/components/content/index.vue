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
        <p class="item" :class="Number(safeMode) === 1 ? 'active' : ''" @click="changeMode('1')">{{$t('title').personAccount}}</p>
        <p class="item" :class="Number(safeMode) === 0 ? 'active' : ''" @click="changeMode('0')">{{$t('title').groupAccount}}</p>
      </div>
      <div class="header-top-set-box flex-ec">
        <div class="header-top-nav">
          <ul class="flex-c HH100">
            <li class="item flex-c" :class="newsActive === 1 ? 'active' : ''" @click="toUrl('/waitNews')" :title="$t('title').wait"><el-badge :value="news.g > 0 ? news.g : ''" :max="99" class="flex-c">{{$t('title').wait}}</el-badge></li>
            <!-- <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="toUrl('/createGroup')" title="创建共管账户">创建共管账户</li> -->
            <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="openDrawerCreate" :title="$t('btn').createAccount">{{$t('btn').createAccount}}</li>
            <!-- <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :value="news.t > 0 ? news.t : ''" :max="99" class="flex-c">通知</el-badge></li> -->
          </ul>
        </div>
        <div class="header-top-lang">
          <el-select v-model="lang" size="mini" @change="changLanguage">
            <el-option v-for="item in languageOption" :key="item.value" :label="item.label" :value="item.value" >
            </el-option>
          </el-select>
        </div>
        <div class="header-top-refresh cursorP" @click="Refresh" :title="$t('title').refrsh">
          <i class="el-icon-refresh-right"></i>
        </div>
        <div class="header-top-dn cursorP" @click="changeDn">
          <span class="round" :class="Number(dayAndNight) ? 'el-icon-sunny day' : 'el-icon-moon moon'"></span>
        </div>
        
        <div class="header-top-user">
          <!-- <div class="headImg box_Wshadow1" @click="isUserView = !isUserView"><img src="@etc/img/logoxs.svg"></div> -->
          <div class="headImg box_Wshadow1" @click="isUserView = !isUserView"><img :src="headerImg"></div>
          <ul class="user-list box_Wshadow1" v-show="isUserView">
            <li class="item" @click="toUrl('createGroup');changeUserView()" :title="$t('btn').createAccount"><i class="el-icon-plus mr-5"></i>{{$t('btn').createAccount}}</li>
            <li class="item" @click="changeMode('1')" :title="$t('title').personAccount"><i class="el-icon-user mr-5"></i>{{$t('title').personAccount}}</li>
            <li class="item" @click="changeMode('0')" :title="$t('title').groupAccount"><i class="el-icon-money mr-5"></i>{{$t('title').groupAccount}}</li>
            <li class="item" @click="quitApp()" :title="$t('title').quit"><i class="el-icon-s-unfold mr-5"></i>{{$t('title').quit}}</li>
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
@import './scss/index';
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
      lang: this.$i18n.locale,
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
    this.headerImg = this.$$.config.file.img.url + this.address + this.$$.config.file.img.type

    // this.intervalNews()
    // this.intervalSwitch = setInterval(() => {
    //   this.intervalNews()
    // }, 1000 * 5)
  },
  methods: {
    openDrawerCreate () {
      if (this.$route.path.indexOf('createGroup') !== -1) return
      this.drawer.create = true
    },
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
      if (Number(this.dayAndNight)) {
        this.$store.commit('setDayAndNight', {info: '0'})
      } else {
        this.$store.commit('setDayAndNight', {info: '1'})
      }
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
      this.msgSuccess(this.$t('success').s_2)
    },
    changLanguage (type) {
      if (type) {
        this.lang = type
      }
      this.$i18n.locale = this.lang
      this.$store.commit('setLanguage', {info: this.lang})
      this.reload()
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalSwitch)
    this.intervalSwitch = null
  }
}

</script>
