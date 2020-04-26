<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/account' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('label').node}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="12">
      <el-col :span="6" v-for="(item, index) in viewData" :key="index">
        <el-card shadow="always" class="card-style" :class="item.bg">
          <div class="round round1"></div>
          <div class="round round2"></div>
          <h3 class="title">{{item.name}}</h3>
          <p class="count">{{$$.thousandBit(item.count, 'no')}}</p>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="tableData.nodeList" style="width: 100%" empty-text="Null" size="mini" class="mt-30 node-table-box">
      <el-table-column :label="$t('label').nodeName" width="300">
        <template slot-scope="scope">
          <span class="color_33 bold">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label').pubKeyAddr">
        <template slot-scope="scope">
          <span class="cursorP" @click="copyTxt($$.eNodeCut(scope.row.enode).key)" :title="$$.eNodeCut(scope.row.enode).key">
            {{scope.row.enode.length > 22 ? $$.cutOut($$.eNodeCut(scope.row.enode).key, 18, 12) : $$.eNodeCut(scope.row.enode).key}}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label').nodeType">
        <template slot-scope="scope">
          <span>{{setNodeType(scope.row.nodeType)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label').runDays" width="100">
        <template slot-scope="scope">
          <span>
            {{timeToDays(scope.row.timestamp)}}
            <!-- -{{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}} -->
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('state').name" width="100">
        <template slot-scope="scope">
          <!-- <span v-html="scope.row.status" class="color_green"></span> -->
          <span class="color_green" v-if="scope.row.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
          <span class="color_red" v-else-if="scope.row.status === 0"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
          <span class="color_99" v-else><i class="el-icon-question mr-5"></i>{{$t('label').unknown}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss">
$cardH: 197;
.card-style {
  height: size($cardH);padding: 30px 30px;color:#fff;position:relative;overflow: hidden;
  &.blue {
    // background: url('~@/assets/img/tableDateBg/blue.png') no-repeat center;
    background: linear-gradient(#3ebaf8, #1e87ef);
  }
  &.orange {
    // background: url('~@/assets/img/tableDateBg/orange.png') no-repeat center;
    background: linear-gradient(#f7a437, #f7501e);
  }
  &.cyan {
    // background: url('~@/assets/img/tableDateBg/cyan.png') no-repeat center;
    background: linear-gradient(#27f19b, #0db9dd);
  }
  &.red {
    // background: url('~@/assets/img/tableDateBg/red.png') no-repeat center;
    background: linear-gradient(#fe453f, #c91561);
  }
  .round {
    width: size($cardH);height: size($cardH);background: rgba(255,255,255,.1);border-radius: 100%;position: absolute;
  }
  .round1 {
    top: -40px;right: -15px;
  }
  .round2 {
    bottom: -66px;right: -60px;
  }
  .title {
    font-weight: bold;
  }
  .count {
    font-size: 14px;margin-top: 15px;text-align: center;font-size: 50px;margin-top: 20px;
  }
}
.node-table-box  {
  thead tr {
    font-weight: bold;
    .cell {
      color: #333;
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'nodeInfo',
  data () {
    return {
      viewData: [],
      tableData: {}
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    NodeAndOtherData (res) {
      console.log(res)
      this.tableData = res.info
      this.viewData = [
        {name: this.$t('label').nodeNum, count: this.tableData.nodeList ? this.tableData.nodeList.length : 0, bg: 'blue'},
        {name: this.$t('label').userNum, count: this.tableData.UC, bg: 'orange'},
        {name: this.$t('label').accountNum, count: this.tableData.GAC + this.tableData.PAC, bg: 'cyan'},
        {name: this.$t('label').txnsNum, count: this.tableData.GTC + this.tableData.PTC, bg: 'red'},
      ]
    }
  },
  mounted () {
    this.$socket.emit('NodeAndOtherData')
  },
  methods: {
    timeToDays (timestamp) {
      if (!timestamp) return
      let time = Date.now() - timestamp
      let days = time / (1000 * 60 * 60 * 24)
      days = Math.ceil(days)
      return days
    },
    setNodeType (type) {
      let str = ''
      if (type === 0) {
        str = this.$t('label').unionNode
      } else if (type === 1) {
        str = this.$t('label').CBONode
      }
      return str
    }
  }
}
</script>