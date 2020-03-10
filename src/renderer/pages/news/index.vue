<template>
  <div class="boxConntent1 container pt-30 relative">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane name="first">
        <span slot="label">{{$t('title').groupNews + (gNewsNum ? '(' + gNewsNum + ')' : '')}}</span>
        <g-news-list @gNewsTip="getGnewsNum"></g-news-list>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">{{$t('title').txnsNews + (tNewsNum ? '(' + tNewsNum + ')' : '')}}</span>
        <t-news-list @tNewsTip="getTnewsNum"></t-news-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
// .history-btn {
//   position: absolute;top:30px; right: 15px;z-index: 3;color: $color-primary;
// }
// .n-tab-box {
//   .el-tabs__item {
//     color: $color-gray;
//     &.is-active {
//       color: $color-primary;
//     }
//   }
// }
</style>

<script>
import gNewsList from './gNewsList'
import tNewsList from './tNewsList'
export default {
  name: '',
  data () {
    return {
      activeName: 'first',
      gNewsNum: 0,
      tNewsNum: 0,
    }
  },
  components: {gNewsList, tNewsList},
  watch: {
    gNewsNum () {
      this.initTabView()
    },
    tNewsNum () {
      this.initTabView()
    },
  },
  mounted () {
    console.log(this.$route)
    this.initTabView()
  },
  methods: {
    handleClick () {
      console.log(this.activeName)
      this.$router.push({path: this.$route.path, query: {activeTab: this.activeName}})
      console.log(this.$route)
    },
    initTabView () {
      let at = this.$route.query.activeTab ? this.$route.query.activeTab : ''
      if (this.gNewsNum === 0 && this.tNewsNum > 0) {
        this.activeName = 'second'
      } else if (((this.gNewsNum > 0 && this.tNewsNum > 0) || (this.gNewsNum === 0 && this.tNewsNum === 0)) && at) {
        this.activeName = at
      } else {
        this.activeName = 'first'
      }



      // if (this.gNewsNum === 0 && this.tNewsNum > 0 && !at) {
      //   this.activeName = 'second'
      // } else {
      //   this.activeName = 'first'
      // }
    },
    getGnewsNum (num) {
      // console.log(num)
      this.gNewsNum = num ? num : 0
    },
    getTnewsNum (num) {
      // console.log(num)
      this.tNewsNum = num ? num : 0
    }
  }
}
</script>
