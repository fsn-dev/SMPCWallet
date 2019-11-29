<template>
  <div class="boxConntent1 container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <g-news-list></g-news-list>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <t-news-list></t-news-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">

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
