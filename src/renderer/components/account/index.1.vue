<template>
  <div class="boxConntent1" v-loading="loading.account" element-loading-text="账户获取中……">
    <div class="flex-bc a-header-box" v-if="!Number(safeMode)">
      <div>
        <el-button type="primary" @click="eDialog.group = true">生成账户</el-button>
      </div>
      <div @click="gID ? drawer.member = true : ''"><i class="el-icon-menu cursorP"></i></div>
    </div>

    <div class="a-table-box" v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%" empty-text="Null">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="币种" width="180">
          <template slot-scope="scope">
            <div class="flex-sc">
              <div class="coinImg flex-c" v-if="$$.setDollar($$.cutERC20(scope.row.coinType).coinType)">
                <img :src="$$.setDollar($$.cutERC20(scope.row.coinType).coinType).logo">
              </div>
              <div class="coinTxt flex-c" v-else>
                {{$$.titleCase($$.cutERC20(scope.row.coinType).coinType)}}
              </div>
              <span style="margin-left: 10px">{{ $$.cutERC20(scope.row.coinType).coinType }}</span>
              <i v-if="$$.cutERC20(scope.row.coinType).type" class="isErc20">ERC20</i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <div class="WW100 ellipsis" :title="scope.row.address">{{ scope.row.address }}</div>
          </template>
        </el-table-column>
        <el-table-column label="余额" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.balance}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="openReceive(scope.$index, scope.row)">转入</el-button>
            <el-button size="mini" type="primary" @click="openSendDialog(scope.$index, scope.row)">转出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-c boxConntent1" v-if="tableData.length <= 0 && gID || Number(safeMode)">
      <el-button type="primary" @click="openPwdDialog">获取账户</el-button>
    </div>

    <div class="flex-c boxConntent1 color_99" v-if="!gID && !Number(safeMode)">
      请选择账户
    </div>

    <el-dialog title="组成员选择" :visible.sync="eDialog.send" width="300" :before-close="modalClick" :close-on-click-modal="false">
      <div v-if="eDialog.send">
        <el-checkbox-group v-model="gMemberSelect" :min="1" class="pl-20">
          <el-checkbox v-for="(eNode, index) in gMemberInit" :label="eNode" :key="index">
            <div class="flex-bc">
              {{$$.cutOut(eNode, 22, 24)}}
              <span class="color_green flex-bc ml-20" v-if="$$.getEnodeState(eNode) === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>在线</span>
              <span class="color_red flex-bc ml-20" v-if="$$.getEnodeState(eNode) !== 'OnLine'"><i class="el-icon-circle-close mr-5"></i>离线</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">取 消</el-button>
        <el-button type="primary" @click="toSendTxnsUrl" :disabled="gMemberSelect.length <= 0">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('BTN').UNLOCK" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>

    <el-dialog :title="'选择组'" :visible.sync="eDialog.group">
      <el-select v-model="gID">
          <el-option v-for="(item, index) in getGroup" :key="index" :label="item.Gname" :value="item.Gid"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modalClick">取 消</el-button>
          <el-button type="primary" @click="openPwdDialog" :disabled="!gID">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 查看组成员 start -->
    <w-drawer v-model="drawer.member" v-if="drawer.member">
      <div class="g-member-list-box">
        <ul class="">
          <li class="item">
            <p class="label flex-sc">
              组成员 - 1 (<span class="color_green flex-sc font14">自己</span>)
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

    <!-- 选择组成员 start -->
    <w-drawer v-model="drawer.select" v-if="drawer.select">
      <div>
        
      </div>
    </w-drawer>
    <!-- 选择组成员 end -->
  </div>
</template>

