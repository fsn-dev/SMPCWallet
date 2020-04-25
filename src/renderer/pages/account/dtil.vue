<template>
  <div class="boxConntent1" v-loading="loading.account" :element-loading-text="$t('loading').l_1">
    <div class="flex-bc a-header-box">
      <div></div>
      <div @click="gID ? drawer.member = true : ''"><i class="el-icon-menu cursorP"></i></div>
    </div>

    <div class="a-table-box" v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%" empty-text="Null" v-if="tableRefresh">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('label').coinType" width="180">
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
        <el-table-column :label="$t('label').address">
          <template slot-scope="scope">
            <div class="WW100 ellipsis cursorP flex-c" v-if="!tableObj[scope.row.coinType] && !tableObj['ETH']"><i class="el-icon-loading mr-5"></i></div>
            <div class="WW100 ellipsis cursorP" v-else-if="!tableObj[scope.row.coinType] && tableObj['ETH']" @click="copyTxt(tableObj['ETH'].address)">{{tableObj['ETH'].address}}</div>
            <div class="WW100 ellipsis cursorP" v-else @click="copyTxt(tableObj[scope.row.coinType].address)">{{tableObj[scope.row.coinType].address}}</div>
            <!-- <div class="WW100 ellipsis cursorP" :title="scope.row.DcrmAddr" @click="copyTxt(scope.row.DcrmAddr)">
              {{
                tableObj[scope.row.coinType] && tableObj[scope.row.coinType].address ? tableObj[scope.row.coinType].address : '' 
              }}
            </div> -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').balance" width="120" align="right">
          <template slot-scope="scope">
            <div class="WW100 ellipsis cursorP" v-if="!tableObj[scope.row.coinType]">0</div>
            <div class="WW100 ellipsis cursorP" v-else>{{ isNaN(tableObj[scope.row.coinType].balance) ? 0 : $$.fromWei(tableObj[scope.row.coinType].balance, $$.cutERC20(scope.row.Cointype).coinType)}}</div>
            <!-- {{ isNaN(scope.row.Balance) ? 0 : $$.fromWei(scope.row.Balance, $$.cutERC20(scope.row.Cointype).coinType)}} -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').action" width="200" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="success" @click="openReceive(scope.$index, scope.row)">{{$t('btn').enter}}</el-button>
            <el-button size="mini" type="primary" @click="openSendDialog(scope.$index, scope.row)" class="btn-primary">{{$t('btn').out}}</el-button> -->
            <div class="flex-ec" v-if="scope.row.isOpen">
              <w-button :ok="$t('btn').enter" :cancel="$t('btn').out" :type="1" @onOk="openReceive(scope.$index, scope.row)" @onCancel="openSendDialog(scope.$index, scope.row)"></w-button>
            </div>
            <div class="flex-ec" v-else>
              <w-button :ok="$t('btn').enter" :cancel="$t('btn').out" @onOk="openReceive(scope.$index, scope.row)" :type="1" :right="false"></w-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-c boxConntent1 color_99" v-if="!gID">{{$t('warn').w_1}}</div>

    <!-- 查看组成员 start -->
    <el-drawer :visible.sync="drawer.member" :destroy-on-close="true" :show-close="false">
      <div class="plr15 pt-20">
        <drawer-logo @close-drawer="drawer.member = false"></drawer-logo>
      </div>
      <div class="d-content-view g-member-list-box">
        <h3 class="h3">{{$t('title').gMember}}</h3>
        <ul class="">
          <li class="item">
            <p class="label flex-sc">
              {{$t('label').admins}} - 1 (<span class="color_green flex-sc font14"><i class="el-icon-user mr-5"></i>{{$t('label').self}}</span>)
            </p>
            {{$$.cutOut(eNode, 14, 20)}}
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
    </el-drawer>
    <!-- 查看组成员 end -->

    <!-- 节点选择 start -->
    <el-drawer :visible.sync="drawer.select" :destroy-on-close="true" :show-close="false">
      <div class="plr15 pt-20">
        <drawer-logo @close-drawer="drawer.select = false"></drawer-logo>
      </div>
      <div class="d-content-view node-select-box" v-loading="loading.nodeSelect" :element-loading-text="$t('loading').l_1">
        <h3 class="h3">{{$t('title').selectNode}}</h3>
        <div v-if="drawer.select">
          <el-checkbox-group v-model="gMemberSelect"  @change="changeMember">
            <el-checkbox :label="eNode" disabled="disabled">
              <div class="flex-bc">
                {{$$.cutOut(eNode, 12, 10)}}
                <span class="color_green flex-bc ml-10"><i class="el-icon-user mr-5"></i>{{$t('label').self}}</span>
              </div>
            </el-checkbox>
            <el-checkbox v-for="(item, index) in gMemberInit" :label="item.eNode" :key="index" :disabled="item.disabled">
              <div class="flex-bc">
                {{$$.cutOut(item.eNode, 12, 10)}}
                <div>
                  <span class="color_green flex-bc ml-10" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                  <span class="color_red flex-bc ml-10" v-else><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
                </div>
                <div v-if="!networkMode" class="cursorP">
                  <i class="el-icon-edit ml-10 font16" v-if="!item.isEdit" @click="changeEnode(item, index)"></i>
                  <i class="el-icon-finished ml-10 font16" v-else @click="changeEnode(item, index)"></i>
                </div>
              </div>
              <div v-if="!networkMode && item.isEdit">
                <!-- <el-input class="H30"></el-input> -->
                <el-input size="mini" v-model="item.eNode" v-if="!Number(accountType)"> </el-input>
                <el-input size="mini" v-model="item.url" v-if="Number(accountType)"> </el-input>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="node-select-btn">
          <el-button type="primary" @click="toSendTxnsUrl" :disabled="gMemberSelect.length < gMode.split('/')[0]" class="btn mt-30 WW100 HH40 font16 btn-primary">{{$t('btn').confirm}}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 节点选择 end -->

    <!-- 发送交易 start -->
    <el-drawer :visible.sync="drawer.send" :destroy-on-close="true" :show-close="false" v-if="drawer.send">
      <div class="plr15 pt-20">
        <drawer-logo @close-drawer="drawer.send = false"></drawer-logo>
      </div>
      <send-txns :sendDataObj="sendDataObj" :gID="gID" :gMode="gMode" :gMemberSelect="gMemberSelect" @closeModal="modalClick"></send-txns>
    </el-drawer>
    <!-- 发送交易 end -->
  </div>
