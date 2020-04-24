<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/account' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('label').node}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="always" class="card-style">
          <h3 class="title">{{$t('label').nodeNum}}</h3>
          <p class="count">{{tableData.nodeList ? tableData.nodeList.length : 0}}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" class="card-style">
          <h3 class="title">{{$t('label').userNum}}</h3>
          <p class="count">{{tableData.UC}}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" class="card-style">
          <h3 class="title">{{$t('label').accountNum}}</h3>
          <p class="count">{{tableData.GAC + tableData.PAC}}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" class="card-style">
          <h3 class="title">{{$t('label').txnsNum}}</h3>
          <p class="count">{{tableData.GTC + tableData.PTC}}</p>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="tableData.nodeList" style="width: 100%" empty-text="Null" size="mini" class="mt-30">
      <el-table-column :label="$t('label').nodeName" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label').publisher" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.publisher}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label').nodeAddr">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label').date">
        <template slot-scope="scope">
          <span>{{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('state').name" width="80">
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
.card-style {
  .title {
    font-weight: bold;
  }
  .count {
    font-size: 14px;margin-top: 15px;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'nodeInfo',
  data () {
    return {
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
    }
  },
  mounted () {
    this.$socket.emit('NodeAndOtherData')
  },
  methods: {

  }
}
</script>