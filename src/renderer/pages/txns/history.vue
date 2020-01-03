<template>
  <div class="boxConntent1 container" v-loading="loading.history" :element-loading-text="$t('loading').l_1">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-20">
      <el-breadcrumb-item :to="{ path: '/group' }" v-if="Number(safeMode) === 0">{{$t('title').groupAccount}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/person' }" v-if="Number(safeMode) === 1">{{$t('title').personAccount}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('label').txnHistory}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="coinType">{{$$.cutERC20(coinType).coinType}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="dcrmAddr">{{dcrmAddr}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="table-box mt-20">
      <el-table :data="tableData" border style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column :label="$t('state').name" width="90" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 5 ? 'color_green' : 'color_red'">{{$$.changeState(scope.row.status)}}</span>
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
        <el-table-column :label="$t('label').value" width="160" align="right">
          <template slot-scope="scope">
            {{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 2)
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').hash" align="center">
          <template slot-scope="scope" @click="copyTxt(scope.row)">
            <span :title="scope.row.hash" @click="copyTxt(scope.row.hash)" class="cursorP">{{scope.row.hash}}</span>
          </template>
        </el-table-column>
      </el-table>
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
      loading: {
        history: true
      },
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
      this.loading.history = true
      if (res.msg === 'Success' && res.info.length > 0) {
        this.page.total = res.total
        this.formatData(res.info)
        // this.tableData = res.info
      } else {
        this.page.total = 0
        this.tableData = []
        this.loading.history = false
      }
    },
    GroupFindTxns (res) {
      console.log(res)
      this.loading.history = true
      if (res.msg === 'Success' && res.info.length > 0) {
        this.page.total = res.total
        this.formatData(res.info)
        // this.tableData = res.info
      } else {
        this.page.total = 0
        this.tableData = []
        this.loading.history = false
      }
    },
    changeGroupTxnsStatus (res) {
      console.log(res)
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
    setTimeout(() => {
      this.initData()
    }, 100)
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
    /**
     * 0: Pending;
     * 1: Success;
     * 2: Failure;
     * 4: Refuse;
     * 5: Agree;
     * 6: Timeout
     */
    formatData (data) {
      this.tableData = []
      let nowTime = Date.now()
      // let timeout = 1000 * 60 * 10
      let timeout = 1000 * 30
      // console.log()
      for (let i = 0, len = data.length; i < len; i++) {
        let dataObj = data[i]
        // dataObj.status = 0
        // console.log('index',i)
        console.log(dataObj.status)
        if (dataObj.status === 0) {
          let state = 0
          if ((nowTime - dataObj.timestamp) < timeout) {
            let stateObj = { p: 0, a: 0, r: 0 }
            for (let obj of dataObj.member) {
              if (obj.status === 0) {
                stateObj.p ++
              }
              if (obj.status === 4) {
                stateObj.r ++
              }
              if (obj.status === 5) {
                stateObj.a ++
              }
            }
            console.log(stateObj)
            if (stateObj.r > 0) {
              state = 4
              this.setTxnsDBState(dataObj._id, i, '', state)
            } else if (stateObj.a === dataObj.member.length) {
              state = 5
              this.getTxnsHash(dataObj._id, dataObj.key, i)
            }
          } else if (dataObj.status === 1 && !dataObj.hash) {
            this.getTxnsHash(dataObj._id, dataObj.key, i)
          } else if ((nowTime - dataObj.timestamp) >= timeout && dataObj.status !== 6) {
            state = 6
            dataObj.status = state
            this.setTxnsDBState(dataObj._id, i, '', state)
          }
        } else if (dataObj.status === 5 && !dataObj.hash) {
          this.getTxnsHash(dataObj._id, dataObj.key, i)
        }
        // console.log(dataObj.status)
        this.tableData.push(dataObj)
        this.loading.history = false
      }
    },
    getTxnsHash (id, key, index) {
      this.$$.getLockOutStatus(key).then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.status === 'Success') {
          this.setTxnsDBState(id, index, hash, 1)
          this.tableData[index].hash = hash
        } else {
          this.setTxnsDBState(id, index, '', 2)
          this.tableData[index].status = 2
        }
      }).catch(err => {
        this.msgError(err.error.toString())
      })
    },
    setTxnsDBState (id, index, hash, status) {
      // console.log('key',key)
      // console.log('index',index)
      // console.log('status',status)
      this.$socket.emit('changeGroupTxnsStatus', {
        id: id,
        hash: hash,
        status: status
      })
    },
  }
}
</script>
