<template>
  <div class="boxConntent1 container">
    <!-- <div class="receiveContent_box">
    </div> -->
    <div class="receiveAddress_box">
      <el-form label-position="top" label-width="80px" @submit.native.prevent>
        <el-form-item :label="addressTitle">
          <el-input v-model="selectData.address" class="font24" :readonly	="true"></el-input>
        </el-form-item>
      </el-form>
      <div class="receiveAddress_btn flex-c">
        <button class="btn blue flex-c" @click="qrcode(selectData.address)">
          <div class="icon">
            <img src="@/assets/img/QRcode.svg">
          </div>
          {{$t('btn').code}}
        </button>
        <button class="btn cyan flex-c" @click="copyTxt(selectData.address)">
          <div class="icon"><img src="@/assets/img/copy.svg"></div>
          <el-popover trigger="hover" :content="$t('btn').copy">
            <div class="addreess" slot="reference">{{$t('btn').copy}}</div>
          </el-popover>
        </button>
      </div>
    </div>

    <div class="tableHistory_box mt-20">
      <hgroup class="tableHistory_title">
        <h3 class="title">{{$t('title').history}}:</h3>
      </hgroup>
      <div class="tableHistory_table table-responsive" v-loading="loading.history" :element-loading-text="$t('loading').l_1">
        <el-table :data="historyData" style="width: 100%" empty-text="Null" size="mini">
          <el-table-column :label="$t('state').name" width="80">
            <template slot-scope="scope">
              <span v-html="scope.row.status" class="color_green"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('label').coinType" prop="coinType" width="80"></el-table-column>
          <el-table-column :label="$t('label').amount" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.contractValue ? scope.row.contractValue : scope.row.value}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('label').date" prop="date" width="180">
            <template slot-scope="scope">
              {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('label').info" min-width="360">
            <template slot-scope="scope">
              <el-collapse class="moreInfo_box" accordion v-model="activeNames">
                <el-collapse-item :title="scope.row.hash">
                  <ul class="list">
                    <li @click="copyTxt(scope.row.hash)">{{$t('label').hash}}：{{scope.row.hash}}</li>
                    <li @click="copyTxt(scope.row.from)">{{$t('label').from}}：{{scope.row.from}}</li>
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

    <el-dialog :visible.sync="codeViewVisible" width="380px">
      <div class="qrcodeCont_box">
        <div id="qrcode" class="flex-c"></div>
        <div class="qrcodeCont_title">
          <h3>{{$t('label').address}}</h3>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<style>
/* .receiveContent_box{width:100%;padding:0 21px 0 0;margin:10px 0 0px;padding-bottom:21px} */
.receiveAddress_box{width:100%;border-bottom:1px solid #ddd;padding: 20px 20px;}
.receiveAddress_box .el-form--label-top .el-form-item__label{padding:0;line-height: 24px;}
.receiveAddress_pwd{width:100%;height:37px;position:relative;}
.receiveAddress_pwd .input{width:100%;height:100%;text-align:center;font-size:28px;font-weight:bold;border:1px solid #dddddd;}
.receiveAddress_pwd .amount{width:100%;height:100%;font-size:20px;border:1px solid #dddddd;padding-right:70px;}
.receiveAddress_pwd .currency{width:70px;height:100%;text-align:center;line-height:37px;position:absolute;top:0;right:0;}
.receiveAddress_btn{width:100%;padding:0px 0 21px;text-align:center;}
.receiveAddress_btn .el-button--primary {color: #FFF;background-color: #409EFF;border-color: #409EFF;}
.receiveAddress_btn .btn{width:160px;height:38px;color:#fff;font-size:16px;padding-left:0;padding-right:0;}
.receiveAddress_btn .btn .icon{width:16px;height:16px;margin-right:8px;}
.receiveAddress_btn .btn .icon img{width: 100%;height: 100%;}
.receiveAddress_btn .blue{background:#3078d7;margin-right:12px;}
.receiveAddress_btn .cyan{background:#285b7e;}
/* .tableHistory_table .el-collapse-item__header {overflow: hidden;white-space: nowrap;} */

.moreInfo_box{width:100%;position:relative;}
/* .moreInfo_box .moreInfo_hax{width:100%;max-width:300px;cursor:pointer;} */
.moreInfo_box .el-collapse-item__header{width:100%;height: 30px;line-height:30px;cursor:pointer;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;border: none;font-size:12px!important;padding-right: 30px;}
.moreInfo_box .el-icon-arrow-right{position: absolute;top:10px;right: 0;}
.moreInfo_box .el-collapse-item__content{padding: 0;}
.moreInfo_box.el-collapse{border: none}
.moreInfo_box .list{width:100%;background:#fff;border:1px solid #eee;font-size: 12px}
.moreInfo_box .list li{width:100%;word-break: break-all;border-bottom:1px solid #eee;padding: 10px 10px;line-height: 21px;cursor: pointer;}
.moreInfo_box .list li:last-child{border-bottom:none}
/* .moreInfo_box:hover .list{display:block;z-index:99;} */
.moreInfo_box .list li:hover{background: #eee;}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: "receive",
  data () {
    return {
      historyData: [],
      refreshTable: null,
      codeViewVisible: false,
      loading: {
        history: true
      },
      activeNames: "",
      isRefreshStart: true,
      pageInfo: {
        pageNum: 1,
        total: 0,
        pageSize: 20,
      }
      // count: 0
    }
  },
  computed: {
    ...computedPub,
    addressTitle () {
      return this.selectData.coinType + " Receiving Address"
    }
  },
  created () {
    console.log(this.$route.query)
    this.selectData = this.$route.query
  },
  mounted () {
    this.getSendHistory()
  },
  methods: {
    qrcode (cont) {
      this.codeViewVisible = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    getHistoryUrl () {
      const coin = this.$$.cutERC20(this.selectData.coinType).coinType
      const coininfo = this.$$.getCoinInfo(coin)
      // console.log(coininfo)
    },
    getSendHistory () {
      // this.loading.history = false
      let url = this.$$.config.receiveAddrUrl + `txs/${this.selectData.coinType}/${this.selectData.address.toLowerCase()}`
      const coin = this.$$.cutERC20(this.selectData.coinType).coinType
      // let url = 'http://5.189.139.168:5000/txs/ETH/0x21c743d9637cba6c133f86312d24ed012ff4?6f42'
      console.log(url)
      this.historyData = []
      this.$axios.get(url).then(res => {
        let data = res.data
        console.log(data)
        if (data && data.length > 0) {
          for (let obj of data) {
            let tData = {
              from: obj.FromAddress,
              hash: obj.Txhash,
              timestamp: obj.Timestamp,
              value: 0,
              coinType: coin,
              status: 'Success'
            }
            for (let obj2 of obj.TxOutputs) {
              if (obj2.ToAddress.toLowerCase() === this.selectData.address.toLowerCase()) {
                tData.value += Number(this.$$.thousandBit(this.$$.fromWei(obj2.Value, coin), 'no'))
              }
            }
            this.historyData.push(tData)
            // tData.value = this.$$.thousandBit(this.$$.fromWei(tData.value, coin), 'no')
          }
        }
        this.loading.history = false
      }).catch(err => {
        console.log(err)
        this.loading.history = false
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.refreshTable)
    this.refreshTable = null
  }
}
</script>
