<template>
  <div class="boxConntent1" v-loading="loading.list" :element-loading-text="$t('loading').l_1">
    <div class="t-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item" v-for="(item, index) in newsList" :key="index">
          <div class="address-box flex-bc">
            <p class="addr" :title="item.DcrmFrom"><span class="label">{{$t('label').from}}:</span> {{$$.cutOut(item.DcrmFrom, 12, 10)}}</p>
            <p class="addr" :title="item.DcrmTo"><span class="label">{{$t('label').to}}:</span> {{$$.cutOut(item.DcrmTo, 12, 10)}}</p>
            <div class="round flex-c"><i class="el-icon-right"></i></div>
          </div>
          <div class="amount-box flex-bc">
            <p class="amt"><span class="label">{{$t('label').value}}:</span> {{

              $$.fromWei(item.Value, $$.cutERC20(item.Cointype).coinType) 
              }}</p>
            <p class="amt"><span class="label">{{$t('label').coinType}}:</span> {{item.Cointype}}</p>
          </div>
          <div class="action-box flex-bc">
            <p class="at" :title="item.GroupId"><span class="label">{{$t('label').source}}:</span> {{$$.cutOut(item.GroupId, 16, 14)}}</p>
            <el-button @click="toUrl('/tValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="newsList.length <= 0" class="boxConntent1 flex-c font14 color_99">
      {{$t('warn').w_12}}
    </div>
  </div>
</template>

<style lang="scss">
@import './scss/tNewsList';
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
        this.$emit('tNewsTip', this.newsList.length)
        this.loading.list = false
      }).catch(err => {
        this.msgError(err.error)
        this.loading.list = false
      })
    }
  }
}
</script>