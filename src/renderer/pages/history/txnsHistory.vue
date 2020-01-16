<template>
  <div class="boxConntent1" v-loading="loading.history" :element-loading-text="$t('loading').l_1">
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="tables-expand">
              <el-form-item label="ID">
                <span>{{ scope.row.key }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupId + ':'">
                <span>{{ scope.row.gId }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').from + ':'">
                <span>{{ scope.row.from }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').to + ':'">
                <span>{{ scope.row.to }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').coinType + ':'">
                <span>{{ $$.cutERC20(scope.row.coinType).coinType}}</span>
              </el-form-item>
              <el-form-item :label="$t('label').value + ':'">
                <span>{{ $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 2) }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').date + ':'">
                <span>{{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}</span>
              </el-form-item>
              <el-form-item :label="$t('label').details + ':'">
                <el-table :data="scope.row.member" border style="width: 100%" size="mini">
                  <el-table-column
                    type="index"
                    width="50"
                  ></el-table-column>
                  <el-table-column :label="$t('label').identity" width="90" align="center">
                    <template slot-scope="props">
                      <span>{{props.row.initiate ? $t('label').initiator : $t('label').approver}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="ENODE" align="center">
                    <template slot-scope="props">
                      <span>{{props.row.eNode}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('state').name" width="90" align="center">
                    <template slot-scope="props">
                      <span :class="props.row.status === 0 || props.row.status === 1 || props.row.status === 5 ? 'color_green' : 'color_red'">{{$$.changeState(props.row.status)}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
            <span :title="scope.row.hash" @click="copyTxt(scope.row.hash)" class="cursorP">{{$$.cutOut(scope.row.hash, 18, 12)}}</span>
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
      },
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
      console.log(urlParams)
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
        kId: this.address,
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
      for (let i = 0, len = data.length; i < len; i++) {
        let dataObj = data[i]
        // console.log(dataObj.status)
        if (dataObj.status === 0) {
          let state = 0
          if (dataObj.member && dataObj.member.length > 0) {
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
            // console.log(stateObj)
            if (stateObj.r > 0) {
              state = 4
              this.setTxnsDBState(dataObj._id, i, '', state)
            } else if (stateObj.a === dataObj.member.length) {
              state = 5
              this.getTxnsHash(dataObj._id, dataObj.key, i)
            } else if ((nowTime - dataObj.timestamp) > this.$$.config.timeout && stateObj.p > 0) {
              state = 6
              dataObj.status = state
              this.setTxnsDBState(dataObj._id, i, '', state)
            }
            dataObj.status = state
          } else {
            this.getTxnsHash(dataObj._id, dataObj.key, i)
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
          let hash = res.info.OutTxHash.indexOf('0x') === 0 ? res.info.OutTxHash : ('0x' + res.info.OutTxHash)
          this.setTxnsDBState(id, index, hash, 1)
          this.tableData[index].hash = hash
        } else if (res.status === 'Failure') {
          this.setTxnsDBState(id, index, '', 2)
          this.tableData[index].status = 2
        }
      }).catch(err => {
        console.log(err)
        if (err.error) {
          this.msgError(err.error.toString())
        } else {
          this.msgError(err.toString())
        }
      })
    },
    setTxnsDBState (id, index, hash, status) {
      this.$socket.emit('changeGroupTxnsStatus', {
        id: id,
        hash: hash,
        status: status
      })
    },
  }
}
</script>
