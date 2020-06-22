<template>
  <div class="boxConntent1 container pt-30 relative" v-loading="!isReload" :element-loading-text="$t('loading').l_1">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <!-- <el-tab-pane name="accounts">
        <span slot="label">{{$t('title').groupNews + (gNews.num ? '(' + gNews.num + ')' : '')}}</span>
        <g-news-list :gNewsData="gNews.data" v-if="isReload"></g-news-list>
      </el-tab-pane>
      <el-tab-pane name="txns">
        <span slot="label">{{$t('title').txnsNews + (tNews.num ? '(' + tNews.num + ')' : '')}}</span>
        <t-news-list :tNewsData="tNews.data" v-if="isReload"></t-news-list>
      </el-tab-pane> -->
      
      <el-tab-pane v-for="(item, index) in newsArr" :key="index" :name="item.tab ? item.tab : 'accounts'">
      <!-- <el-tab-pane v-for="(item, index) in newsArr" :key="index" :name="item.tab ? item.tab : 'accounts'"> -->
        <span slot="label">{{item.name + (item.approved ? '(' + item.approved + ')' : '')}}</span>
        <gNewsList :tableData="item" v-if="isReload && activeName === 'accounts'"></gNewsList>
        <tNewsList :tableData="item" v-if="isReload && activeName === 'txns'"></tNewsList>
        <sNewsList :tableData="item" v-if="isReload && activeName === 'signs'"></sNewsList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import gNewsList from './gNewsList'
import tNewsList from './tNewsList'
import sNewsList from './sNewsList'
import {approvalMethods} from '@/assets/js/pages/approval.js'
export default {
  name: '',
  data () {
    return {
      activeName: 'accounts',
      gNews: {
        num: 0,
        approved: 0,
        data: {}
      },
      tNews: {
        num: 0,
        approved: 0,
        data: {}
      },
      sNews: {
        num: 0,
        approved: 0,
        data: {}
      },
      newsArr: [
        {name: this.$t('title').groupNews, total: 0, approved: 0, data: {}, tab: 'accounts'},
        {name: this.$t('title').txnsNews, total: 0, approved: 0, data: {}, tab: 'txns'},
        {name: this.$t('title').signsNews, total: 0, approved: 0, data: {}, tab: 'signs'},
      ],
      isReload: false
    }
  },
  components: {gNewsList, tNewsList, sNewsList},
  computed: {
    ...computedPub,
  },
  watch: {
    approvalAll (cur) {
      // console.log(cur)
      this.setData(cur)
      this.removeStatus()
    }
  },
  mounted () {
    // console.log(this.$route)
    // this.initTabView()
    this.getAllApprovalData()
  },
  methods: {
    ...approvalMethods,
    getAllApprovalData () {
      this.getAllApproval().then(res => {
        console.log(res)
        this.setData(res)
        this.$store.commit('setApprovalObj', res)
        this.isReload = true
      })
    },
    setData (res) {
      this.gNews.data = res[0]
      this.gNews.num = res[0].total
      this.tNews.data = res[1]
      this.tNews.num = res[1].total
      this.sNews.data = res[2]
      this.sNews.num = res[2].total
      let approvalIndex = 0
      for (let i = 0, len = res.length; i < len; i++) {
        this.newsArr[i].total = res[i].total
        this.newsArr[i].approved = res[i].approved
        this.newsArr[i].info = res[i].info
        if (res[i].approved > 0 && !approvalIndex) {
          approvalIndex = i
        }
      }
      let at = this.$route.query.activeTab ? this.$route.query.activeTab : ''
      if (!at) {
        this.activeName = this.newsArr[approvalIndex].tab
      } else {
        this.activeName = at
      }
    },
    refreshApproval () {
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
      })
    },
    handleClick () {
      this.$router.push({path: this.$route.path, query: {activeTab: this.activeName}})
    },
    initTabView () {
      let at = this.$route.query.activeTab ? this.$route.query.activeTab : ''
      if (this.gNews.num === 0 && this.tNews.num > 0) {
        this.activeName = 'txns'
      } else if (((this.gNews.num > 0 && this.tNews.num > 0) || (this.gNews.num === 0 && this.tNews.num === 0)) && at) {
        this.activeName = at
      } else {
        this.activeName = 'accounts'
      }
    },
    async removeStatus () {
    let nowDate = Date.now()
    this.$db.findStatus({}).then(res => {
      // console.log(res)
      if (res.length > 0) {
        for (let obj of res) {
          if ((nowDate - obj.updatetime) > (1000 * 60 * 15)) {
            this.$db.removeStatus({key: obj.key})
          }
        }
      }
    })
  },
  }
}
</script>
