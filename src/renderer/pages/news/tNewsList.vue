<template>
  <div class="boxConntent1 container" v-loading="loading.list" element-loading-text="数据获取中……">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15">
      <el-breadcrumb-item :to="{ path: '/group' }">账户列表</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="n-list-box">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index" @click="toUrl('/tValid', item)">
          <p class="p1">{{item.Account}}</p>
          <!-- <p class="p2">{{$$.timeChange({date: item.time, type: 'yyyy-mm-dd hh:mm:ss'})}}</p> -->
          <p class="p2">{{$$.thousandBit(item.Value, 2)}}</p>
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
      newsList: [],
      loading: {
        list: true
      },
    }
  },
  mounted () {
    this.initTxnsList()
  },
  methods: {
    initTxnsList () {
      this.$$.getTxnsList().then(res => {
        console.log(res)
        this.newsList = res.info
        this.loading.list = false
      }).catch(err => {
        this.$message.error(err.error)
        this.loading.list = false
      })
    }
  }
}
</script>