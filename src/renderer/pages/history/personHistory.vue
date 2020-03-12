<template>
  <div class="boxConntent1" v-loading="loading.history" element-loading-text="Loading……">
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
                  <!-- <el-table-column :label="$t('label').date" width="140" align="center">
                    <template slot-scope="props">
                      {{props.row.timestamp ? $$.timeChange(props.row.timestamp, 'yyyy-mm-dd hh:mm') : ''}}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('state').name" width="90" align="center">
                    <template slot-scope="props">
                      <span :class="props.row.status === 0 || props.row.status === 1 || props.row.status === 5 ? 'color_green' : 'color_red'">{{$$.changeState(props.row.status)}}</span>
                    </template>
                  </el-table-column> -->
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
  sockets: {
    PersonAccountsFind (res) {
      // console.log(res)
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
  },
  mounted () {
    let urlParams = this.$route.query
    // console.log(urlParams)
    this.coinType = urlParams.coinType ? urlParams.coinType : ''
    this.dcrmAddr = urlParams.address ? urlParams.address : ''
    this.initData()
    // this.$$.reqAccountStatus('0xd4b0c2c5830ae6869364761f03eeebf694ea839722ae37916db98325808f75f0').then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    handleCurrentChange (val) {
      this.page.cur = val
      this.emitUrl()
    },
    initData () {
      this.baseUrl = 'PersonAccountsFind'
      this.emitUrl()
    },
    emitUrl () {
      this.$socket.emit(this.baseUrl, {
        // eNode: this.eNode,
        kId: this.address,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
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
        this.getAccountPub(dataObj._id, dataObj.key, i)
        this.tableData.push(dataObj)
        this.loading.history = false
      }
    },
    getAccountPub (id, key, index) {
      this.$$.reqAccountStatus(key).then(res => {
        console.log(res)
        if (res.msg === 'Success' && (res.status === 'Success' || res.pubKey)) {
          let pubKey = res.pubKey
          this.setAccountDBState(id, index, pubKey, 1)
          this.tableData[index].pubKey = pubKey
          this.tableData[index].status = 1
        } else if (res.status === 'Failure') {
          this.setAccountDBState(id, index, '', 2)
          this.tableData[index].status = 2
        } else if (res.status === 'Timeout') {
          this.setAccountDBState(id, index, '', 6)
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
    setAccountDBState (id, index, pubKey, status) {
      this.$socket.emit('changePersonAccountsEdit', {
        id: id,
        pubKey: pubKey,
        status: status
      })
    },
  }
}
</script>
