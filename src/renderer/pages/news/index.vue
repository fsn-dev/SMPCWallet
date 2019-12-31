<template>
  <div class="boxConntent1 container pt-30">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane name="first">
        <span slot="label">{{$t('title').groupNews + (gNewsNum ? '(' + gNewsNum + ')' : '')}}</span>
        <div class="flex-sc font14 color_99 cursorP mb-20" @click="toUrl('/groupHistory')">查看历史</div>
        <g-news-list @gNewsTip="getGnewsNum"></g-news-list>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">{{$t('title').txnsNews + (tNewsNum ? '(' + tNewsNum + ')' : '')}}</span>
        <div class="flex-sc font14 color_99 cursorP mb-20" @click="toUrl('/txnsHistory')">查看历史</div>
        <t-news-list @tNewsTip="getTnewsNum"></t-news-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
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
    
  },
  methods: {
    handleClick () {

    },
    initTabView () {
      if (this.gNewsNum === 0 && this.tNewsNum > 0) {
        this.activeName = 'second'
      } else {
        this.activeName = 'first'
      }
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