<style lang="scss">
.a-header-box {
  width: 100%;padding: size(12) size(20);border-bottom: size(1) solid #eee;
}
.a-table-box {
  width: 100%;padding: size(0) size(20);
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
  .el-table {
    background: none;
    th, tr {
      background: none;
    }
  }
}
.g-member-list-box {
  width: 100%;
  .item {
    width: 100%;padding: size(10) size(0);color:$color-gray-sm;
  }
}
.isErc20 {position:absolute;top:5px;right: 0;font-size: 10px;color:#fff;font-style: italic;padding:0 5px;background: #004a7c;border-radius: 5px;transform: scale(0.6);}
.isErc20_1{top: 0px;}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import wDrawer from '@/components/drawer/index'
export default {
  name: '',
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
      sendDataObj: {},
      gID: '',
      publicKey: '',
      gMode: '',
      tableData: [],
      signTx: '',
      drawer: {
        member: false,
        select: false,
        send: false
      },
      getGroup: []
    }
  },
  components: {wDrawer},
  computed: {
    ...computedPub,
  },
  watch: {
    '$route' (cur) {
      // console.log(cur)
      if (cur.query.gID) {
        this.loading.account = true
        this.gID = this.$route.query.gID ? this.$route.query.gID : ''
        this.publicKey = this.$route.query.publicKey ? this.$route.query.publicKey : ''
        this.gMode = this.$route.query.mode ? this.$route.query.mode : ''
        let gMlist = this.$route.query.eNodes ? this.$route.query.eNodes : []
        this.setMemberList(gMlist)
        this.getAccounts()
      } else {
        this.gID = ''
        this.gMode = ''
        this.gMemberInit = []
        this.tableData = []
        this.loading.account = false
      }
      // this.refreshPage()
    },
  },
  mounted () {
    if (!Number(this.safeMode)) {
      this.loading.account = true
      this.gID = this.$route.query.gID ? this.$route.query.gID : ''
      this.publicKey = this.$route.query.publicKey ? this.$route.query.publicKey : ''
      this.gMode = this.$route.query.mode ? this.$route.query.mode : ''
      let gMlist = this.$route.query.eNodes ? this.$route.query.eNodes : []
      this.getGroupData()
      this.setMemberList(gMlist)
      this.getAccounts()
    } else {
      this.getGroupPersonId()
    }
    console.log(this.$$.web3.dcrm.getAccounts())
    // console.log(this.$route.query)
    // console.log(this.safeMode)
  },
  methods: {
    getGroupData () {
      this.$$.getGroup().then(res => {
        console.log(res)
        this.getGroup = res.info ? res.info : []
        if (this.$route.query.gID) {
          this.gID = this.$route.query.gID
        }
      }).catch(err => {
        this.$message.error(err.toString())
      })
    },
    toSendTxnsUrl (obj) {
      this.toUrl('sendTxns', this.sendDataObj)
    },
    modalClick () {
      this.eDialog.send = false
      this.eDialog.pwd = false
      this.gMemberSelect = []
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
    getGroupPersonId () {
      this.$$.getGroupPerson().then(res => {
        console.log(res)
        if (res.msg === 'Success' && res.info) {
          this.gID = res.info.Gid
          this.gMode = res.info.Mode
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
      let fileUrl = this.$$.config.file.ga.url + this.gID + this.$$.config.file.ga.type
      // console.log(fileUrl)
      this.$$.readFile(fileUrl).then(res => {
        // console.log(res)
        let data = JSON.parse(res.info)
        // console.log(data)
        this.$$.getBalance(data.Account, data.DcrmAddress).then(res => {
          // console.log(res)
          this.tableData = res.info
          this.loading.account = false
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: err.error.toString(),
            type: 'error'
          })
          this.loading.account = false
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          message: '请获取账户',
          type: 'error'
        })
        this.loading.account = false
      })
    },
    /**
     * 初始未获取到手动获取
     */
    getSignData (data) {
      console.log(data)
      console.log(data.signTx)
      this.modalClick()
      this.loading.account = true
      if (data.signTx) {
        this.signTx = data.signTx
        this.validGa()
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
    validGa () {
      let fileUrl = this.$$.config.file.ga.url
      // let filename = this.publicKey || this.$$.config.personFilename
      let filename = this.publicKey
      // console.log(fileUrl)
      this.$$.validFile(filename, fileUrl, this.$$.config.file.ga.type)
      .then(res => {
        console.log(res)
        if (res.msg === 'Repeat') {
          this.$message.error('账户已存在')
          this.getAccounts()
        } else {
          this.createGaFile()
        }
      })
      .catch(err => {
        this.$message.error(err.error)
        this.loading.account = false
      })
    },
    createGaFile () {
      // let filename = this.gID || this.$$.config.personFilename
      // let account = this.$$.getAccount(this.signTx, '0')
      this.$$.reqAccount(this.signTx, this.safeMode).then(res => {
        let account = res.info
        console.log(account)
        let fileUrl = this.$$.config.file.ga.url + account.Address + this.$$.config.file.ga.type
        this.$$.fs.writeFile(fileUrl, JSON.stringify(account), (err, res) => {
          if (err) {
            this.$message.error(err.toString())
            this.loading.account = false
          } else {
            this.getAccounts()
            this.$message({
              message: '获取成功！',
              type: 'success'
            })
          }
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(err.error)
        this.loading.account = false
      })
    },
    openPwdDialog () {
      if (!this.gID) {
        this.$message.error('账户为空！')
        return
      }
      this.gMode = '3/3'
      let nonce = this.$$.getNonce(this.address, '', '')
      this.dataPage = {
        from: this.address,
        to: this.$$.config.rawTx.to,
        gasLimit: this.$$.config.rawTx.gasLimit,
        gasPrice: this.$$.config.rawTx.gasPrice,
        nonce: nonce,
        value: 0,
        data: 'REQDCRMADDR:' + this.gID + ':' + this.gMode
      }
      // alert(JSON.stringify(this.dataPage))
      this.eDialog.pwd = true
    },
    openReceive (index, item) {
      let url = '/group/receive'
      if (Number(this.safeMode)) {
        url = '/person/receive'
      }
      this.toUrl(url, {
        address: item.address,
        coinType: item.coinType,
        ERC20Coin: item.ERC20Coin,
        gID: this.gID
      })
    },
    openSendDialog (index, item) {
      this.sendDataObj = item
      this.sendDataObj.gID = this.gID
      this.sendDataObj.mode = this.gMode
      if (!Number(this.safeMode)) {
        this.eDialog.send = true
      } else {
        this.toSendTxnsUrl()
      }
    },
  }
}
</script>