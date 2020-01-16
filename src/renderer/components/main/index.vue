<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="header-top-box flex-bc">
      <div class="header-logo flex-c">
        <logo></logo>
      </div>

      <div class="flex-c header-top-account">
        <p class="item" v-if="false" :class="Number(safeMode) === 1 ? 'active' : ''" @click="changeMode('1')">{{$t('title').personAccount}}</p>
        <p class="item" :class="Number(safeMode) === 0 ? 'active' : ''" @click="changeMode('0')">{{$t('title').groupAccount}}</p>
      </div>
      <div class="header-top-set-box flex-ec">
        <div class="header-top-nav">
          <ul class="flex-c HH100">
            <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="openDrawerCreate" :title="$t('btn').create">{{$t('btn').create}}</li>
            <li class="item flex-c" :class="newsActive === 1 ? 'active' : ''" @click="toUrl('/waitNews')" :title="$t('title').wait"><el-badge :value="news.g > 0 ? news.g : ''" :max="99" class="flex-c">{{$t('btn').approval}}</el-badge></li>
            <li class="item flex-c" :class="newsActive === 3 ? 'active' : ''" @click="toUrl('/history')" :title="$t('btn').history">{{$t('title').history}}</li>
            <!-- <li class="item flex-c" :class="newsActive === 2 ? 'active' : ''" @click="toUrl('/tNewsList')" title="交易消息"><el-badge :value="news.t > 0 ? news.t : ''" :max="99" class="flex-c">通知</el-badge></li> -->
          </ul>
        </div>
        <language @changeLang="reload"></language>
        <div class="header-top-refresh cursorP" @click="Refresh" :title="$t('title').refrsh">
          <i class="el-icon-refresh-right"></i>
        </div>
        <div class="header-top-dn cursorP" @click="changeDn">
          <span class="round" :class="Number(dayAndNight) ? 'el-icon-sunny day' : 'el-icon-moon moon'"></span>
        </div>
        
        <div class="header-top-user flex-c cursorP" @click="drawer.user = true" :title="token">
          <!-- <div class="headImg box_Wshadow1" @click="isUserView = !isUserView"><img src="@etc/img/logoxs.svg"></div> -->
          <!-- <div class="headImg box_Wshadow1 flex-c" @click="isUserView = !isUserView"><img :src="headerImg"></div> -->
          <!-- <div class="headImg box_Wshadow1 flex-c" @click="drawer.user = true"><img :src="headerImg"></div> -->
          <el-avatar shape="square" :size="30" fit="fill" :src="headerImg"></el-avatar>
          <!-- <ul class="user-list box_Wshadow1" v-show="isUserView">
            <li class="item" @click="toUrl('createGroup');changeUserView()" :title="$t('btn').createAccount"><i class="el-icon-plus mr-5"></i>{{$t('btn').createAccount}}</li>
            <li class="item" @click="changeMode('1')" :title="$t('title').personAccount"><i class="el-icon-user mr-5"></i>{{$t('title').personAccount}}</li>
            <li class="item" @click="changeMode('0')" :title="$t('title').groupAccount"><i class="el-icon-money mr-5"></i>{{$t('title').groupAccount}}</li>
            <li class="item" @click="quitApp()" :title="$t('title').quit"><i class="el-icon-s-unfold mr-5"></i>{{$t('title').quit}}</li> -->
          <!-- </ul> -->
        </div>
      </div>
    </header>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    
    <section id="boxContent_box">
      <transition name="fade">
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>

    <el-drawer :visible.sync="drawer.create" :destroy-on-close="true" :show-close="false">
      <div slot="title">
        <drawer-logo @close-drawer="drawer.create = false"></drawer-logo>
      </div>
      <create-account :formBoxClass="false" @closeModal="modalClick"></create-account>
    </el-drawer>

    <el-drawer :visible.sync="drawer.user" :destroy-on-close="true" :show-close="false">
      <person-info @closeDrawer="drawer.user = false"></person-info>
    </el-drawer>
  </div>
</template>

<style lang="scss">
@import './scss/index';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {findHeaderImg} from '@/db/headerImg'
import createAccount from '@/pages/group/createGroup.vue'
import personInfo from '@/components/main/personInfo.vue'
import language from '@/components/language/index.vue'
export default {
  name: 'index',
  provide () {
    return {
      reload: this.Refresh
    }
  },
  data () {
    return {
      isRouterAlive: true,
      news: {
        g: 0,
        t: 0
      },
      intervalSwitch: '',
      // isUserView: false,
      newsActive: 0,
      drawer: {
        user: false,
        create: false
      },
      headerImg: require('@etc/img/logo/logo.png')
    }
  },
  watch: {
    '$route' (cur) {
      // console.log(cur)
      this.newsView(cur)
    },
    serverRPC (cur) {
      console.log(cur)
      setTimeout(() => {
        this.reload()
      }, 500)
    }
  },
  computed: {
    ...computedPub
  },
  components: {createAccount, personInfo, language},
  mounted () {
    // console.log(this.$route)
    this.newsView(this.$route)
    this.getHeaderImg()
  },
  methods: {
    async getHeaderImg () {
      findHeaderImg({address: this.address}).then(res => {
        // console.log(res)
        if (res.length > 0) {
          this.headerImg = res[0].imgData
        }
      })
    },
    modalClick () {
      this.drawer.create = false
    },
    openDrawerCreate () {
      if (this.$route.path.indexOf('createGroup') !== -1) return
      this.drawer.create = true
    },
    newsView (cur) {
      if (cur.path.indexOf('waitNews') !== -1) {
        this.newsActive = 1
      } else if (cur.path.indexOf('createGroup') !== -1) {
        this.newsActive = 2
      } else if (cur.path.indexOf('history') !== -1) {
        this.newsActive = 3
      } else {
        this.newsActive = 0
      }
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
    Refresh () {
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
      this.$store.commit('setSafeMode', {info: type})
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand('Copy')
      this.msgSuccess(this.$t('success').s_2)
    },
  },
  beforeDestroy () {
    clearInterval(this.intervalSwitch)
    this.intervalSwitch = null
  }
}

</script>
