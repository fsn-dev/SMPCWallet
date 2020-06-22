<template>
  <div class="boxConntent1">
    <div class="t-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item" v-for="(item, index) in newsList" :key="index">
          <div class="labelType rotate_45 flex-c self" v-if="address === item.Account">{{$t('label').initiator}}</div>
          <div class="address-box flex-bc">
            <p class="addr" :title="item.from"><span class="label">{{$t('label').from}}:</span> {{item.to ? $$.cutOut(item.from, 12, 10) : item.from}}</p>
            <p class="addr" :title="item.to" v-if="item.to"><span class="label">{{$t('label').to}}:</span> {{$$.cutOut(item.to, 12, 10)}}</p>
            <div class="round flex-c" v-if="item.to"><i class="el-icon-right"></i></div>
          </div>
          <div class="amount-box flex-bc" v-if="parseFloat(item.value) && item.coinType">
            <p class="amt"><span class="label">{{$t('label').value}}:</span> {{
              item.value
              }}</p>
            <p class="amt"><span class="label">{{$t('label').coinType}}:</span> {{item.coinType}}</p>
          </div>
          <div class="action-box flex-bc">
            <p class="at" :title="item.PubKey">
              <span class="label">{{$t('label').source}}:</span>
              {{$$.cutOut(item.PubKey, 16, 14)}}

            </p>
            <p class="font12 color_99 mt-5">{{$$.timeChange(item.TimeStamp, 'yyyy-mm-dd hh:mm:ss')}}</p>
            <el-button v-if="!item.status" @click="toUrl('/sValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
            <el-button type="success" v-if="item.status" @click="toUrl('/sValid', item)" class="">{{$t('btn').review}}</el-button>
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
export default {
  name: 'tNewsList',
  props: {
    tableData: {
      type: Object ,
      default: {}
    }
  },
  data () {
    return {
      newsList: [],
    }
  },
  components: {wButton},
  computed: {
    ...computedPub,
  },
  watch: {
    tableData (cur) {
      // console.log(cur)
      this.setList(cur.info)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.setList(this.tableData.info)
    },
    setList (data) {
      let arr = []
      console.log(data)
      for (let obj of data) {
        if (obj.MsgContext) {
          try {
            let obj2 = obj.MsgContext.length > 0 ? JSON.parse(obj.MsgContext[0]) : ''
            console.log(obj2)
            // obj.MsgContext = JSON.parse(obj.MsgContext)
            obj.from = obj2.from
            obj.to = obj2.to
            obj.value = parseFloat(obj2.value)
            obj.coinType = obj2.coinType
            obj.nonce = obj2.nonce
            obj.gas = obj2.gas
            obj.gasPrice = obj2.gasPrice
            obj.data = obj2.data
          } catch (error) {
            obj.MsgContext = ''
          }
        }
        arr.push(obj)
      }
      this.newsList = arr
    }
  }
}
</script>