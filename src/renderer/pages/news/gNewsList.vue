<template>
  <div class="boxConntent1" v-loading="loading.list" :element-loading-text="$t('loading').l_1">
    <div class="g-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index">
          <div class="left">
            <p class="p1">{{item.Key}}</p>
            <div class="flex-sc node-view-style flex-wrap">
              <span v-for="(eNode, indexs) in item.Enodes" :key="indexs" class="eNode flex-sc" :title="eNode">
                <!-- <i class="i">{{$$.cutOut(eNode, 12, 10)}}</i> -->
                <i class="i">{{splitNode(eNode)}}</i>
                <!-- <span>{{ indexs === (item.Enodes.length - 1) ? "" : '、'}}</span> -->
              </span>
            </div>
          </div>
          <el-button @click="toUrl('/gValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
        </li>
      </ul>
    </div>
    <div v-if="newsList.length <= 0" class="boxConntent1 flex-c font14 color_99">
      {{$t('warn').w_12}}
    </div>
  </div>
</template>

<style lang="scss">
@import './scss/gNewsList';
.node-view-style {
  .eNode {
    width: size(150);height: size(30);padding: 0 size(12);background: $color-primary-sm;margin-right: size(5);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;border-radius: size(30);line-height:size(21);font-size: $text-sm;color: $color-gray-sm;margin-top: size(10);
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'gNewsList',
  data () {
    return {
      newsList: [],
      loading: {
        list: true
      },
      gInfo: {}
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.initTxnsList()
    // this.$$.reqAccountList()
  },
  methods: {
    initTxnsList () {
      this.$$.reqAccountList(this.address).then(res => {
        console.log(res)
        this.$$.getGroup().then(gList => {
          // console.log(gList)
          this.gInfo = {}
          if (gList.msg === 'Success') {
            for (let obj of gList.info) {
              this.gInfo[obj.Gid] = obj
            }
          }
          this.newsList = []
          for (let obj of res.info) {
            obj.Enodes = this.gInfo[obj.GroupId] && this.gInfo[obj.GroupId].Enodes ? this.gInfo[obj.GroupId].Enodes : []
            this.newsList.push(obj)
          }
          this.$emit('gNewsTip', this.newsList.length)
          this.loading.list = false
        }).catch(err => {
          console.log(err)
          this.msgError(err.error)
          this.loading.list = false
        })
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
        this.loading.list = false
      })
    },
    splitNode (eNode) {
      return eNode.match(/enode:\/\/(\S*)@/)[1]
    }
  }
}
</script>