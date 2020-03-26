<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="header-top-box flex-bc">
      <div class="header-logo flex-c">
        <logo></logo>
      </div>

      <div class="flex-c header-top-account">
        <p class="item" v-if="$$.config.accountSwitch.person" :class="Number(accountType) === 1 ? 'active' : ''" @click="changeMode('1')">{{$t('title').personAccount}}</p>
        <p class="item" :class="Number(accountType) === 0 ? 'active' : ''" @click="changeMode('0')">{{$t('title').groupAccount}}</p>
      </div>
      <div class="header-top-set-box flex-ec">
        <div class="header-top-nav">
          <ul class="flex-c HH100">
            <li
              class="item flex-c"
              :class="newsActive === 2 ? 'active' : ''"
              @click="openDrawerCreate"
              :title="$t('btn').create"
            >{{$t('btn').create}}</li>
            <li
              class="item flex-c"
              :class="newsActive === 1 ? 'active' : ''"
              @click="toUrl('/waitNews')"
              :title="$t('title').wait"
            >
              <el-badge :value="newsLen ? newsLen : ''" :max="99" class="flex-c">
                {{$t('btn').approval}}
              </el-badge>
            </li>
            <li
              class="item flex-c"
              :class="newsActive === 3 ? 'active' : ''"
              @click="toUrl('/history')"
              :title="$t('btn').history"
            >{{$t('title').history}}</li>
          </ul>
        </div>
        <language @changeLang="reload"></language>
        <div class="header-top-refresh cursorP" @click="reload" :title="$t('title').refrsh">
          <i class="el-icon-refresh-right"></i>
        </div>
        <div class="header-top-dn cursorP" @click="changeDn">
          <span class="round" :class="Number(dayAndNight) ? 'el-icon-sunny day' : 'el-icon-moon moon'"></span>
        </div>
        
        <div class="header-top-user flex-c cursorP" @click="drawer.user = true" :title="token">
          <el-avatar shape="square" :size="30" fit="fill" :src="headerImg"></el-avatar>
        </div>
      </div>
    </header>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    
    <section id="boxContent_box">
      <transition name="fade">
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>

    <el-drawer :visible.sync="drawer.create" :destroy-on-close="true" :show-close="false" v-if="drawer.create">
      <div slot="title">
        <drawer-logo @close-drawer="drawer.create = false"></drawer-logo>
      </div>
      <createPerson :formBoxClass="false" @closeModal="modalClick" v-if="Number(accountType)"></createPerson>
      <createGroup :formBoxClass="false" @closeModal="modalClick" v-else></createGroup>
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
import {approvalMethods} from '@/assets/js/pages/approval.js'

import {findHeaderImg} from '@/db/headerImg'

import createGroup from '@/pages/account/create/createGroup.vue'
import createPerson from '@/pages/account/create/createPerson.vue'
import personInfo from '@/components/main/personInfo.vue'
import language from '@/components/language/index.vue'

export default {
  name: 'index',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      newsLen: 0,
      intervalSwitch: '',
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
      this.newsView(cur)
    },
    serverRPC (cur) {
      // console.log(cur)
      setTimeout(() => {
        this.reload()
      }, 500)
    }
  },
  computed: {
    ...computedPub
  },
  components: {createGroup, createPerson, personInfo, language},
  mounted () {
    // console.log(this.$route)
    this.newsView(this.$route)
    this.getHeaderImg()
    setTimeout(() => {
      this.getAllApprovalData()
      this.intervalNews()
    }, 500)
  },
  methods: {
    ...approvalMethods,
    getAllApprovalData () {
      this.getAllApproval().then(res => {
        console.log(res)
        this.newsLen = res[0].approved + res[1].approved
        // this.newsLen = res[0].total + res[1].total
        this.$store.commit('setApprovalObj', res)
        clearTimeout(this.intervalSwitch)
        this.intervalNews()
      })
    },
    intervalNews () {
      this.intervalSwitch = setTimeout(() => {
        this.getAllApprovalData()
      }, 1000 * 35)
    },
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
      if (this.$route.path.indexOf('createGroup') !== -1 || this.$route.path.indexOf('createPerson') !== -1) return
      this.drawer.create = true
    },
    newsView (cur) {
      if (cur.path.indexOf('waitNews') !== -1) {
        this.newsActive = 1
      } else if (cur.path.indexOf('createGroup') !== -1 || cur.path.indexOf('createPerson') !== -1) {
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
    reload () {
			this.isRouterAlive = false
			this.$nextTick(() => {
				this.isRouterAlive = true
      })
    },
    changeMode (type) {
      // this.$router.push({path: this.$route.path})
      this.$store.commit('setAccountType', {info: type})
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand('Copy')
      this.msgSuccess(this.$t('success').s_2)
    },
  },
  beforeDestroy () {
    clearTimeout(this.intervalSwitch)
    this.intervalSwitch = null
  }
}

</script>
