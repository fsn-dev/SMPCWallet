<template>
  <div class="boxConntent1" v-loading="loading.account" :element-loading-text="$t('loading').l_1">
    <div class="flex-bc a-header-box" v-if="!Number(accountType)">
      <div></div>
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
            {{ isNaN(scope.row.Balance) ? 0 : $$.fromWei(scope.row.Balance, $$.cutERC20(scope.row.Cointype).coinType)}}
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

    <div class="flex-c boxConntent1 color_99" v-if="!gID && !Number(accountType)">{{$t('warn').w_1}}</div>

    <!-- 查看组成员 start -->
    <el-drawer :visible.sync="drawer.member" :destroy-on-close="true" :show-close="false">
      <div slot="title">
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
      <!-- <div slot="title">
        <drawer-logo @close-drawer="drawer.select = false"></drawer-logo>
      </div> -->
      <div class="plr15">
        <drawer-logo @close-drawer="drawer.create = false"></drawer-logo>
      </div>
      <div class="d-content-view node-select-box" v-loading="loading.nodeSelect" :element-loading-text="$t('loading').l_1">
        <h3 class="h3">{{$t('title').selectNode}}</h3>
        <div v-if="drawer.select">
          <!-- <el-checkbox class="mb-20" disabled="disabled" v-model="oneself">
            <div class="flex-bc">
              {{$$.cutOut(eNode, 12, 16)}}
              <span class="color_green flex-bc ml-10"><i class="el-icon-user mr-5"></i>{{$t('label').self}}</span>
            </div>
          </el-checkbox> -->
          <el-checkbox-group v-model="gMemberSelect"  @change="changeMember">
          <!-- <el-checkbox-group v-model="gMemberSelect" :min="gMode.indexOf('/') > 0 && gMode.split('/')[0] ? (Number(gMode.split('/')[0]) - 1) : 1" class=""> -->
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
      <!-- <div slot="title">
        <drawer-logo @close-drawer="drawer.send = false"></drawer-logo>
      </div> -->
      <div class="plr15">
        <drawer-logo @close-drawer="drawer.create = false"></drawer-logo>
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
      tableData: [],
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
  components: {sendTxns},
  mounted () {
    setTimeout(() => {
      this.init()
    }, 50)
    // console.log(this.$route.query)
  },
  methods: {
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
            this.$$.web3.setProvider(url)
            this.$$.web3.dcrm.getEnode().then(res => {
              let cbData = res
              cbData = JSON.parse(cbData)
              // console.log(cbData)
              if (cbData.Status === "Success") {
                let _enode = cbData.Data.Enode
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
              this.$$.web3.setProvider(this.serverRPC)
            }).catch(err => {
              console.log(err)
              this.gMemberInit[index].eNode = item.oldEnode
              this.gMemberInit[index].url = this.$$.eNodeCut(item.oldEnode).ip
              this.$$.web3.setProvider(this.serverRPC)
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
      console.log(item)
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
            this.tableData = res.info
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
      this.toUrl(url, {
        address: item.DcrmAddr,
        coinType: item.Cointype,
        ERC20Coin: item.Cointype,
        gID: this.gID,
        publicKey: this.pubKey,
        mode: this.gMode
      })
    },
    setTxnsData (item) {
      // console.log(item)
      this.sendDataObj = {
        balance: item.Balance,
        dcrmAddr: item.DcrmAddr,
        coinType: item.Cointype,
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
      this.drawer.select = false
      this.drawer.send = true
    },
  }
}
</script>