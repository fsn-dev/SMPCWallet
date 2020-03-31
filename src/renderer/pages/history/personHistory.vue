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

import {datas, commonMethods} from './js/common.js'
import {methods} from './js/person.js'
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
    PersonAccountsFind (res) {
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
        // eNode: this.eNode,
        kId: this.address,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      }
      if (this.networkMode) {
        this.$socket.emit('PersonAccountsFind', data)
      } else {
        this.$db.FindPersonAccounts(data).then(res => {
          this.initFormat(res)
        })
      }
      // FindPersonAccountsFn(this, 'PersonAccountsFind', data).then(res => {
      //   this.initFormat(res)
      // })
    },
    getHistoryState (id, key, index) {
      this.$$.reqAccountStatus(key).then(res => {
        this.getStateFormat(id, index, res)
      }).catch(err => {
        console.log(err)
        this.msgError(err)
      })
    },
    setDBState (id, index, pubKey, status) {
      let data = {
        id: id,
        pubKey: pubKey,
        status: status
      }
      // EditPersonAccountsFn(this, 'changePersonAccountsEdit', data)
      if (this.networkMode) {
        this.$socket.emit('changePersonAccountsEdit', data)
      } else {
        this.$db.EditPersonAccounts(data)
      }
    },
  }
}
</script>
