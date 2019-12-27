<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-20">
      <el-breadcrumb-item :to="{ path: '/group' }" v-if="Number(safeMode) === 0">{{$t('title').groupAccount}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/person' }" v-if="Number(safeMode) === 1">{{$t('title').personAccount}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('label').txnHistory}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="coinType">{{$$.cutERC20(coinType).coinType}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="dcrmAddr">{{dcrmAddr}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table-box mt-20">
      <el-table :data="tableData" border style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column :label="$t('state').name" width="90" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.status === 0 || scope.row.status === 1 ? 'color_green' : 'color_red'">{{$$.changeState(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').coinType" width="90" align="center">
          <template slot-scope="scope">
            {{ $$.cutERC20(scope.row.coinType).coinType}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').to" width="200" align="center">
          <template slot-scope="scope" @click="copyTxt(scope.row)">
            <span :title="scope.row.to" @click="copyTxt(scope.row.to)" class="cursorP">{{$$.cutOut(scope.row.to, 10, 6)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').date" width="180" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').value" width="100" align="center">
          <template slot-scope="scope">
            {{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 'no')
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').hash" align="center">
          <template slot-scope="scope" @click="copyTxt(scope.row)">
            <span :title="scope.row.hash" @click="copyTxt(scope.row.hash)" class="cursorP">{{scope.row.hash}}</span>
          </template>
        </el-table-column>
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
        :page-size="page.pageSize"
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
        pageSize: 10,
        total: 0
      }
    }
  },
  sockets: {
    PersonFindTxns (res) {
      console.log(res)
      if (res.msg === 'Success' && res.info.length > 0) {
        this.page.total = res.total
        this.formatData(res.info)
        // this.tableData = res.info
      } else {
        this.page.total = 0
        this.tableData = []
      }
    },
    GroupFindTxns (res) {
      console.log(res)
      if (res.msg === 'Success' && res.info.length > 0) {
        this.page.total = res.total
        this.formatData(res.info)
        // this.tableData = res.info
      } else {
        this.page.total = 0
        this.tableData = []
      }
    }
  },
  watch: {
    safeMode (cur) {
      // console.log(cur)
      this.page.cur = 0
      this.page.total = 0
      this.toUrl('/txnsHistory')
      this.initData()
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    // let urlParams = this.$route.query
    // // console.log(urlParams)
    // this.coinType = urlParams.coinType ? urlParams.coinType : ''
    // this.dcrmAddr = urlParams.address ? urlParams.address : ''
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
      let urlParams = this.$route.query
      // console.log(urlParams)
      this.coinType = urlParams.coinType ? urlParams.coinType : ''
      this.dcrmAddr = urlParams.address ? urlParams.address : ''
      if (Number(this.safeMode) === 1) {
        this.baseUrl = 'PersonFindTxns'
      } else {
        this.baseUrl = 'GroupFindTxns'
      }
      this.emitUrl()
    },
    emitUrl () {
      let data = {
        coinType: this.coinType,
        from: this.dcrmAddr,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      }
      console.log(data)
      this.$socket.emit(this.baseUrl, data)
    },
    formatData (data) {
      this.tableData = []
      // console.log()
      for (let i = 0, len = data.length; i < len; i++) {
        let dataObj = data[i]
        dataObj.status = 0
        // console.log(dataObj)
        for (let obj of dataObj.member) {
          if (obj.status === 0 || obj.status === 2 || obj.status === 4 || obj.status === 6) {
            dataObj.status = obj.status
            break
          }
        }
        // this.getTxnsHash(dataObj.key, i, dataObj.hash)
        if (!dataObj.hash && dataObj.status === 1) {
          this.getTxnsHash(dataObj.key, i, dataObj.hash)
        }
        console.log(dataObj.status)
        this.tableData.push(dataObj)
      }
    },
    getTxnsHash (key, index, hash) {
      this.$$.getLockOutStatus(key).then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.status === 'Success') {
          this.setDBhash(key, index, hash)
        }
      }).catch(err => {
        this.msgError(err.error.toString())
      })
    },
    setDBhash (key, index, hash) {
      this.$socket.emit('GroupEditTxns', {
        hash: hash,
        key: key
      })
    }
  }
}
</script>
