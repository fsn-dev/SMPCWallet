<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-20">
      <el-breadcrumb-item :to="{ path: '/group' }">{{$t('title').groupAccount}}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: '/person' }" v-if="Number(safeMode) === 1">{{$t('title').personAccount}}</el-breadcrumb-item> -->
      <el-breadcrumb-item>{{$t('label').groupHistory}}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item v-if="coinType">{{$$.cutERC20(coinType).coinType}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="dcrmAddr">{{dcrmAddr}}</el-breadcrumb-item> -->
    </el-breadcrumb>

    <div class="table-box mt-20">
      <el-table :data="tableData" border style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column :label="$t('state').name" width="90" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.status ? 'color_green' : 'color_red'">{{$$.changeState(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('btn').group" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.gId">{{ $$.cutOut(scope.row.gId, 20, 12) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('label').to" width="200" align="center">
          <template slot-scope="scope" @click="copyTxt(scope.row)">
            {{$$.cutOut(scope.row.to, 6, 4)}}
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('label').date" width="200" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('label').value" width="100" align="center">
          <template slot-scope="scope">
            {{$$.thousandBit(scope.row.value, 2)}}
          </template>
        </el-table-column> -->
        <!-- <el-table-column :label="$t('label').hash" align="center">
          <template slot-scope="scope" @click="copyTxt(scope.row)">
            {{scope.row}}
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-pagination
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.cur"
        :page-sizes="[50, 100, 200, 300, 400]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination> -->
    </div>
    <div class="mt-20 flex-ec">
      <el-pagination
        hide-on-single-page
        @current-change="handleCurrentChange"
        :current-page="page.cur"
        background
        layout="prev, pager, next"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<style lang="scss">
// .table-box {

// }
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'txnsHistory',
  data () {
    return {
      tableData: [],
      coinType: '',
      dcrmAddr: '',
      baseUrl: '',
      page: {
        cur: 0,
        total: 500
      }
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    GroupAccountsFind (res) {
      console.log(res)
      if (res.msg === 'Success' && res.info.length > 0) {
        this.page.total = res.total
        // this.tableData = res.info
        this.tableData = []
        for (let obj of res.info) {
          let _s = true
          for (let obj1 of obj.member) {
            if (obj1.status === 4) {
              _s = false
              break
            }
          }
          obj.status = _s
          this.tableData.push(obj)
        }
      } else {
        this.page.total = 0
        this.tableData = []
      }
    },
  },
  mounted () {
    let urlParams = this.$route.query
    // console.log(urlParams)
    this.coinType = urlParams.coinType ? urlParams.coinType : ''
    this.dcrmAddr = urlParams.address ? urlParams.address : ''
    this.initData()
  },
  methods: {
    handleCurrentChange (val) {
      // console.log(val)
      // console.log(this.page.cur)
      this.page.cur = val
      this.emitUrl()
    },
    initData () {
      if (Number(this.safeMode) === 1) {
        this.baseUrl = 'GroupAccountsFind'
      } else {
        this.baseUrl = 'GroupAccountsFind'
      }
      this.emitUrl()
    },
    emitUrl () {
      this.$socket.emit(this.baseUrl, {
        // eNode: this.eNode,
        kId: this.address,
        pageNum: this.page.cur
      })
    }
  }
}
</script>
