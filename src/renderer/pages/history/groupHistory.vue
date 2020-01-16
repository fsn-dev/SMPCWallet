<template>
  <div class="boxConntent1" v-loading="loading.history" element-loading-text="Loading……">
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
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span class="cursorP" :title="scope.row.key" @click="toUrl('/gValid', {key: scope.row.keyId})">{{ $$.cutOut(scope.row.key, 20, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').groupId" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.gId">{{ $$.cutOut(scope.row.gId, 20, 12) }}</span>
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
  watch: {
    safeMode (cur) {
      if (Number(cur) === 1) {
        this.toUrl('/person')
      }
    }
  },
  sockets: {
    GroupAccountsFind (res) {
      console.log(res)
      let nowTime = Date.now()
      if (res.msg === 'Success' && res.info.length > 0) {
        this.page.total = res.total
        // this.tableData = res.info
        this.tableData = []
        for (let obj of res.info) {
          let _s = obj.status, _s1 = 0
          if (_s === 0) {
            for (let obj1 of obj.member) {
              if (obj1.status === 5) {
                _s1 += 1
              }
            }
          }
          if (_s1 === obj.member.length && obj.status !== 1) {
            _s = 1
            this.$socket.emit('changeGroupAccountsEdit', {
              keyId: obj.keyId,
              status: _s
            })
          } else if (obj.status === 0 && _s1 < obj.member.length && (nowTime - obj.timestamp) >= this.$$.config.timeout) {
            _s = 6
            this.$socket.emit('changeGroupAccountsEdit', {
              keyId: obj.keyId,
              status: _s
            })
          }
          obj.status = _s
          this.tableData.push(obj)
        }
        this.loading.history = false
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
  },
  methods: {
    handleCurrentChange (val) {
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
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      })
    }
  }
}
</script>
