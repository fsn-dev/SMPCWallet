<template>
  <div class="boxConntent1 container pt-30 relative">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-box">
      <el-tab-pane name="personHistory" v-if="$$.config.accountSwitch.person">
        <span slot="label">{{$t('label').personHistory}}</span>
        <personHistory v-if="activeName === 'personHistory'"></personHistory>
      </el-tab-pane>
      <el-tab-pane name="personTxnsHistory" v-if="$$.config.accountSwitch.person">
        <span slot="label">{{$t('label').personTxnsHistory}}</span>
        <personTxnsHistory v-if="activeName === 'personTxnsHistory'"></personTxnsHistory>
      </el-tab-pane>
      <el-tab-pane name="groupHistory">
        <span slot="label">{{$t('label').groupHistory}}</span>
        <group-history v-if="activeName === 'groupHistory'"></group-history>
      </el-tab-pane>
      <el-tab-pane name="groupTxnsHistory">
        <span slot="label">{{$t('label').groupTxnsHistory}}</span>
        <groupTxnsHistory v-if="activeName === 'groupTxnsHistory'"></groupTxnsHistory>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import personHistory from './personHistory'
import personTxnsHistory from './personTxnsHistory'
import groupHistory from './groupHistory'
import groupTxnsHistory from './groupTxnsHistory'
export default {
  name: '',
  data () {
    return {
      activeName: '',
      gNewsNum: 0,
      tNewsNum: 0,
    }
  },
  components: {personHistory, personTxnsHistory, groupHistory, groupTxnsHistory},

  computed: {
    ...computedPub,
  },
  mounted () {
    // console.log(this.$route)
    let at = this.$route.query.activeTab ? this.$route.query.activeTab : (this.$$.config.accountSwitch.person ? 'personHistory' : 'groupHistory')
    // console.log(at)
    this.activeName = at
  },
  methods: {
    handleClick (type) {
      this.$router.push({path: this.$route.path, query: {activeTab: this.activeName}})
    },
  }
}
</script>
