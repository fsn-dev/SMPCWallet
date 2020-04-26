<template>
  <div class="boxConntent1">
    <div class="g-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index">
          <div class="labelType rotate_45 flex-c self" v-if="address === item.Account">{{$t('label').initiator}}</div>
          <div class="left">
            <p class="p1">{{item.Key}}</p>
            <div class="flex-sc node-view-style flex-wrap">
              <span v-for="(eNode, indexs) in item.Enodes" :key="indexs" class="eNode flex-sc" :title="eNode">
                <!-- <i class="i">{{$$.cutOut(eNode, 12, 10)}}</i> -->
                <i class="i">{{$$.eNodeCut(eNode).key}}</i>
                <!-- <span>{{ indexs === (item.Enodes.length - 1) ? "" : '、'}}</span> -->
              </span>
            </div>
            <p class="font12 color_99 mt-5">{{$$.timeChange(item.TimeStamp, 'yyyy-mm-dd hh:mm:ss')}}</p>
          </div>
          <el-button v-if="!item.status" @click="toUrl('/gValid', item)" class="btn-primary">{{$t('btn').approval}}</el-button>
          <el-button type="success" v-if="item.status" @click="toUrl('/gValid', item)" class="">{{$t('btn').review}}</el-button>
        </li>
      </ul>
    </div>
    <div v-if="newsList.length <= 0" class="boxConntent1 flex-c font14 color_99 H120">
      {{$t('warn').w_12}}
    </div>
  </div>
</template>

<style lang="scss">
@import './scss/gNewsList';
.node-view-style {
  .eNode {
    width: size(150);height: size(30);padding: 0 size(12);background: $color-primary-sm;margin-right: size(5);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;border-radius: size(30);line-height:size(21);font-size: $text-sm;color: $color-gray-sm;margin-top: size(10);
    .i {
      overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'gNewsList',
  props: {
    gNewsData: {
      type: Object ,
      default: {}
    }
  },
  data () {
    return {
      newsList: [],
      gInfo: {}
    }
  },
  computed: {
    ...computedPub,
  },
  watch: {
    gNewsData (cur) {
      // console.log(cur)
      this.setList(cur.info)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log(this.gNewsData.info)
      this.setList(this.gNewsData.info)
      // this.$$.getGroup().then(gList => {
      //   // console.log(gList)
      //   this.gInfo = {}
      //   if (gList.msg === 'Success') {
      //     for (let obj of gList.info) {
      //       this.gInfo[obj.Gid] = obj
      //     }
      //   }
      //   this.setList(this.gNewsData.info)
      // })
    },
    setList (data) {
      this.newsList = data ? data : []
      // for (let i = 0, len = data.length; i < len; i++) {
      //   let obj = data[i]
      //   obj.Enodes = this.gInfo[obj.GroupId] && this.gInfo[obj.GroupId].Enodes ? this.gInfo[obj.GroupId].Enodes : []
      //   this.newsList.push(obj)
      // }
    },
  }
}
</script>