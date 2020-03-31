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
              <el-form-item :label="$t('label').groupAccountId + ':'" v-if="networkMode">
                <span>{{ scope.row.pubKey }}</span>
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
        <el-table-column :label="$t('label').groupAccountId" width="180" align="center" v-if="networkMode">
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
import {datas, commonMethods} from './js/common.js'
import {methods} from './js/group.js'
export default {
  name: 'txnsHistory',
  data () {
    return {
      ...datas
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    GroupFindTxns (res) {
      this.initFormat(res)
    }
  },
  mounted () {
    let urlParams = this.$route.query
    // console.log(urlParams)
    this.coinType = urlParams.coinType ? urlParams.coinType : ''
    this.dcrmAddr = urlParams.address ? urlParams.address : ''
    setTimeout(() => {
      this.init()
    }, 100)
  },
  methods: {
    ...commonMethods,
    ...methods,
    init () {
      let data = {
        kId: this.address,
        coinType: this.coinType,
        from: this.dcrmAddr,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      }
      if (this.networkMode) {
        this.$socket.emit('GroupFindTxns', data)
      } else {
        this.$db.FindGroupTxns(data).then(res => {
          this.initFormat(res)
        })
      }
      // FindGroupTxnsFn(this, 'GroupFindTxns', data).then(res => {
      //   this.initFormat(res)
      // })
    },
    getHistoryState (id, key, index) {
      this.$$.getLockOutStatus(key).then(res => {
        this.getStateFormat(id, index, res)
      }).catch(err => {
        console.log(err)
        this.msgError(err)
      })
    },
    setDBState (id, index, hash, status) {
      let data = {
        id: id,
        hash: hash,
        status: status
      }
      // EditGroupTxnsFn(this, 'changeGroupTxnsStatus', data)
      if (this.networkMode) {
        this.$socket.emit('changeGroupTxnsStatus', data)
      } else {
        this.$db.EditGroupTxns(data)
      }
    },
  }
}
</script>
