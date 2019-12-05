<template>
  <div class="boxConntent1 container pt-30">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane label="建组消息" name="first">
        <g-news-list></g-news-list>
      </el-tab-pane>
      <el-tab-pane label="交易消息" name="second">
        <t-news-list></t-news-list>
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
      activeName: 'first'
    }
  },
  components: {gNewsList, tNewsList},
  mounted () {
    
  },
  methods: {
    handleClick () {

    }
  }
}
</script>
