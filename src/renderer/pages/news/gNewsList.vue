<template>
  <div class="boxConntent1" v-loading="loading.list" :element-loading-text="$t('loading').l_1">
    <div class="g-news-list-box" v-if="newsList.length > 0">
      <ul>
        <li class="item flex-bc" v-for="(item, index) in newsList" :key="index">
          <!-- <div class="labelType rotate_45 flex-c self" v-if="address === item.Account">{{$t('label').initiator}}</div> -->
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
// import {uodateStatus, findStatus, removeStatus} from '@/db/status'
import {methods} from './js/common'
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
    setTimeout(() => {
      this.initTxnsList()
      this.removeStatus()
    }, 100)
    // this.$$.reqAccountList()
  },
  methods: {
    ...methods,
    async initTxnsList () {
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
          // for (let obj of res.info) {
          for (let i = 0, len = res.info.length; i < len; i++) {
            let obj = res.info[i]
            obj.Enodes = this.gInfo[obj.GroupId] && this.gInfo[obj.GroupId].Enodes ? this.gInfo[obj.GroupId].Enodes : []
            obj.status = 0
            this.newsList.push(obj)
            this.getKeyStatus(obj.Key, i, '1')
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
    // getKeyStatus (key, i) {
    //   findStatus({
    //     key: key,
    //     type: 1
    //   }).then(res => {
    //     console.log(res)
    //     if (res.length > 0 && res[0].status) {
    //       this.newsList[i].status = 1
    //     } else {
    //       this.updateStaus(key, i)
    //     }
    //   })
    // },
    // updateStaus (key, i) {
    //   uodateStatus({
    //     key: key,
    //     type: 1,
    //     status: 0
    //   }).then(res => {
    //     console.log(res)
    //   })
    // },
    // async removeStatus () {
    //   let nowDate = Date.now()
    //   findStatus({}).then(res => {
    //     console.log(res)
    //     if (res.length > 0) {
    //       for (let obj of res) {
    //         if ((nowDate - obj.updatetime) > (1000 * 60 * 30)) {
    //           removeStatus({key: obj.key})
    //         }
    //       }
    //     }
    //   })
    // },
    splitNode (eNode) {
      return eNode.match(/enode:\/\/(\S*)@/)[1]
    }
  }
}
</script>