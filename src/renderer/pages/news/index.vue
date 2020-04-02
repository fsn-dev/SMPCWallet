<template>
  <div class="boxConntent1 container pt-30 relative" v-loading="!isReload" :element-loading-text="$t('loading').l_1">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane name="account">
        <span slot="label">{{$t('title').groupNews + (gNews.num ? '(' + gNews.num + ')' : '')}}</span>
        <g-news-list :gNewsData="gNews.data" v-if="isReload"></g-news-list>
      </el-tab-pane>
      <el-tab-pane name="txns">
        <span slot="label">{{$t('title').txnsNews + (tNews.num ? '(' + tNews.num + ')' : '')}}</span>
        <t-news-list :tNewsData="tNews.data" v-if="isReload"></t-news-list>
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
import {approvalMethods} from '@/assets/js/pages/approval.js'
export default {
  name: '',
  data () {
    return {
      activeName: 'account',
      gNews: {
        num: 0,
        data: {}
      },
      tNews: {
        num: 0,
        data: {}
      },
      isReload: false
    }
  },
  components: {gNewsList, tNewsList},
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
    this.initTabView()
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
      this.initTabView()
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
        this.activeName = 'account'
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
