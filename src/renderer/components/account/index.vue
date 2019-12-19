<template>
  <div class="boxConntent1" v-loading="loading.account" :element-loading-text="$t('loading').l_1">
    <div class="flex-bc a-header-box" v-if="!Number(safeMode)">
      <div>
      </div>
      <div @click="gID ? drawer.member = true : ''"><i class="el-icon-menu cursorP"></i></div>
    </div>

    <div class="a-table-box" v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%" empty-text="Null">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('label').coinType" width="180">
          <template slot-scope="scope">
            <div class="flex-sc">
              <div class="coinImg flex-c" v-if="$$.setDollar($$.cutERC20(scope.row.Cointype).coinType)">
                <img :src="$$.setDollar($$.cutERC20(scope.row.Cointype).coinType).logo">
              </div>
              <div class="coinTxt flex-c" v-else>
                {{$$.titleCase($$.cutERC20(scope.row.Cointype).coinType)}}
              </div>
              <span style="margin-left: 10px">{{ $$.cutERC20(scope.row.Cointype).coinType }}</span>
              <i v-if="$$.cutERC20(scope.row.Cointype).type" class="isErc20">ERC20</i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').address">
          <template slot-scope="scope">
            <div class="WW100 ellipsis cursorP" :title="scope.row.DcrmAddr" @click="copyTxt(scope.row.DcrmAddr)">{{ scope.row.DcrmAddr }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').balance" width="120" align="right">
          <template slot-scope="scope">
            {{ isNaN(scope.row.Balance) ? 0 : scope.row.Balance}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').action" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="openReceive(scope.$index, scope.row)">{{$t('btn').enter}}</el-button>
            <el-button size="mini" type="primary" @click="openSendDialog(scope.$index, scope.row)" class="btn-primary">{{$t('btn').out}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-c boxConntent1 color_99" v-if="!gID && !Number(safeMode)">{{$t('warn').w_1}}</div>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>

    <!-- 查看组成员 start -->
    <w-drawer v-model="drawer.member" v-if="drawer.member">
      <div class="d-content-view g-member-list-box">
        <h3 class="h3">{{$t('title').gMember}}</h3>
        <ul class="">
          <li class="item">
            <p class="label flex-sc">
              {{$t('label').admins}} - 1 (<span class="color_green flex-sc font14"><i class="el-icon-user mr-5"></i>{{$t('label').self}}</span>)
            </p>
            {{$$.cutOut($$.eNode, 14, 20)}}
          </li>
          <li class="item" v-for="(item, index) in gMemberInit" :key="index" :title="item.eNode">
            <p class="label flex-sc">
              {{$t('label').admins}} - {{index + 2}}
              (<span class="color_green flex-bc" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
              <span class="color_red flex-bc" v-else><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>)
            </p>
            {{$$.cutOut(item.eNode, 14, 20)}}
          </li>
        </ul>
      </div>
    </w-drawer>
    <!-- 查看组成员 end -->

    <!-- 节点选择 start -->
    <w-drawer v-model="drawer.select" v-if="drawer.select" @on-close="modalClick">
      <div class="d-content-view node-select-box">
        <h3 class="h3">{{$t('title').selectNode}}</h3>
        <div v-if="drawer.select">
          <el-checkbox-group v-model="gMemberSelect" :min="1" class="">
            <el-checkbox :label="$$.eNode">
              <div class="flex-bc">
                {{$$.cutOut($$.eNode, 14, 20)}}
                <span class="color_green flex-bc ml-20"><i class="el-icon-user mr-5"></i>{{$t('label').self}}</span>
              </div>
            </el-checkbox>
            <el-checkbox v-for="(item, index) in gMemberInit" :label="item.eNode" :key="index">
              <div class="flex-bc">
                {{$$.cutOut(item.eNode, 14, 20)}}
                <span class="color_green flex-bc ml-20" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                <span class="color_red flex-bc ml-20" v-else><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="node-select-btn">
          <el-button type="primary" @click="toSendTxnsUrl" :disabled="gMemberSelect.length <= 0" class="btn mt-30 WW100 HH40 font16 btn-primary">{{$t('btn').confirm}}</el-button>
        </div>
        <div class="flex-ec mt-50 font14 color_99 cursorP" @click="toUrl('/history', {
          coinType: sendDataObj.coinType,
          address: sendDataObj.dcrmAccount,
        })">查看历史</div>
      </div>
    </w-drawer>
    <!-- 节点选择 end -->

    <!-- 发送交易 start -->
    <w-drawer v-model="drawer.send" v-if="drawer.send">
      <div class="d-content-view">
        <h3 class="h3">{{$t('label').send}}{{$$.cutERC20(sendDataObj.coinType).coinType}}</h3>
        <el-form ref="userInfoForm" :model="rawTx" label-width="120px" label-position="top">
          <el-form-item :label="$t('label').sendAddr">
            <el-input v-model="rawTx.to"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('label').assets">
            <el-select v-model="sendDataObj.coinType" placeholder="" class="WW100" @change="changeAccount">
              <el-option v-for="(item, index) in tableData" :key="index" :label="$$.cutERC20(item.Cointype).coinType" :value="item.Cointype">
                <div class="flex-sc relative">
                  <div class="coinImg flex-c" v-if="$$.setDollar($$.cutERC20(item.Cointype).coinType)">
                    <img :src="$$.setDollar($$.cutERC20(item.Cointype).coinType).logo">
                  </div>
                  <div class="coinTxt flex-c" v-else>
                    {{$$.titleCase($$.cutERC20(item.Cointype).coinType)}}
                  </div>
                  <span style="margin-left: 10px">{{ $$.cutERC20(item.Cointype).coinType }}</span>
                  <i v-if="$$.cutERC20(item.Cointype).type" class="isErc20 isErc20_1">ERC20</i>
                </div>
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item :label="$t('label').amount">
            <el-input type="number" v-model="rawTx.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openPwdDialog(2)" class="btn mt-30 WW100 HH40 font16 btn-primary">{{$t('label').send}}</el-button>
          </el-form-item>
        </el-form>
        <div class="flex-ec mt-50 font14 color_99 cursorP" @click="toUrl('/history', {
          coinType: sendDataObj.coinType,
          address: sendDataObj.dcrmAccount,
        })">查看历史</div>
      </div>
    </w-drawer>
    <!-- 发送交易 end -->
  </div>
