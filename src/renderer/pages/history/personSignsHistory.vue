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
                <span v-if="refresh.g">{{ scope.row.gName ? scope.row.gName : scope.row.gId }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').groupAccountId + ':'">
                <span v-if="refresh.a">{{ scope.row.aName ? scope.row.aName : scope.row.pubKey }}</span>
              </el-form-item>
              <el-form-item :label="$t('label').mode + ':'">
                <span>{{scope.row.mode}}</span>
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
            <span :title="scope.row.pubKey" @click="copyTxt(scope.row.pubKey)" class="cursorP" v-if="refresh.a">{{scope.row.aName ? scope.row.aName : $$.cutOut(scope.row.pubKey, 8, 6)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').from" width="120" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.from" @click="copyTxt(scope.row.from)" class="cursorP">{{$$.cutOut(scope.row.from, 6, 4)}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').to" width="120" align="center">
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
        <el-table-column :label="$t('label').action" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openSignEdialog(scope.row)" v-if="scope.row.rsv && refresh.s">{{$t('btn').createSign}}</el-button>
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

    <el-dialog :title="$t('label').signTxn" :visible.sync="eDialog.signTxn" width="960px" :before-close="modalClick" :close-on-click-modal="false" :modal-append-to-body='false'>
      <div class="flex-bc">
        <p class="mr-10">{{signTxn}}</p>
        <div id="signTxnsId"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="copyTxt(signTxn)">{{$t('btn').copy}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {datas, commonMethods} from '@/assets/js/pages/history/common.js'
import {methods} from '@/assets/js/pages/history/person.js'
export default {
  name: 'txnsHistory',
  data () {
    return {
      ...datas,
      eDialog: {
        signTxn: false
      },
      signTxn: ''
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
        kId: this.address,
        coinType: this.coinType,
        from: this.dcrmAddr,
        pageSize: this.page.pageSize,
        pageNum: this.page.cur
      }
      this.$db.FindPersonSigns(data).then(res => {
        this.initFormat(res)
      })
    },
    modalClick () {
      this.eDialog.signTxn = false
    },
    openSignEdialog (item) {
      console.log(item)
      // let dataObj = {
      //   TxType: "LOCKOUT",
      //   DcrmAddr: item.from,
      //   DcrmTo: item.to,
      //   Value: item.value,
      //   Cointype: item.coinType,
      //   GroupId: item.gId,
      //   ThresHold: item.mode,
      //   Mode: '1',
      //   TimeStamp: Date.now().toString(),
      //   Memo: item.nonce,
      // }
      // let data = {
      //   nonce: item.nonce,
      //   value: '0',
      //   data: JSON.stringify(dataObj)
      // }
      let dataObj = {
        from: item.from,
        to: item.to,
        value: item.value,
        coinType: item.coinType,
        // GroupId: item.gId,
        ThresHold: item.mode,
        Mode: '1',
        TimeStamp: Date.now().toString(),
        rsv: item.rsv,
        hash: item.hash,
        gas: item.extendObj.gas,
        gasPrice: item.extendObj.gasPrice,
        nonce: item.extendObj.nonce,
        data: item.data,
        // Memo: item.nonce,
      }
      // this.signTxn = this.$$.toSignRsv(data)
      
      let str = JSON.stringify(dataObj)
      this.signTxn = this.$$.web3.utils.utf8ToHex(str)
      this.eDialog.signTxn = true
      this.$nextTick(() => {
        this.$$.qrCode(this.signTxn, 'signTxnsId')
      })
    },
    getHistoryState (id, key, index) {
      this.$$.getSignStatus(key).then(res => {
        console.log(res)
        this.getStateFormat(id, index, res)
      })
    },
    setDBState (id, index, hash, status) {
      let data = {
        id: id,
        rsv: hash,
        status: status
      }
      this.refresh.s = false
      this.$nextTick(() => {
        this.refresh.s = true
      })
      this.$db.EditPersonSigns(data)
    },
  }
}
</script>