</template>

<style lang="scss">
@import './scss/account';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import wButton from '@/components/btn/index.vue'
import getEnode from '@/assets/js/pages/node/getEnode.js'
import sendTxns from '@/pages/txns/index.vue'
export default {
  name: '',
  inject: ['reload'],
  data () {
    return {
      eDialog: {
        send: false,
        // pwd: false,
      },
      loading: {
        account: false,
        nodeSelect: true
      },
      gMemberInit: [],
      gMemberSelect: [],
      sendDataObj: {},
      gID: '',
      pubKey: '',
      gMode: '',
      eNodeArr: [],
      tableData: [
        { coinType: 'BTC', address: '', balance: '', isOpen: 1},
        { coinType: 'ETH', address: '', balance: '', isOpen: 1},
        { coinType: 'USDT', address: '', balance: '', isOpen: 0},
        { coinType: 'FSN', address: '', balance: '', isOpen: 1},
        { coinType: 'RMBT', address: '', balance: '', isOpen: 0},
      ],
      tableObj: {},
      tableRefresh: true,
      drawer: {
        member: false,
        select: false,
        send: false
      },
      getGroup: [],
      oneself: true,
    }
  },
  computed: {
    ...computedPub,
  },
  components: {sendTxns, wButton},
  mounted () {
    setTimeout(() => {
      this.init()
    }, 50)
    // console.log(this.$route.query)
  },
  methods: {
    ...getEnode,
    changeEnode (item, index) {
      if (Number(this.accountType)) {
        if (item.isEdit) {
          if (!item.url) {
            this.gMemberInit[index].url = this.$$.eNodeCut(item.oldEnode).ip
            this.gMemberInit[index].isEdit = !this.gMemberInit[index].isEdit
            this.msgError(this.$t('warn').w_17)
            return
          }
          if (item.url !== this.$$.eNodeCut(item.oldEnode).ip) {
            let url = item.url.indexOf('http://') === 0 || item.url.indexOf('https://') === 0 ? item.url : ('http://' + item.url)
            this.getEnode(url).then(res => {
              if (res.status === 'Success') {
                let _enode = res.enode
                if (!this.$$.eNodeCut(_enode).key || item.oldEnode.indexOf(this.$$.eNodeCut(_enode).key) === -1) {
                  this.gMemberInit[index].eNode = item.oldEnode
                  this.gMemberInit[index].isEdit = !this.gMemberInit[index].isEdit
                  this.msgError(this.$t('warn').w_18)
                  return
                } else {
                  this.gMemberInit[index].status = 1
                  this.gMemberInit[index].eNode = _enode
                }
              } else {
                this.gMemberInit[index].eNode = item.oldEnode
              }
            })
          }
        }
      } else {
        if (item.isEdit) {
          if (!item.eNode) {
            this.gMemberInit[index].eNode = item.oldEnode
            this.gMemberInit[index].isEdit = !this.gMemberInit[index].isEdit
            this.msgError(this.$t('warn').w_17)
            return
          }
          if (item.eNode.indexOf('0x') !== -1) {
            item.eNode = this.$$.splitTx(item.eNode).eNode
          }
          if (!this.$$.eNodeCut(item.eNode).key || item.oldEnode.indexOf(this.$$.eNodeCut(item.eNode).key) === -1) {
            this.gMemberInit[index].eNode = item.oldEnode
            this.gMemberInit[index].isEdit = !this.gMemberInit[index].isEdit
            this.msgError(this.$t('warn').w_18)
            return
          }
          this.$$.getEnodeState(item.eNode).then(res  => {
            // console.log(res)
            this.gMemberInit[index].status = res === 'OnLine' ? 1 : 0
          })
        }
      }
      this.gMemberInit[index].isEdit = !this.gMemberInit[index].isEdit
      let nodeKey = this.$$.eNodeCut(item.eNode).key
      for (let i = 0, len = this.gMemberSelect.length; i < len; i++) {
        let obj = this.gMemberSelect[i]
        if (obj.indexOf(nodeKey) !== -1) {
          this.gMemberSelect[i] = item.eNode
          break
        }
      }
      console.log(item)
      // console.log(this.gMemberSelect)
    },
    changeMember (val) {
      // console.log(val)
      let minNum = this.gMode.indexOf('/') > 0 && this.gMode.split('/')[0] ? Number(this.gMode.split('/')[0]) : 1
      let curLen = val.length
      if (minNum >= curLen) {
        for (let i = 0, len = this.gMemberInit.length; i < len; i++) {
          let obj = this.gMemberInit[i]
          if (val.includes(obj.eNode)) {
            this.gMemberInit[i].disabled = true
          } else {
            this.gMemberInit[i].disabled = false
          }
        }
      } else {
        for (let i = 0, len = this.gMemberInit.length; i < len; i++) {
          let obj = this.gMemberInit[i]
          if (val.includes(obj.eNode)) {
            this.gMemberInit[i].disabled = false
          }
        }
      }
    },
    modalClick () {
      this.eDialog.send = false
      this.eDialog.pwd = false
      this.drawer.send = false
      this.gMemberSelect = []
    },
    init () {
      if (this.$route.query.publicKey) {
        this.loading.account = true
        this.gID = this.$route.query.gID ? this.$route.query.gID : ''
        this.pubKey = this.$route.query.publicKey ? this.$route.query.publicKey : ''
        this.gMode = this.$route.query.mode ? this.$route.query.mode : ''
        this.getAccounts()
        this.getGroupData()
      } else {
        // console.log(2)
        this.gID = ''
        this.gMode = ''
        this.pubKey = ''
        this.gMemberInit = []
        this.tableData = []
        this.getGroup = []
        this.loading.account = false
      }
    },
    getGroupData () {
      this.$$.getGroupObj(this.gID).then(res => {
        // console.log(res)
        if (res.msg === 'Success') {
          this.eNodeArr = res.info
          this.setMemberList()
        } else {
          this.msgError(res.error)
        }
      }).catch(err => {
        console.log(err)
        this.msgError(err)
      })
    },
    setMemberList () {
      // console.log(data)
      let arr = []
      for (let obj of this.eNodeArr) {
        if (obj.substr(0, obj.indexOf('@')) === this.eNode.substr(0, this.eNode.indexOf('@'))) continue
        arr.push({
          p1: 'dcrm',
          p2: 'getEnodeStatus',
          p3: [obj]
        })
      }
      this.gMemberSelect.push(this.eNode)
      this.$$.batchRequest(arr).then(res => {
        this.gMemberInit = []
        // console.log(res)
        for (let obj of res) {
          let cbData = JSON.parse(obj), status
          // console.log(cbData)
          if (cbData.Data && cbData.Data.Status && cbData.Data.Status === 'OnLine') {
            status = 'OnLine'
          } else {
            status = 'OffLine'
          }
          let _disabled = false
          if (this.gMode.split('/')[0] === this.gMode.split('/')[1] || Number(this.accountType)) {
            this.gMemberSelect.push(cbData.Data.Enode)
            _disabled = true
          }
          this.gMemberInit.push({
            oldEnode: cbData.Data.Enode,
            eNode: cbData.Data.Enode,
            status: status === 'OnLine' ? 1 : 0,
            disabled: _disabled,
            url: this.$$.eNodeCut(cbData.Data.Enode).ip,
            isEdit: false
          })
        }
        this.loading.nodeSelect = false
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
      // console.log(this.pubKey)
      if (this.pubKey) {
        this.$$.getAccountsBalance(this.pubKey, this.address).then(res => {
          // console.log(res)
          if (res.msg === 'Success') {
            for (let obj of res.info) {
              this.tableObj[obj.Cointype] = {
                address: obj.DcrmAddr,
                balance: obj.Balance
              }
            }
            this.tableRefresh = false
            this.$nextTick(() => {
              this.tableRefresh = true
            })
            // this.tableData = res.info
          }
          this.loading.account = false
        }).catch(err => {
          console.log(err)
          this.msgError(this.$t('warn').w_2)
          this.loading.account = false
        })
      } else {
        this.loading.account = false
      }
    },
    openReceive (index, item) {
      let url = '/account/receive'
      let address =  ''
      if (!this.tableObj[item.coinType] && this.tableObj['ETH']) {
        address = this.tableObj['ETH'].address
      } else {
        address = this.tableObj[item.coinType].address
      }
      this.toUrl(url, {
        address: address,
        coinType: item.coinType,
        ERC20Coin: item.coinType,
        gID: this.gID,
        publicKey: this.pubKey,
        mode: this.gMode,
        accountType: this.accountType
      })
    },
    setTxnsData (item) {
      let address =  '', balance = 0
      if (!this.tableObj[item.coinType] && this.tableObj['ETH']) {
        address = this.tableObj['ETH'].address
      } else {
        address = this.tableObj[item.coinType].address
      }
      balance = this.tableObj[item.coinType].balance
      // console.log(item)
      this.sendDataObj = {
        balance: balance,
        dcrmAddr: address,
        coinType: item.coinType,
        gID: this.gID,
        mode: this.gMode
      }
    },
    openSendDialog (index, item) {
      this.setTxnsData(item)
      this.gMemberSelect = []
      this.loading.nodeSelect = true

      this.drawer.select = true
      this.setMemberList()
      // if (!Number(this.accountType)) {
      //   this.loading.nodeSelect = true
      //   this.drawer.select = true
      //   this.setMemberList()
      // } else {
      //   this.gMemberSelect.push(this.eNode)
      //   for (let obj of this.gMemberInit) {
      //     this.gMemberSelect.push(obj.eNode)
      //   }
      //   this.toSendTxnsUrl()
      // }
    },
    toSendTxnsUrl (obj) {
      console.log(this.gMemberSelect)
      this.drawer.select = false
      this.drawer.send = true
    },
  }
}
</script>