</template>

<style lang="scss">
.a-header-box {
  width: 100%;padding: size(12) size(20);border-bottom: size(1) solid #eee;
}
$coinSize: 25;
.coinImg {
  width: size($coinSize);height: size($coinSize);
  img {
    max-width: 100%;max-height: 100%;
  }
}
.coinTxt {
  width: size($coinSize);height: size($coinSize);border:size(1) solid $color-primary;border-radius: 100%;color: $color-primary;
}
.a-table-box {
  width: 100%;padding: size(0) size(20);
  .el-table {
    background: none;
    th, tr {
      background: none;
    }
  }
}
.d-content-view {
  width: 100%;
  .h3 {
    font-size: $text-lg;line-height: size(36);margin-bottom: size(20);
  }
}
.g-member-list-box {
  .item {
    width: 100%;padding: size(10) size(0);color:$color-gray-sm;
  }
}
.node-select-box {
  .el-checkbox-group {
    .el-checkbox {
      margin-bottom: size(20);
    }
  }
}
.isErc20 {position:absolute;top:5px;right: 0;font-size: 10px;color:#fff;font-style: italic;padding:0 5px;background: #004a7c;border-radius: 5px;transform: scale(0.6);}
.isErc20_1{top: 0px;}

.night {
  .a-header-box {
    border-bottom:size(1) solid $night-line-color;color: $night-text-color;
  }
  .a-table-box {
    .el-table::before {
      border: none;height: 0;
    }
    .el-table td, .el-table th {
      border-bottom:size(1) solid $night-line-color;color: $night-text-color;
    }
    .el-table__body tr.hover-row > td, .el-table__body tr:hover > td {
      background: $night-bg-color-sm;
    }
  }
  .d-content-view {
    .h3 {
      color: $night-text-color;
    }
  }
}
</style>

<script>
// import Identicon from 'identicon.js'
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  inject: ['reload'],
  data () {
    return {
      eDialog: {
        send: false,
        pwd: false,
      },
      loading: {
        account: false
      },
      gMemberInit: [],
      gMemberSelect: [],
      dataPage: {},
      rawTx: {},
      sendDataObj: {},
      gID: '',
      pubKey: '',
      gMode: '',
      tableData: [],
      dcrmAccount: '',
      drawer: {
        member: false,
        select: false,
        send: false
      },
      getGroup: [],

    }
  },
  computed: {
    ...computedPub,
  },
  watch: {
    '$route' (cur) {
      // console.log(cur)
      if (cur.query.gID) {
        this.initGroupData()
      } else {
        this.gID = ''
        this.gMode = ''
        this.pubKey = ''
        this.gMemberInit = []
        this.tableData = []
        this.loading.account = false
      }
      // this.refreshPage()
    },
  },
  mounted () {
    if (!Number(this.safeMode)) {
      setTimeout(() => {
        this.initGroupData()
      }, 50)
    } else {
      setTimeout(() => {
        // this.getPersonAccount()
        this.getGroupPersonId()
      }, 50)
    }

    // console.log(this.$store.state.wallet)
    // console.log(JSON.stringify(this.$store.state.wallet))
    // console.log(this.$store.state.wallet.getPrivateKeyString())
  },
  methods: {
    modalClick () {
      this.eDialog.send = false
      this.eDialog.pwd = false
      this.gMemberSelect = []
    },
    initGroupData () {
      this.loading.account = true
      this.gID = this.$route.query.gID ? this.$route.query.gID : ''
      this.pubKey = this.$route.query.pubKey ? this.$route.query.pubKey : ''
      this.getAccounts()
      this.getGroupData()
    },
    getGroupData () {
      this.$$.getGroup().then(res => {
        console.log(res)
        this.getGroup = res.info ? res.info : []
        if (this.$route.query.gID) {
          this.gID = this.$route.query.gID
        }
        this.getMemberList()
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
      })
    },
    getGroupPersonId () {
      this.$$.getGroupPerson().then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.info) {
          this.gID = res.info.Gid
          this.gMode = res.info.Mode ? res.info.Mode : '3/3'
          this.pubKey = res.info.PubKey ? res.info.PubKey : ''
          // this.setMemberList(res.info.Enodes)
          this.getPersonAccount()
          this.loading.account = true
        } else {
          this.getAccounts()
        }
        // this.getAccounts()
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
        this.loading.account = false
      })
    },
    getPersonAccount () {
      this.$$.getAccounts(this.gID, this.safeMode).then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.info.length > 0) {
          this.gID = res.info[0].GroupID
          this.gMode = res.info.Mode ? res.info.Mode : '3/3'
          this.pubKey = res.info[0].Accounts[0] ? res.info[0].Accounts[0] : ''
          // return
          this.getAccounts()
        } else {
          // this.getGroupPersonId()
          this.reqPersonAccount()
        }
      }).catch(err => {
        console.log(err)
        // this.getGroupPersonId()
        this.reqPersonAccount()
        if (err.error) {
          this.msgError(err.error)
        }
      })
    },
    /**
     * 初始获取账号
     */
    getAccounts () {
      if (!this.gID) {
        this.loading.account = false
        return
      }
      if (this.pubKey) {
        this.$$.getAccountsBalance(this.pubKey).then(res => {
          console.log(res)
          if (res.msg === 'Success') {
            this.tableData = res.info
            this.dcrmAccount = res.address
          } else if (Number(this.safeMode)) {
            this.reqPersonAccount()
          }
          this.loading.account = false
        }).catch(err => {
          console.log(err)
          this.msgError(this.$t('warn').w_2)
          this.loading.account = false
        })
      } else if (Number(this.safeMode)) {
        this.reqPersonAccount()
      }
    },
    reqPersonAccount () {
      this.$$.getNonce(this.address, '', '').then(nonce => {
        let rawTx = {
          from: this.address,
          to: this.$$.config.rawTx.to,
          gasLimit: this.$$.config.rawTx.gasLimit,
          gasPrice: this.$$.config.rawTx.gasPrice,
          nonce: nonce,
          value: 0,
          data: 'REQDCRMADDR:' + this.gID + ':' + this.gMode
        }
        console.log(rawTx)
        // return
        if (this.$store.state.wallet) {
          this.$$.toSign(rawTx, this.$store.state.wallet).then(res => {
            // console.log(res)
            this.$$.reqAccount(res.signTx, this.safeMode).then(res => {
            // this.$$.reqAccount(res.signTx, '0').then(res => {
              console.log(res)
              if (res.msg === 'Success') {
                this.pubKey = res.info.PubKey
                this.getAccounts()
              } else {
                this.loading.account = false
              }
              this.$store.commit('setWallet', {info: ''})
              // this.reload()
            })
          })
        } else {
          this.msgError(this.$t('warn').w_13)
          this.loading.account = false
        }
      })
      // let nonce = this.$$.getNonce(this.address, '', '')
      // let rawTx = {
      //   from: this.address,
      //   to: this.$$.config.rawTx.to,
      //   gasLimit: this.$$.config.rawTx.gasLimit,
      //   gasPrice: this.$$.config.rawTx.gasPrice,
      //   nonce: nonce,
      //   value: 0,
      //   data: 'REQDCRMADDR:' + this.gID + ':' + this.gMode
      // }
      // console.log(rawTx)
      // // return
      // if (this.$store.state.wallet) {
      //   this.$$.toSign(rawTx, this.$store.state.wallet).then(res => {
      //     // console.log(res)
      //     this.$$.reqAccount(res.signTx, this.safeMode).then(res => {
      //     // this.$$.reqAccount(res.signTx, '0').then(res => {
      //       console.log(res)
      //       if (res.msg === 'Success') {
      //         this.pubKey = res.info.PubKey
      //         this.getAccounts()
      //       } else {
      //         this.loading.account = false
      //       }
      //       this.$store.commit('setWallet', {info: ''})
      //       // this.reload()
      //     })
      //   })
      // } else {
      //   this.msgError(this.$t('warn').w_13)
      //   this.loading.account = false
      // }
    },
    saveTxnsDB (txnId) {
      let data = {
        from: this.sendDataObj.dcrmAccount,
        to: this.rawTx.to,
        value: this.rawTx.value,
        nonce: this.dataPage.nonce,
        coinType: this.sendDataObj.coinType,
        hash: '',
        status: 0,
      }
      let dataUrl = 'GroupAddTxns'
      if (Number(this.safeMode) === 1) {
        dataUrl = 'PersonAddTxns'
        data.kId = this.address
        data.eNode = this.$$.eNode
      } else {
        data.gArr = [
          {eNode: this.$$.eNode, kId: this.address, status: 4, timestamp: Date.now(), initiate: 1}
        ]
        for (let obj of this.gMemberInit) {
          data.gArr.push({eNode: obj, kId: '', status: 0, timestamp: '', initiate: 0})
        }
        data.gId = this.gID
        data.txnId = txnId
      }
      this.$socket.emit(dataUrl, data)
    },
    getSignData (data) {
      this.modalClick()
      this.loading.account = true
      if (data.signTx) {
        this.$$.lockout(data.signTx).then(res => {
          if (res.msg === 'Success') {
            this.msgSuccess('Success!')
            this.saveTxnsDB()
          } else {
            this.msgError(res.error)
          }
          console.log(hash)
        }).catch(err => {
          console.log(err)
          this.msgError(err.error)
        })
        this.loading.account = false
        this.drawer.send = false
      } else {
        this.msgError('Error')
        this.loading.account = false
      }
    },
    openPwdDialog () {
      if (!this.gID) {
        this.msgError(this.$t('warn').w_1)
        return
      }
      // this.gMode = '3/3'
      this.dataPage = {
        from: this.address,
        to: this.$$.config.rawTx.to,
        gasLimit: this.$$.config.rawTx.gasLimit,
        gasPrice: this.$$.config.rawTx.gasPrice,
      }
      let nonce = this.$$.getNonce(this.dcrmAccount, this.sendDataObj.coinType, this.sendDataObj.dcrmAccount)
      this.dataPage.nonce = nonce
      this.dataPage.value = this.rawTx.value
      this.dataPage.data = 'LOCKOUT:' 
                            + this.dcrmAccount
                            + ':' 
                            + this.sendDataObj.dcrmAccount
                            + ':' 
                            + this.rawTx.to
                            + ':'
                            + this.rawTx.value
                            + ':'
                            + this.sendDataObj.coinType
                            + ':'
                            + this.gID
                            + ':'
                            + this.gMode
                            + ':'
                            + this.safeMode
      this.drawer.send = false
      this.eDialog.pwd = true
    },
    openReceive (index, item) {
      let url = '/group/receive'
      if (Number(this.safeMode)) {
        url = '/person/receive'
      }
      this.toUrl(url, {
        address: item.DcrmAddr,
        coinType: item.Cointype,
        ERC20Coin: item.Cointype,
        gID: this.gID
      })
    },
    setTxnsData (item) {
      this.sendDataObj = {
        dcrmAccount: this.dcrmAccount,
        dcrmAddr: item.DcrmAddr,
        coinType: item.Cointype,
        gID: this.gID,
        mode: this.gMode
      }
    },
    changeAccount (value) {
      for (let obj of this.tableData) {
        if (obj.Cointype === value) {
          this.setTxnsData(obj)
          break
        }
      }
    },
    openSendDialog (index, item) {
      this.setTxnsData(item)
      if (!Number(this.safeMode)) {
        this.drawer.select = true
        setTimeout(() => {
          this.getMemberList()
        }, 500)
      } else {
        this.toSendTxnsUrl()
      }
    },
    toSendTxnsUrl (obj) {
      this.drawer.select = false
      this.drawer.send = true
    },
    getMemberList () {
      for (let obj of this.getGroup) {
        if (this.gID === obj.Gid) {
          this.gMode = obj.Mode
          this.setMemberList(obj.Enodes)
          break
        }
      }
    },
    setMemberList (data) {
      this.gMemberInit = []
      // console.log(arr)
      let arr = []
      for (let obj of data) {
        if (obj === this.$$.eNode) continue
        arr.push({
          p1: 'dcrm',
          p2: 'getEnodeStatus',
          p3: [obj]
        })
      }
      this.$$.batchRequest(arr).then(res => {
        console.log(res)
        for (let obj of res) {
          let cbData = JSON.parse(obj), status
          if (cbData.Status === 'Success') {
            status = 'OnLine'
          } else {
            status = 'OffLine'
          }
          this.gMemberInit.push({
            eNode: obj,
            status: status === 'OnLine' ? 1 : 0
          })
        }
      })
      console.log(this.gMemberInit)
    },
  }
}
</script>