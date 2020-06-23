<template>
  <div class="boxConntent1" v-loading="loading.history" :element-loading-text="$t('loading').l_1">
    <div class="table-box" v-if="refresh.s">
      <el-table :data="tableData" style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="tables-expand">
              <el-form-item label="ID">
                <span>{{ scope.row.key }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupId + ':'">
                <span v-if="refresh.g">{{ scope.row.gName ? scope.row.gName : scope.row.gId }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupAccountId + ':'" v-if="networkMode && !isView.pubKey">
                <span v-if="refresh.a">{{ scope.row.aName ? scope.row.aName : scope.row.pubKey }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').mode + ':'">
                <span>{{scope.row.mode}}</span>
              </el-form-item>
              <el-form-item :label="$t('label').from + ':'" v-if="!isView.from">
                <span>{{ scope.row.from }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').outHash + ':'" v-if="!isView.outHash && networkMode">
                <span>{{ scope.row.extendObj && scope.row.extendObj.hash ? scope.row.extendObj.hash : '' }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').to + ':'"  v-if="!isView.to">
                <span>{{ scope.row.to }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').coinType + ':'" v-if="!isView.coinType">
                <span>{{ $$.cutERC20(scope.row.coinType).coinType}}</span>
              </el-form-item>
              <el-form-item :label="$t('label').value + ':'" v-if="!isView.coinType && !isView.value">
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
        <el-table-column :label="$t('label').coinType" width="85" align="center" v-if="!isView.coinType">
          <template slot-scope="scope">
            {{ $$.cutERC20(scope.row.coinType).coinType}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').groupAccountId" width="180" align="center" v-if="networkMode && isView.pubKey">
          <template slot-scope="scope">
            <span :title="scope.row.pubKey" @click="copyTxt(scope.row.pubKey)" class="cursorP" v-if="refresh.a">{{scope.row.aName ? scope.row.aName : $$.cutOut(scope.row.pubKey, 8, 6)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').from" width="150" align="center" v-if="!isView.from">
          <template slot-scope="scope">
            <span :title="scope.row.from" @click="copyTxt(scope.row.from)" class="cursorP">{{$$.cutOut(scope.row.from, 6, 4)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').to" width="150" align="center" v-if="!isView.to">
          <template slot-scope="scope">
            <span :title="scope.row.to" @click="copyTxt(scope.row.to)" class="cursorP">{{$$.cutOut(scope.row.to, 6, 4)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').date" width="160" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').value" width="120" align="right" v-if="!isView.coinType && !isView.value">
          <template slot-scope="scope">
            {{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 'no')
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').RSV" align="center" v-if="!isView.rsv">
          <template slot-scope="scope">
            <span 
              :title="scope.row.rsv.join(',')"
              @click="copyTxt(scope.row.rsv.join(','))"
              class="cursorP"
            >
              {{scope.row.rsv && scope.row.rsv.length > 0 ? $$.cutOut(scope.row.rsv.join(','), 8, 6) : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').outHash" align="center" v-if="!isView.rsv && networkMode">
          <template slot-scope="scope">
            <span
              :title="scope.row.extendObj && scope.row.extendObj.hash ? scope.row.extendObj.hash : ''"
              @click="copyTxt(scope.row.extendObj && scope.row.extendObj.hash ? scope.row.extendObj.hash : '')"
              class="cursorP"
            >
              {{scope.row.extendObj && scope.row.extendObj.hash ? $$.cutOut(scope.row.extendObj.hash, 8, 6) : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').action" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openSignEmit(scope.row)" v-if="scope.row.rsv && scope.row.rsv.length > 0">{{$t('btn').createSign}}</el-button>
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
import {datas, commonMethods} from '@/assets/js/pages/history/common.js'
import {methods} from '@/assets/js/pages/history/group.js'
export default {
  name: 'txnsHistory',
  props: {
    query: {},
    isView: {
      type: Object,
      default: {
        coinType: false,
        pubKey: false,
        from: false,
        to: false,
        value: false,
        rsv: false
      }
    }
  },
  data () {
    return {
      ...datas,
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    SignsFind (res) {
      this.initFormat(res)
    }
  },
  mounted () {
    // let urlParams = this.$route.query
    // // console.log(urlParams)
    // this.coinType = urlParams.coinType ? urlParams.coinType : ''
    // console.log(this.isView)
    // this.dcrmAddr = urlParams.address ? urlParams.address : ''
    this.page.cur = 0
    setTimeout(() => {
      this.init()
    }, 100)
  },
  methods: {
    ...commonMethods,
    ...methods,
    init () {
      this.loading.history = true
      let data = {
        ...this.query,
        // kId: this.address,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      }
      if (this.networkMode) {
        this.$socket.emit('SignsFind', data)
      } else {
        this.$db.FindSigns(data).then(res => {
          this.initFormat(res)
        })
      }
    },
    openSignEmit (item) {
      // console.log(item)
      this.$emit('onClickRSV', item)
    },
    getHistoryState (id, key, index) {
      this.$$.getSignStatus(key).then(res => {
        this.getStateFormat(id, index, res)
      })
    },
    setDBState (id, index, hash, status) {
      let data = {
        id: id,
        rsv: hash,
        status: status
      }
      this.init()
      console.log(data)
      if (this.networkMode) {
        this.$socket.emit('changeSignsStatus', data)
      } else {
        this.$db.EditSigns(data)
      }
    },
  }
}
</script>
