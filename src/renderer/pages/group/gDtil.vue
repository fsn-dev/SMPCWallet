<template>
  <div class="boxConntent1">

    <div class="g-table-box">
      <el-table :data="tableData" style="width: 100%" empty-text="Null">
        <el-table-column label="币种" width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.coinType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="openReceive(scope.$index, scope.row)">转入</el-button>
            <el-button size="mini" type="primary" @click="openSendDialog(scope.$index, scope.row)">转出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="人员在线验证" :visible.sync="eDialog.send" width="300" :before-close="modalClick" :close-on-click-modal="false">
      <div slot="footer" class="dialog-footer">
        <el-button @click="eDialog.send = false">取 消</el-button>
        <el-button type="primary" @click="toUrl('sendTxns', sendDataObj)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.g-table-box {
  width: 100%;padding: 15px 20px;
}
</style>

<script>
export default {
  name: '',
  data () {
    return {
      eDialog: {
        send: false
      },
      loading: {

      },
      sendDataObj: {},
      gID: '',
      tableData: [ {
        coinType: 'FSN',
        address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        isERC20: 0,
        ERC20Coin: 'FSN'
      }, {
        coinType: 'BTC',
        address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        isERC20: 0,
        ERC20Coin: 'BTC'
      }, {
        coinType: 'ETH',
        address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        isERC20: 0,
        ERC20Coin: 'ETH'
      }, {
        coinType: 'BNB',
        address: '0x006654AAe27394f0C78d2c642Eb46c28B367bc6F',
        isERC20: 0,
        ERC20Coin: 'BNB'
      }]
    }
  },
  mounted () {

  },
  methods: {
    modalClick () {
      this.eDialog.send = false
    },
    openReceive (index, itemindex, item) {
      console.log(index)
      console.log(item)
      this.toUrl('/group/receive', {
        address: item.address,
        coinType: item.coinType,
        ERC20Coin: item.ERC20Coin,
        gID: this.gID
      })
    },
    openSendDialog (index, item) {
      this.eDialog.send = true
      this.sendDataObj = item
      this.sendDataObj.gID = this.gID
    },
  }
}
</script>