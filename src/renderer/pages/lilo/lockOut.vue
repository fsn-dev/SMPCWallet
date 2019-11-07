<template>
  <div class="boxConntent1">
    <div class="confirmPage flex-c" v-if="!selectData.isConfirm">
      Please 'Apply Cross-Chain'!
    </div>
    <div class="confirmPage flex-c" v-if="!isSupportCoin">
      {{selectData.coinType}} does not support withdraw!
    </div>
    <div class="receiveContent_box" v-if="selectData.isConfirm && isSupportCoin">
      <!-- <div class="receiveAddress_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……"> -->
      <div class="receiveAddress_box">

        <el-form label-position="top" label-width="80px" @submit.native.prevent>
          <el-form-item :label="addressTitle + '：'">
            <el-input v-model="rawTx.to"></el-input>
          </el-form-item>
          <el-form-item :label="$t('LABEL').AMOUNT + '：'">
            <el-input v-model="rawTx.value" @keypress="keyPressBtn"></el-input>
            <span :class="Number(selectData.balance) === 0 ? 'color_red' : 'color_99'" v-if="selectData.balance">{{Number(selectData.balance) === 0 ? "Insufficient balance" : "Account Balance: " + selectData.balance}}</span>
          </el-form-item>
          <el-form-item label="Advanced:">
            <el-switch v-model="selfSet" :active-value="true" :inactive-value="false"
            ></el-switch>
          </el-form-item>
          <div v-if="selfSet">
            <el-form-item label="Nonce：">
              <el-input v-model="rawTx.nonce"></el-input>
            </el-form-item>
            <el-form-item label="Gas Price：">
              <el-input v-model="rawTx.gasPrice"></el-input>
            </el-form-item>
            <el-form-item label="Gas Limit：">
              <el-input v-model="rawTx.gasLimit"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="receiveAddress_btn flex-c">
          <!-- <button class="btn blue flex-c W240 mt-10" @click="privateSure">{{$t('TITLE').LOCKOUT}}</button> -->
          <el-button class="W240 mt-10" @click="privateSure" type="primary" :loading="loading.btn">{{$t('TITLE').LOCKOUT}}</el-button>
        </div>
      </div>

      <div class="tableHistory_box">
        <hgroup class="tableHistory_title">
          <h3 class="title">{{$t('TITLE').HISTORY}}:</h3>
        </hgroup>
        <div class="tableHistory_table table-responsive"
          v-loading="loading.history"
          element-loading-text="Loading……">
          <el-table
            :data="historyData"
            style="width: 100%"
            empty-text="Null"
          >
            <el-table-column
              :label="$t('THEAD').PUBLIC.STATUS"
              width="80"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.status" :class="scope.row.status !== 'Success' ? 'red' : ''"></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').COIN" prop="coinType" width="80"></el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.AMOUNT" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.contractValue ? scope.row.contractValue : scope.row.value}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.DATE" prop="date" width="180"></el-table-column>
            <el-table-column :label="$t('THEAD').PUBLIC.INFORMATION" min-width="360">
              <template slot-scope="scope">
                <el-collapse class="moreInfo_box" accordion v-model="activeNames">
                  <el-collapse-item :title="scope.row.hash">
                    <ul class="list">
                      <li>{{$t('LABEL').TXID}}：{{scope.row.hash}}</li>
                      <li>{{$t('LABEL').ADDRESS}}：{{scope.row.contractTo}}</li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex-ec mt-20" v-if="pageInfo.total > 1">
            <el-pagination
              @prev-click="prevClick"
              @next-click="nextClick"
              :page-size="pageInfo.pageNum"
              :pager-count="5"
              layout="prev, pager, next"
              :total="pageInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('TITLE').LOCKOUT" :visible.sync="privateSureVisible" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="rawTx" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>


    <el-dialog
      :title="$t('TITLE').TO_SEND"
      :visible.sync="sendInfoVisible"
      width="60%"
      :before-close="modalClick"
      >
      <div class="sendInfo_box">
        <ul>
          <li><h3>To Address:</h3><span>{{rawTx.to}}</span></li>
          <li><h3>From Address:</h3><span>{{address}}</span></li>
          <li><h3>Amount to Send:</h3><span>{{rawTx.value}}</span></li>
          <li><h3>Account Balance:</h3><span>{{Number(selectData.balance)}} {{selectData.coinType}}</span></li>
          <li><h3>Coin:</h3><span>{{selectData.coinType}}</span></li>
          <li><h3>Network:</h3><span>{{netWorkInfo}}</span></li>
          <li><h3>Gas Limit:</h3><span>{{rawTx.gasLimit}}</span></li>
          <li><h3>Gas Price:</h3><span>{{rawTx.gasPrice}}</span></li>
          <li><h3>Max TX Fee:</h3><span>{{maxFee}}</span></li>
          <li><h3>Nonce:</h3><span>{{rawTx.nonce}}</span></li>
          <li><h3>Data:</h3><span>{{rawTx.data}}</span></li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="modalClick">{{$t('BTN').GET_OUT}}</el-button>
        <el-button type="primary" size="small" @click="sendDatabase" :disabled="sendBtnFlag">{{$t('BTN').YES_SURE}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {data, computed, methods} from '@/assets/js/pages/txnsPages'
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: "lockOut",
  props: ["selectData"],
  data () {
    return {
      ...data,
      refreshTable: null,
      sendInfoVisible: false,
      selfSet: false,
      serializedTxView: false,
      isRefreshStart: true,
      isSupportCoin: true
    }
  },
  watch: {
    selectData (cur, old) {
      this.rawTx.from = this.selectData.address
      this.rawTx.data = ''
      this.rawTx.to = ""
      this.rawTx.value = ""
      this.loading.history = true
      this.isSupportCoin = this.selectData.isLockout
    }
  },
  computed: {
    ...computedPub,
    ...computed,
    addressTitle: function () {
      return this.selectData.coinType + " Withdraw Address"
    },
  },
  mounted () {
    if (Number(this.$$.getCookies('safeMode'))) {
      this.selfSet = Number(this.$$.getCookies('safeMode')) ? true : false
      this.loading.screen = false
    }
  },
  methods: {
    ...methods,
    getElDialogView () {
      this.modalClick()
    },
    modalClick () {
      this.$router.push("/LILO/lockOut")
      this.privateSureVisible = false
      this.sendInfoVisible = false
      this.sendBtnFlag = false
    },
    // getSignData (data) {
    //   console.log(data)
    //   if (data.signTx) {
    //     if (Number(this.$$.getCookies('safeMode'))) {
    //       this.serializedTxView = true
    //       this.sendInfoVisible = false
    //       this.qrcode(this.signTx)
    //     } else {
    //       this.sendDatabase(data.signTx)
    //       this.rawTx.nonce = data.nonce
    //       this.rawTx.gasLimit = data.gasLimit
    //       this.rawTx.gasPrice = data.gasPrice
    //       this.rawTx.data = data.data
    //       this.sendInfoVisible = true
    //     }
    //     this.signTx = data.signTx ? data.signTx : ''
    //     this.maxFee = this.$$.fromWei(Number(data.gasPrice) * Number(data.gasLimit), "ether")
    //   } else {
    //     this.sendInfoVisible = false
    //     this.$message.error(this.selectData.coinType + this.$t('ERROR_TIP').TIP_6)
    //   }
    //   this.privateSureVisible = false
    // },
    getDatabaseInfo () {
      if (!this.selectData.isConfirm) {
        return
      }
      this.isRefreshStart = false
      this.$socket.emit('lockOutHistory', {
        from: this.address ? this.address : this.$store.state.address,
        coin: this.selectData.ERC20coin,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        url: this.$store.state.network.url
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.refreshTable)
    this.refreshTable = null
  }
}
</script>
