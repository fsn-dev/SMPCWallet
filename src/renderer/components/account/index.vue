<template>
  <div class="boxConntent1" v-loading="loading.account" element-loading-text="账户获取中……">
    <div class="flex-bc a-header-box" v-if="!Number(safeMode)">
      <div>
        <el-button type="primary" @click="eDialog.group = true" class="btn-primary">生成账户</el-button>
      </div>
      <div @click="gID ? drawer.member = true : ''"><i class="el-icon-menu cursorP"></i></div>
    </div>

    <div class="a-table-box" v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%" empty-text="Null">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="币种" width="180">
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
        <el-table-column label="地址">
          <template slot-scope="scope">
            <div class="WW100 ellipsis cursorP" :title="scope.row.DcrmAddr" @click="copyTxt(scope.row.DcrmAddr)">{{ scope.row.DcrmAddr }}</div>
          </template>
        </el-table-column>
        <el-table-column label="余额" width="120" align="right">
          <template slot-scope="scope">
            {{ isNaN(scope.row.Balance) ? 0 : scope.row.Balance}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="openReceive(scope.$index, scope.row)">转入</el-button>
            <el-button size="mini" type="primary" @click="openSendDialog(scope.$index, scope.row)" class="btn-primary">转出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-c boxConntent1 color_99" v-if="!gID && !Number(safeMode)">
      请选择账户
    </div>

    <el-dialog :title="$t('BTN').UNLOCK" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>

    <el-dialog :title="'选择组'" :visible.sync="eDialog.group">
      <el-select v-model="gID" @change="changeGroup" no-match-text="Null" no-data-text="Null" placeholder="Null">
          <el-option v-for="(item, index) in getGroup" :key="index" :label="item.Gname" :value="item.Gid"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modalClick">取 消</el-button>
          <el-button type="primary" @click="openPwdDialog(1)" :disabled="!gID" class="btn-primary">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 查看组成员 start -->
    <w-drawer v-model="drawer.member" v-if="drawer.member">
      <div class="d-content-view g-member-list-box">
        <h3 class="h3">当前组成员</h3>
        <ul class="">
          <li class="item">
            <p class="label flex-sc">
              组成员 - 1 (<span class="color_green flex-sc font14"><i class="el-icon-user mr-5"></i>自己</span>)
            </p>
            {{$$.cutOut($$.eNode, 14, 20)}}
          </li>
          <li class="item" v-for="(eNode, index) in gMemberInit" :key="index" :title="eNode">
            <p class="label flex-sc">
              组成员 - {{index + 2}}
              (<span class="color_green flex-sc font14" v-if="$$.getEnodeState(eNode) === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>在线</span>
              <span class="color_red flex-sc font14" v-if="$$.getEnodeState(eNode) !== 'OnLine'"><i class="el-icon-circle-close mr-5"></i>离线</span>)
            </p>
            {{$$.cutOut(eNode, 14, 20)}}
          </li>
        </ul>
      </div>
    </w-drawer>
    <!-- 查看组成员 end -->

    <!-- 节点选择 start -->
    <w-drawer v-model="drawer.select" v-if="drawer.select" @on-close="modalClick">
      <div class="d-content-view node-select-box">
        <h3 class="h3">节点选择</h3>
        <div v-if="drawer.select">
          <el-checkbox-group v-model="gMemberSelect" :min="1" class="">
            <el-checkbox :label="$$.eNode">
              <div class="flex-bc">
                {{$$.cutOut($$.eNode, 14, 20)}}
                <span class="color_green flex-bc ml-20"><i class="el-icon-user mr-5"></i>自己</span>
              </div>
            </el-checkbox>
            <el-checkbox v-for="(eNode, index) in gMemberInit" :label="eNode" :key="index">
              <div class="flex-bc">
                {{$$.cutOut(eNode, 14, 20)}}
                <span class="color_green flex-bc ml-20" v-if="$$.getEnodeState(eNode) === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>在线</span>
                <span class="color_red flex-bc ml-20" v-if="$$.getEnodeState(eNode) !== 'OnLine'"><i class="el-icon-circle-close mr-5"></i>离线</span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="node-select-btn">
          <el-button type="primary" @click="toSendTxnsUrl" :disabled="gMemberSelect.length <= 0" class="btn mt-30 WW100 HH40 font16 btn-primary">确定</el-button>
        </div>
      </div>
    </w-drawer>
    <!-- 节点选择 end -->

    <!-- 发送交易 start -->
    <w-drawer v-model="drawer.send" v-if="drawer.send">
      <div class="d-content-view">
        <h3 class="h3">发送{{$$.cutERC20(sendDataObj.coinType).coinType}}</h3>
        <el-form ref="userInfoForm" :model="rawTx" label-width="120px" label-position="top">
          <el-form-item label="发送地址：">
            <el-input v-model="rawTx.to"></el-input>
          </el-form-item>
          <el-form-item label="资产：">
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
          </el-form-item>
          <el-form-item label="数量：">
            <el-input type="number" v-model="rawTx.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openPwdDialog(2)" class="btn mt-30 WW100 HH40 font16 btn-primary">发送</el-button>
          </el-form-item>
        </el-form>
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
        group: false
      },
      loading: {
        account: false
      },
      gMemberInit: [],
      gMemberSelect: [],
      dataPage: {},
      rawTx: {},
      sendDataObj: {},
      sendType: '',
      gID: '',
      publicKey: '',
      gMode: '',
      tableData: [],
      dcrmAddr: '',
      signTx: '',
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
        this.publicKey = ''
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
      this.getGroupPersonId()
    }

    
    // console.log(this.$store.state.wallet)
    // console.log(this.$store.state.wallet)
  },
  methods: {
    initGroupData () {
      this.loading.account = true
      this.gID = this.$route.query.gID ? this.$route.query.gID : ''
      this.publicKey = this.$route.query.publicKey ? this.$route.query.publicKey : ''
      this.getGroupData()
      this.getAccounts()
    },
    modalClick () {
      this.eDialog.send = false
      this.eDialog.pwd = false
      this.eDialog.group = false
      this.gMemberSelect = []
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
        this.$message({
          showClose: true,
          message: err.toString(),
          type: 'error'
        })
      })
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
    setMemberList (arr) {
      this.gMemberInit = []
      // console.log(arr)
      for (let obj of arr) {
        if (obj === this.$$.eNode) continue
        this.gMemberInit.push(obj)
      }
      // console.log(this.gMemberSelect)
    },
    changeGroup () {
      this.getMemberList()
    },
    getGroupPersonId () {
      this.$$.getGroupPerson().then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.info) {
          this.gID = res.info.Gid
          this.gMode = res.info.Mode ? res.info.Mode : '3/3'
          this.publicKey = res.info.PubKey ? res.info.PubKey : ''
          this.setMemberList(res.info.Enodes)
          this.loading.account = true
        }
        this.getAccounts()
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          message: err.error.toString(),
          type: 'error'
        })
        this.loading.account = false
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
      // console.log(fileUrl)
      // console.log(this.publicKey)
      if (this.publicKey) {
        this.$$.getAccountsBalance(this.publicKey).then(res => {
          console.log(res)
          if (res.msg === 'Success') {
            this.tableData = res.info
            this.dcrmAddr = res.address
          } else if (Number(this.safeMode)) {
            this.reqPersonAccount()
          }
          this.loading.account = false
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '请获取账户',
            type: 'error'
          })
          this.loading.account = false
        })
      } else if (Number(this.safeMode)) {
        this.reqPersonAccount()
      }
    },
    reqPersonAccount () {
      let nonce = this.$$.getNonce(this.address, '', '')
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
      this.$$.toSign(rawTx, this.$store.state.wallet).then(res => {
        // console.log(res)
        this.$$.reqAccount(res.signTx, this.safeMode).then(res => {
          console.log(res)
          if (res.msg === 'Success') {
            this.publicKey = res.info.PubKey
            this.getAccounts()
          } else {
            this.loading.account = false
          }
          // this.reload()
        })
      })
    },
    getSignData (data) {
      // console.log(data)
      // console.log(data.signTx)
      this.modalClick()
      this.loading.account = true
      if (data.signTx) {
        if (this.sendType === 1) {
          this.$$.reqAccount(data.signTx, this.safeMode).then(res => {
            console.log(res)
            if (Number(this.safeMode)) {
              this.toUrl('/person', {gID: this.gID, publicKey: res.info.PubKey})
            } else {
              this.toUrl('/group', {gID: this.gID, publicKey: res.info.PubKey})
            }
            this.reload()
            // this.getAccounts()
          }).catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: err.error.toString(),
              type: 'error'
            })
          })
        } else {
          try {
            let hash = this.$$.web3.dcrm.lockOut(data.signTx)
            console.log(hash)
          } catch (error) {
            console.log(error)
          }
        }
        this.loading.account = false
        this.drawer.send = false
      } else {
        this.signTx = ''
        this.$message({
          showClose: true,
          message: 'Error',
          type: 'error'
        })
        this.loading.account = false
      }
    },
    toSendTxnsUrl (obj) {
      // this.toUrl('sendTxns', this.sendDataObj)
      this.drawer.select = false
      this.drawer.send = true
    },
    openPwdDialog (type) {
      if (!this.gID) {
        this.$message({
          showClose: true,
          message: '账户为空！',
          type: 'error'
        })
        return
      }
      // this.gMode = '3/3'
      this.dataPage = {
        from: this.address,
        to: this.$$.config.rawTx.to,
        gasLimit: this.$$.config.rawTx.gasLimit,
        gasPrice: this.$$.config.rawTx.gasPrice,
      }
      this.sendType = type
      if (type === 1) {
        let nonce = this.$$.getNonce(this.address, '', '')
        this.dataPage.nonce = nonce
        this.dataPage.value = 0
        this.dataPage.data = 'REQDCRMADDR:' + this.gID + ':' + this.gMode
      } else if (type === 2) {
        let nonce = this.$$.getNonce(this.dcrmAddr, this.sendDataObj.coinType, this.sendDataObj.address)
        this.dataPage.nonce = nonce
        this.dataPage.value = this.rawTx.value
        this.dataPage.data = 'LOCKOUT:' 
                              + this.dcrmAddr
                              + ':' 
                              + this.sendDataObj.address
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
      }
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
        address: this.dcrmAddr,
        dcrmAddr: item.DcrmAddr,
        coinType: item.Cointype,
        gID: this.gID,
        mode: this.gMode
      }
    },
    changeAccount (value) {
      for (let obj of this.tableData) {
        if (obj.Cointype === value) {
          // this.sendDataObj = obj
          this.setTxnsData(obj)
          break
        }
      }
    },
    openSendDialog (index, item) {
      this.setTxnsData(item)
      // console.log(this.sendDataObj)
      if (!Number(this.safeMode)) {
        // this.eDialog.send = true
        this.drawer.select = true
      } else {
        this.toSendTxnsUrl()
      }
    },
  }
}
</script>