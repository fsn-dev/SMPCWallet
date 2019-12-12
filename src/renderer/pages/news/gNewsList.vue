<template>
  <div class="boxConntent1 container" v-loading="loading.list" element-loading-text="数据获取中……">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15">
      <el-breadcrumb-item :to="{ path: '/group' }">账户列表</el-breadcrumb-item>
      <el-breadcrumb-item>消息列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="g-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index">
          <div class="left">
            <p class="p1">{{item.Gname}}</p>
            <div class="flex-sc">
              <span v-for="(eNode, indexs) in item.Enodes" :key="indexs" class="eNode flex-sc" :title="eNode">
                <i class="i">{{eNode}}</i>{{ indexs === (item.Enodes.length - 1) ? "" : '、'}}
              </span>
            </div>
          </div>
          <el-button @click="toUrl('/gValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
        </li>
      </ul>
    </div>
    <div v-if="newsList.length <= 0" class="boxConntent1 container flex-c font14 color_99">
      {{$t('warn').w_12}}
    </div>
  </div>
</template>

<style lang="scss">
// @import '@/assets/scss/index';
.g-news-list-box {
  width: 100%;min-height: 80%;padding: size(10) size(0); margin:size(15) 0;
  .item {
    width: 100%;border: size(1) solid $color-primary-sm;border-radius: size(8);font-size: $text-normal;color: #333;cursor: pointer;padding:size(20) size(20) size(20);margin-bottom: size(25);
    .left {
      .p1 {
        font-size: $text-md;font-weight: bold;
      }
      .eNode {
        width: size(150);line-height:size(21);font-size: $text-normal;color: $color-gray-sm;display: inline-block;margin-top: size(5);
        .i {
          width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;
        }
      }
    }
    .el-button {
      background: $color-primary;color: #fff;
    }
  }
}
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
      this.$$.getPendingGroup().then(res => {
        this.newsList = res.info
        this.loading.list = false
      }).catch(err => {
        this.newsList = []
        this.$message({
          showClose: true,
          message: err.error,
          type: 'error'
        })
        this.loading.list = false
      })
    }
  }
}
</script>