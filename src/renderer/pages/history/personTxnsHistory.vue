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
              <el-form-item :label="$t('label').groupAccountId + ':'">
                <span>{{ scope.row.pubKey }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').hash + ':'">
                <span>{{ scope.row.hash }}</span>
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
                <span>{{ $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 6) }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').date + ':'">
                <span>{{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="40">
        </el-table-column>
        <el-table-column :label="$t('state').name" width="80" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 5 ? 'color_green' : 'color_red'">{{$$.changeState(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').coinType" width="85" align="center">
          <template slot-scope="scope">
            {{ $$.cutERC20(scope.row.coinType).coinType}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').groupAccountId" width="180" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.pubKey" @click="copyTxt(scope.row.pubKey)" class="cursorP">{{$$.cutOut(scope.row.pubKey, 8, 6)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').from" width="150" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.from" @click="copyTxt(scope.row.from)" class="cursorP">{{$$.cutOut(scope.row.from, 6, 4)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').to" width="150" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.to" @click="copyTxt(scope.row.to)" class="cursorP">{{$$.cutOut(scope.row.to, 6, 4)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').date" width="160" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').value" width="120" align="right">
          <template slot-scope="scope">
            {{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 'no')
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').hash" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.hash" @click="copyTxt(scope.row.hash)" class="cursorP">{{$$.cutOut(scope.row.hash, 8, 6)}}</span>
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
    changePersonTxnsStatus (res) {
      console.log(res)
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
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
      this.baseUrl = 'PersonFindTxns'
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
          this.getTxnsHash(dataObj._id, dataObj.key, i)
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
          this.tableData[index].status = 1
        } else if (res.status === 'Failure' || res.info === 'Failure') {
          this.setTxnsDBState(id, index, '', 2)
          this.tableData[index].status = 2
        } else if (res.status === 'Timeout' || res.info === 'Timeout') {
          this.setTxnsDBState(id, index, '', 6)
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
    setTxnsDBState (id, index, hash, status) {
      this.$socket.emit('changePersonTxnsStatus', {
        id: id,
        hash: hash,
        status: status
      })
    },
  }
}
</script>
