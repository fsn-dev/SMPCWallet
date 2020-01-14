<template>
  <div class="boxConntent1 container pt-30 relative">
    <!-- <div class="history-btn">
      <div class="font14 cursorP line-block H40" v-if="activeName === 'first'" @click="toUrl('/groupHistory')">{{$t('btn').lookHistory}}</div>
      <div class="font14 cursorP line-block H40" v-if="activeName === 'second'" @click="toUrl('/txnsHistory')">{{$t('btn').lookHistory}}</div>
    </div> -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane name="first">
        <span slot="label">{{$t('label').groupHistory}}</span>
        <group-history></group-history>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span v-if="Number(safeMode) === 0" slot="label">{{$t('title').groupAccount + $t('label').txnHistory}}</span>
        <span v-if="Number(safeMode) === 1" slot="label">{{$t('title').personAccount + $t('label').txnHistory}}</span>
        <txns-history></txns-history>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
// .history-btn {
//   position: absolute;top:30px; right: 15px;z-index: 3;color: $color-primary;
// }
// .n-tab-box {
//   .el-tabs__item {
//     color: $color-gray;
//     &.is-active {
//       color: $color-primary;
//     }
//   }
// }
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import groupHistory from './groupHistory'
import txnsHistory from './txnsHistory'
export default {
  name: '',
  data () {
    return {
      activeName: 'first',
      gNewsNum: 0,
      tNewsNum: 0,
    }
  },
  components: {groupHistory, txnsHistory},
  // watch: {
  //   gNewsNum () {
  //     this.initTabView()
  //   },
  //   tNewsNum () {
  //     this.initTabView()
  //   },
  // },
  computed: {
    ...computedPub,
  },
  mounted () {
    
  },
  methods: {
    handleClick () {

    },
    // initTabView () {
    //   if (this.gNewsNum === 0 && this.tNewsNum > 0) {
    //     this.activeName = 'second'
    //   } else {
    //     this.activeName = 'first'
    //   }
    // },
    // getGnewsNum (num) {
    //   // console.log(num)
    //   this.gNewsNum = num ? num : 0
    // },
    // getTnewsNum (num) {
    //   // console.log(num)
    //   this.tNewsNum = num ? num : 0
    // }
  }
}
</script>
