<template>
  <div class="boxContent page-component__scroll el-scrollbar">
    <header class="header-top-box flex-bc">
      <div class="flex-sc HH100">
        <div class="header-logo flex-c">
          <logo></logo>
        </div>
        <div class="header-top-nav">
          <ul class="flex-c HH100">
            <!-- <li
              class="item flex-c"
              :class="newsActive === 'createAccount' ? 'active' : ''"
              @click="openDrawerCreate"
              :title="$t('btn').create"
            >{{$t('btn').create}}</li> -->
            <li
              class="item flex-c"
              :class="newsActive === 'account' ? 'active' : ''"
              @click="toUrl('/account')"
              :title="$t('title').assets"
            >{{$t('title').assets}}</li>
            <li
              class="item flex-c"
              :class="newsActive === 'approvalList' ? 'active' : ''"
              @click="toUrl('/approvalList')"
              :title="$t('title').wait"
            >
              <el-badge :value="newsLen ? newsLen : ''" :max="99" class="flex-c">
                {{$t('btn').approval}}
              </el-badge>
            </li>
            <li
              class="item flex-c"
              :class="newsActive === 'history' ? 'active' : ''"
              @click="toUrl('/history')"
              :title="$t('btn').history"
            >{{$t('title').history}}</li>
            <li
              class="item flex-c"
              :class="newsActive === 'social' ? 'active' : ''"
              @click="toUrl('/social')"
              :title="$t('label').friend"
            >{{$t('label').friend}}</li>
            <li
              class="item flex-c"
              :class="newsActive === 'nodeTable' ? 'active' : ''"
              @click="toUrl('/nodeTable')"
              :title="$t('title').network"
            >{{$t('title').network}}</li>
            <li
              class="item flex-c"
              :class="newsActive === 'applyMarket' ? 'active' : ''"
              @click="toUrl('/applyMarket')"
              :title="$t('title').applyMarket"
            >{{$t('title').applyMarket}}</li>
          </ul>
        </div>
      </div>

      <!-- <div class="flex-c header-top-account">
        <p class="item" v-if="$$.config.accountSwitch.person" :class="Number(accountType) === 1 ? 'active' : ''" @click="changeMode('1')">{{$t('title').personAccount}}</p>
        <p class="item" :class="Number(accountType) === 0 ? 'active' : ''" @click="changeMode('0')">{{$t('title').groupAccount}}</p>
      </div> -->
      <div class="header-top-set-box flex-bc">
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

    <el-dialog :title="$t('title').register" :visible.sync="drawer.create" width="800px" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="true" :show-close="true" class="create-dialog">
      <createPerson :formBoxClass="false" @closeModal="modalClick" v-if="Number(accountType) && drawer.create"></createPerson>
      <createGroup :formBoxClass="false" @closeModal="modalClick" v-if="!Number(accountType) && drawer.create"></createGroup>
    </el-dialog>

    <el-drawer :visible.sync="drawer.user" :destroy-on-close="true" :show-close="false">
      <div class="person-info-box">
        <div class="flex-bc t-logo-box">
          <div class="flex-sc">
            <div class="header-img">
              <img :src="headerImg">
            </div>
            <span class="font12 ml-5">{{token + '@' + serverRPCname}}</span>
          </div>
          <div class="quit-box cursorP" @click="quitApp()"> {{$t('title').quit}} </div>
        </div>
        <person-info @closeDrawer="drawer.user = false"></person-info>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss">
@import './scss/index';
.person-info-box {
  width: 100%;height: 100%;position: relative;padding-top: 72px;
}
.t-logo-box {
  border-bottom: 1px solid #ddd;padding: size(15) size(15);position:absolute;left:0;right:0;top:0;
  .header-img {
    width: 35px;
    img {
      width: 100%;
    }
  }
  .quit-box {
    padding: size(0) size(8);border: 1px solid $color-primary;color: $color-primary;font-size: $text-sm;display: inline-block;
  }
}
.create-dialog {
  // .el-dialog__header {
  //   // display: none;
  // }
  &>.el-dialog__body {
    padding:0;
  }
  &>.boxConntent1 {
    padding: 0;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {approvalMethods} from '@/assets/js/pages/approval.js'

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
      headerImg: require('@/assets/img/logo/logo.png')
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
    },
    approvalAll (cur) {
      this.newsLen = cur[0].approved + cur[1].approved
    }
  },
  computed: {
    ...computedPub,
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
        // console.log(res)
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
      this.$db.findHeaderImg({address: this.address}).then(res => {
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
      if (cur.path.indexOf('approvalList') !== -1) {
        this.newsActive = 'approvalList'
      } else if (cur.path.indexOf('createGroup') !== -1 || cur.path.indexOf('createPerson') !== -1) {
        this.newsActive = 'createAccount'
      } else if (cur.path.indexOf('history') !== -1) {
        this.newsActive = 'history'
      } else if (cur.path.indexOf('social') !== -1) {
        this.newsActive = 'social'
      } else if (cur.path.indexOf('nodeTable') !== -1) {
        this.newsActive = 'nodeTable'
      } else if (cur.path.indexOf('account') !== -1) {
        this.newsActive = 'account'
      } else if (cur.path.indexOf('applyMarket') !== -1) {
        this.newsActive = 'applyMarket'
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
