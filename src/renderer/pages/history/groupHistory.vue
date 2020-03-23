<template>
  <div class="boxConntent1" v-loading="loading.history" :element-loading-text="$t('loading').l_1">
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="tables-expand">
              <el-form-item label="Key ID:">
                <span>{{ scope.row.key }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupId + ':'">
                <span>{{ scope.row.gId }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupAccountId + ':'">
                <span>{{ scope.row.pubKey }}</span>
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
                  <el-table-column :label="$t('label').date" width="140" align="center" v-if="networkMode">
                    <template slot-scope="props">
                      {{props.row.timestamp ? $$.timeChange(props.row.timestamp, 'yyyy-mm-dd hh:mm') : ''}}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('state').name" width="90" align="center" v-if="networkMode">
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
        <el-table-column label="Key ID" align="center">
          <template slot-scope="scope">
            <span class="cursorP" :title="scope.row.key">{{ $$.cutOut(scope.row.key, 10, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').groupId" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.gId">{{ $$.cutOut(scope.row.gId, 10, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').groupAccountId" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.pubKey">{{ $$.cutOut(scope.row.pubKey, 10, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').date" width="200" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm:ss')}}
          </template>
        </el-table-column>
      </el-table>
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
import {FindGroupAccountsFn, EditGroupAccountsFn} from '@/api/index.js'
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
      },
      loading: {
        history: true
      }
    }
  },
  computed: {
    ...computedPub,
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
      this.page.cur = val
      this.initData()
    },
    initData () {
      this.baseUrl = 'GroupAccountsFind'
      FindGroupAccountsFn(this, this.baseUrl, {
        // eNode: this.eNode,
        kId: this.address,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      }).then(res => {
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
      })
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
          if (this.networkMode) {
            let state = 0
            if (dataObj.member && dataObj.member.length > 0) {
              let stateObj = { p: 0, a: 0, r: 0 }
              for (let obj of dataObj.member) {
                if (obj.status === 0) stateObj.p ++ 
                if (obj.status === 4) stateObj.r ++ 
                if (obj.status === 5) stateObj.a ++ 
              }
              if (stateObj.r > 0) {
                state = 4
                this.setDBState(dataObj._id, i, '', state)
              } else if (stateObj.a === dataObj.member.length) {
                state = 5
                this.getHistoryState(dataObj._id, dataObj.key, i)
              } else if ((nowTime - dataObj.timestamp) > this.$$.config.timeout && stateObj.p > 0) {
                state = 6
                dataObj.status = state
                this.setDBState(dataObj._id, i, '', state)
              }
              dataObj.status = state
            } else {
              this.getHistoryState(dataObj._id, dataObj.key, i)
            }
          } else {
            this.getHistoryState(dataObj._id, dataObj.key, i)
          }
        } else if (dataObj.status === 5 && !dataObj.hash) {
          this.getHistoryState(dataObj._id, dataObj.key, i)
        }
        // console.log(dataObj.status)
        this.tableData.push(dataObj)
        this.loading.history = false
      }
    },
    getHistoryState (id, key, index) {
      this.$$.reqAccountStatus(key).then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.status === 'Success') {
          let pubKey = res.pubKey
          this.setDBState(id, index, pubKey, 1)
          this.tableData[index].pubKey = pubKey
          this.tableData[index].status = 1
        } else if (res.status === 'Failure') {
          this.setDBState(id, index, '', 2)
          this.tableData[index].status = 2
        } else if (res.status === 'Timeout') {
          this.setDBState(id, index, '', 6)
          this.tableData[index].status = 6
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
    setDBState (id, index, pubKey, status) {
      let data = {
        id: id,
        pubKey: pubKey,
        status: status
      }
      EditGroupAccountsFn(this, 'changeGroupAccountsEdit', data)
    },
  }
}
</script>
