<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15">
      <el-breadcrumb-item :to="{ path: '/group' }">账户列表</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="n-list-box">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index" @click="toUrl('/tValid', item)">
          <p class="p1">{{item.Gname}}</p>
          <p class="p2">{{$$.timeChange({date: item.time, type: 'yyyy-mm-dd hh:mm:ss'})}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/index';
</style>

<script>
export default {
  name: '',
  data () {
    return {
      newsList: [
        {Gname: '组一', time: '1573788143592'},
        {Gname: '组2', time: '1573788143592'},
      ]
    }
  },
  mounted () {
    this.newsList = this.$$.getGroup()
    // console.log(this.newsList)
  }
}
</script>