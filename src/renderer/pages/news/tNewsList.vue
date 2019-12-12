<template>
  <div class="boxConntent1 container" v-loading="loading.list" element-loading-text="数据获取中……">
    <div class="t-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item" v-for="(item, index) in newsList" :key="index">
          <div class="address-box flex-bc">
            <p class="addr" :title="item.DcrmFrom"><span class="label">{{$t('label').from}}:</span> {{$$.cutOut(item.DcrmFrom, 12, 10)}}</p>
            <p class="addr" :title="item.DcrmTo"><span class="label">{{$t('label').to}}:</span> {{$$.cutOut(item.DcrmTo, 12, 10)}}</p>
            <div class="round flex-c"><i class="el-icon-right"></i></div>
          </div>
          <div class="amount-box flex-bc">
            <p class="amt"><span class="label">{{$t('label').value}}:</span> {{$$.thousandBit(item.Value, 'no')}}</p>
            <p class="amt"><span class="label">{{$t('label').coinType}}:</span> {{item.Cointype}}</p>
          </div>
          <div class="action-box flex-bc">
            <p class="at" :title="item.GroupId"><span class="label">{{$t('label').source}}:</span> {{$$.cutOut(item.GroupId, 16, 14)}}</p>
            <el-button @click="toUrl('/tValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
          </div>
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
.t-news-list-box {
  width: 100%;min-height: 80%;padding: size(10) size(0); margin:size(15) 0;
  .item {
    width: 100%;border: size(1) solid $color-primary-sm;border-radius: size(8);font-size: $text-normal;color: #333;cursor: pointer;padding:size(30) size(20) size(20);margin-bottom: size(25);
    .address-box {
      $listH: 40;
      width: 100%;height: size($listH);background: $color-primary-sm;border-radius: size(20);position: relative;
      .addr {
        width: 50%;text-align: center;color:$color-primary;font-size:$text-normal;
        .label {
          color: $color-gray;margin-right: size(5);font-weight: bold;
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
        width: 50%;text-align: center;font-size:$text-normal;color: $color-gray;
        .label {
          color: $color-gray;margin-right: size(5);font-weight: bold;
        }
      }
    }
    .action-box {
      width: 100;padding: size(20) 0 0;
      .at {
        width: 50%;text-align: center;font-size:$text-normal;color: $color-gray;
        .label {
          color: $color-gray;margin-right: size(5);font-weight: bold;
        }
      }
      .el-button {
        background: $color-primary;color: #fff;
      }
    }
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
  sockets: {
    GroupFindTxns (res) {
      console.log(res)
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