<template>
  <div class="boxConntent1" v-loading="loading.account" element-loading-text="账户获取中……">

    <div class="g-table-box" v-if="tableData.length > 0 && gID">
      <el-table :data="tableData" style="width: 100%" empty-text="Null">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="币种" width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.coinType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="余额" width="150" align="right">
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

    <div class="flex-c boxConntent1" v-if="tableData.length <= 0 && gID">
      <el-button type="primary" @click="openPwdDialog">获取共管账户</el-button>
    </div>

    <div class="flex-c boxConntent1 color_99" v-if="!gID">
      请选择共管账户
    </div>

    <el-dialog title="人员在线验证" :visible.sync="eDialog.send" width="300" :before-close="modalClick" :close-on-click-modal="false">
      <div>
        <el-checkbox-group v-model="gMemberSelect" :min="1" class="pl-20">
          <el-checkbox v-for="(eNode, index) in gMemberInit" :label="eNode" :key="index">
            <div class="flex-bc">
              {{$$.cutOut(eNode, 22, 24)}}
              <span class="color_green flex-bc ml-20" v-if="$$.getEnodeState(eNode).Status === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>在线</span>
              <span class="color_red flex-bc ml-20" v-if="$$.getEnodeState(eNode).Status !== 'OnLine'"><i class="el-icon-circle-close mr-5"></i>离线</span>
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
  </div>
</template>

<style lang="scss">
.g-table-box {
  width: 100%;padding: 15px 20px;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
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
      sendDataObj: {},
      gID: '',
      tableData: [
        // {
        //   coinType: 'FSN',
        //   address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        //   isERC20: 0,
        //   ERC20Coin: 'FSN'
        // }, {
        //   coinType: 'BTC',
        //   address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        //   isERC20: 0,
        //   ERC20Coin: 'BTC'
        // }, {
        //   coinType: 'ETH',
        //   address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        //   isERC20: 0,
        //   ERC20Coin: 'ETH'
        // }, {
        //   coinType: 'BNB',
        //   address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        //   isERC20: 0,
        //   ERC20Coin: 'BNB'
        // }
      ],
      signTx: ''
    }
  },
  computed: {
    ...computedPub,
  },
  watch: {
    '$route' (cur) {
      if (cur.query.gID) {
        this.loading.account = true
        this.gID = this.$route.query.gID
        this.getAccounts()
      } else {
        this.gID = ''
        this.loading.account = false
      }
      // this.refreshPage()
    }
  },
  mounted () {
    // const {session} = require('electron')
    // const session = require('electron')
    // console.log(session)
    // console.log(this.$route.query)
    this.gID = this.$route.query.gID
    // this.gID = 'c5402dcd41373ab3abae22d29476778fd135733a514678e7cbe10133610ab4b0c5402dcd41373ab3abae22d29476778fd135733a514678e7cbe10133610ab4b0'
    if (this.gID) {
      this.loading.account = true
      this.getAccounts()
    }
  },
  methods: {
    toSendTxnsUrl (obj) {
      this.toUrl('sendTxns', this.sendDataObj)
    },
    modalClick () {
      this.eDialog.send = false
      this.eDialog.pwd = false
      this.gMemberInit = []
      this.gMemberSelect = []
    },
    /**
     * 初始获取账号
     */
    getAccounts () {
      let fileUrl = this.$$.config.file.ga.url + this.gID + this.$$.config.file.ga.type
      // console.log(fileUrl)
      this.$$.readFile(fileUrl).then(res => {
        // console.log(res)
        let data = JSON.parse(res.info)
        console.log(data)
        for (let obj in data.Address) {
          this.$$.getBalance(data.Account, obj, data.Address[obj]).then(res => {
            let coin = this.$$.cutERC20(obj)
            this.tableData.push({
              ERC20Coin: obj,
              coinType: coin.coinType,
              isERC20: coin.type,
              address: data.Address[obj],
              balance: res.info
            })
          })
        }
        this.loading.account = false
      }).catch(err => {
        console.log(err)
        this.$message.error(err.error.toString())
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
        this.$message.error('Error')
        this.loading.account = false
      }
    },
    validGa () {
      let fileUrl = this.$$.config.file.ga.url
      console.log(fileUrl)
      this.$$.validFile(this.gID, fileUrl, this.$$.config.file.ga.type)
      .then(res => {
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
      let fileUrl = this.$$.config.file.ga.url + this.gID + this.$$.config.file.ga.type
      // let account = this.$$.getAccount(this.signTx, '0')
      this.$$.getAccount(this.signTx, '0').then(res => {
        let account = res.info
        console.log(account)
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
        this.$message.error(err.error)
        this.loading.account = false
      })
    },
    openPwdDialog () {
      if (!this.gID) {
        this.$message.error('请选择公共账户！')
        return
      }
      this.$$.getGroupObj(this.gID).then(res => {
        let groupData = res.info
        let nonce = 1
        console.log(this.address)
        if (!isNaN(nonce)) {
          this.dataPage = {
            from: this.address,
            to: this.$$.config.rawTx.to,
            gasLimit: this.$$.config.rawTx.gasLimit,
            gasPrice: this.$$.config.rawTx.gasPrice,
            nonce: nonce,
            value: 0,
            data: 'REQDCRMADDR:' + this.gID + ':' + groupData.Mode
          }
          this.eDialog.pwd = true
          console.log(this.dataPage)
        } else {
          console.log(nonce)
          this.$message.error(nonce)
        }
      }).catch(err => {
        this.$message.error(err.error)
      })
    },
    openReceive (index, item) {
      // console.log(index)
      // console.log(item)
      this.toUrl('/group/receive', {
        address: item.address,
        coinType: item.coinType,
        ERC20Coin: item.ERC20Coin,
        gID: this.gID
      })
    },
    openSendDialog (index, item) {
      this.$$.getGroupObj(this.gID).then(res => {
        console.log(res.info)
        this.sendDataObj = item
        this.sendDataObj.gID = this.gID
        this.sendDataObj.mode = res.info.Mode
        let eNode = res.info.Enodes
        this.gMemberInit = []
        for (let obj of eNode) {
          if (obj !== this.$$.getEnode()) {
            this.gMemberInit.push(obj)
          }
        }
        this.eDialog.send = true
      }).catch(err => {
        this.$message.error(err.error)
      })
    },
  }
}
</script>