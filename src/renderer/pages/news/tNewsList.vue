<template>
  <div class="boxConntent1" v-loading="loading.list" :element-loading-text="$t('loading').l_1">
    <div class="t-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item" v-for="(item, index) in newsList" :key="index">
          <div class="labelType rotate_45 flex-c self" v-if="address === item.Account">{{$t('label').initiator}}</div>
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
            <el-button v-if="!item.status" @click="toUrl('/tValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
            <el-button type="success" v-if="item.status" @click="toUrl('/tValid', item)" class="">{{$t('btn').review}}</el-button>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="newsList.length <= 0" class="boxConntent1 flex-c font14 color_99 H120">
      {{$t('warn').w_12}}
    </div>
  </div>
</template>

<style lang="scss">
@import './scss/tNewsList';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import wButton from '@/components/btn/index'
import {methods} from './js/common'
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
  computed: {
    ...computedPub,
  },
  sockets: {
    GroupFindTxns (res) {
      console.log(res)
    }
  },
  mounted () {
    this.initTxnsList()
  },
  methods: {
    ...methods,
    initTxnsList () {
      console.log(this.address)
      this.$$.getTxnsList(this.address).then(res => {
        console.log(res)
        this.newsList = []
        for (let i = 0, len = res.info.length; i < len; i++) {
          let obj = res.info[i]
          if (this.address === obj.Account) {
            obj.status = 1
          } else {
            obj.status = 0
            this.getKeyStatus(obj.Key, i, '2')
          }
          this.newsList.push(obj)
        }
        this.$emit('tNewsTip', this.newsList.length)
        this.loading.list = false
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
        this.loading.list = false
      })
    }
  }
}
</script>