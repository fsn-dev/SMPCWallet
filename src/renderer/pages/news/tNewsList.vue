<template>
  <div class="boxConntent1 container" v-loading="loading.list" element-loading-text="数据获取中……">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15">
      <el-breadcrumb-item :to="{ path: '/group' }">账户列表</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="t-news-list-box">
      <ul>
        <li class="item" v-for="(item, index) in newsList" :key="index">
          <div class="address-box flex-bc">
            <p class="addr" :title="item.DcrmFrom"><span class="label">From:</span> {{$$.cutOut(item.DcrmFrom, 12, 10)}}</p>
            <p class="addr" :title="item.DcrmTo"><span class="label">To:</span> {{$$.cutOut(item.DcrmTo, 12, 10)}}</p>
            <div class="round flex-c"><i class="el-icon-right"></i></div>
          </div>
          <div class="amount-box flex-bc">
            <p class="amt"><span class="label">Value:</span> {{$$.thousandBit(item.Value, 'no')}}</p>
            <p class="amt"><span class="label">CoinType:</span> {{item.Cointype}}</p>
          </div>
          <div class="action-box flex-bc">
            <p class="at">Source: {{$$.cutOut(item.GroupId, 16, 14)}}</p>
            <el-button @click="toUrl('/tValid', item)">Approval</el-button>
          </div>
          <!-- <p class="p1">{{item.Account}}</p>
          <p class="p2">{{$$.thousandBit(item.Value, 2)}}</p> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
// @import '@/assets/scss/index';
.t-news-list-box {
  width: 100%;min-height: 80%;padding: size(10) size(0); background:#fff;margin:size(15) 0;
  .item {
    width: 100%;border: size(1) solid $color-primary-sm;border-radius: size(8);font-size: $text-normal;color: #333;cursor: pointer;padding:size(30) size(20) size(20);margin-bottom: size(25);
    .address-box {
      $listH: 40;
      width: 100%;height: size($listH);background: $color-primary-sm;border-radius: size(20);position: relative;
      .addr {
        width: 50%;text-align: center;color:$color-primary;font-size:$text-normal;font-weight: bold;
        .label {
          color: $color-black;margin-right: size(5);
        }
      }
      .round {
        $rSize: 50;
        width: size($rSize);height: size($rSize);position: absolute;top:size(-($rSize - $listH) / 2);left: 50%;margin-left: size(-$rSize / 2);background: $color-primary;border-radius: 100%;color: #fff;font-size: $text-lg;font-weight: bold;
      }
    }
    .amount-box {
      width: 100%;padding: size(30) 0;border-bottom: size(1) dashed #ddd;
      .amt {
        width: 50%;text-align: center;font-size:$text-normal;font-weight: bold;
      }
    }
    .action-box {
      width: 100;padding: size(20) 0 0;
      .at {
        width: 50%;text-align: center;font-size:$text-normal;font-weight: bold;
      }
      .el-button {
        background: $color-primary;color: #fff;
      }
    }
    // .p2{
    //   color:#999;
    // }
  }
}
</style>

<script>
import wButton from '@/components/btn/index'
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
  components: {wButton},
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