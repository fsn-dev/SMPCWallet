<template>
  <div class="boxConntent1 container" v-loading="loading.init" :element-loading-text="$t('loading').l_1">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/dapp' }">{{$t('title').dapp}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').CrossChainBTC}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="mBTC-title">
      <h1 class="h1">{{$t('title').CrossChainBTC}}</h1>
      <p class="p">{{$t('tip').mBTC.d1 + ',' + $t('tip').mBTC.d2 + ',' + $t('tip').mBTC.d3}}</p>
      <p class="p flex-c">{{$t('label').unionNode}}:  <span class="WW30 ellipsis ml-10" :title="unionNode.join(',')">{{unionNode.join(',')}}</span></p>
    </div>

    <div class="swap-box">
      <div class="swap-cont">
        <div class="swap-up flex-bc">
          <div class="swap-style swap-up-left">
            <h3 class="label">{{$t('label').send}}</h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <div class="flex-sc">
                  <div class="coin-logo-view">
                    <div v-if="coinInfoObj[selectCoin]" class="HH100 WW100"><img :src="coinInfoObj[selectCoin][0].logo"></div>
                  </div>
                  <el-select v-model="selectCoin" @change="changeCoin" class="W120">
                    <el-option v-for="(item, index) in coinInfoObj" :key="index" :label="index" :value="index">
                      <div class="flex-sc">
                        <div class="coin-logo" v-if="item[0].logo"><img :src="item[0].logo"></div>
                        <div class="coin-logo txt" v-else>{{$$.titleCase(index)}}</div>
                        {{ index }}
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <el-input type="number" class="WW50 input-value" v-model="swap.fromValue" @input="changeValue"></el-input>
              </div>
            </div>
          </div>
          <div class="swap-style swap-up-right">
            <h3 class="label flex-bc">
              {{$t('label').to}}
              <span class="font12">fee = {{swap.fee * 100}}%</span>
            </h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <div class="flex-sc">
                  <div class="coin-logo-view">
                    <div v-if="coinInfoObj[selectCoin]" class="HH100 WW100"><img :src="coinInfoObj[selectCoin][0].logo"></div>
                  </div>
                  <div class="coin">mBTC</div>
                </div>
                <el-input type="number" class="WW50 input-value" v-model="swap.toValue" disabled></el-input>
              </div>
            </div>
          </div>
          <div class="swap-arrow"><i class="el-icon-d-arrow-right"></i></div>
        </div>
        <div class="swap-up flex-bc swap-receive mt-30">
          <div class="swap-style swap-down">
            <h3 class="label flex-bc">
              {{selectCoin}}:
            </h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <el-select v-model="swap.fromAddr" class="WW100">
                  <el-option v-for="(item, index) in selectCoinArr" :key="index" :label="item.address" :value="item.address">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="swap-style swap-down">
            <h3 class="label flex-bc">
              ETH:
            </h3>
            <div class="swap-input-box">
              <div class="swap-select flex-bc">
                <el-input type="text" class="WW100 input-value" v-model="swap.toAddr"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="WW100 flex-c mt-50">
        <el-button type="primary" class="btn-primary W300 IH50 font16">{{$t('btn').swap}}</el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table :data="historyData" style="width: 100%" :empty-text="$t('warn').w_12">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="tables-expand">
              <el-form-item label="Key ID:">
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
              <el-form-item :label="$t('label').date + ':'">
                <span>{{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm')}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column :label="$t('label').hash" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.txid}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').from" align="center">
          <template slot-scope="scope">
            <span class="cursorP" :title="scope.row.key">{{ $$.cutOut(scope.row.key, 10, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').value" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.gId">{{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 'no')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').to" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.pubKey">{{ $$.cutOut(scope.row.key, 10, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').pairHash" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.pubKey">{{ $$.cutOut(scope.row.key, 10, 12) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').fee" align="center">
          <template slot-scope="scope">
            <span :title="scope.row.pubKey">{{
              $$.thousandBit($$.fromWei(scope.row.value, $$.cutERC20(scope.row.coinType).coinType), 'no')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label').date" width="200" align="center">
          <template slot-scope="scope">
            {{$$.timeChange(scope.row.timestamp, 'yyyy-mm-dd hh:mm:ss')}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss">
$white-bgH: 48;
.mBTC-title {
  .h1 {
    text-align: center;font-size: size(45);color: #252525;line-height: size(68);font-weight: bold;
  }
  .p{
    text-align: center;font-size: size(20);color: #2762E0;margin-top: size(20);font-weight: bold;
  }
}
.swap-box {
  width: 100%;padding: size(30);border: size(1) solid #E9E9E9;margin-top: size(45);
  .swap-cont {
    width: 100%;background: #E9E9E9;padding: size(50) size(40);
    .swap-up {
      position: relative;
      .swap-style {
        width: 40%;
        .label {
          font-size: size(20);color: #2762E0;font-weight: bold;margin-bottom: size(15);
        }
        .swap-select {
          $cLogo: 38;
          $cPtbl: ($white-bgH - $cLogo) / 2;
          width: 100%;height: 100%;padding:size($cPtbl) size(20) size($cPtbl) size($cPtbl);
          .coin-logo-view {
            width: size($cLogo);height: size($cLogo);
            img {
              width: 100%;
            }
          }
          .coin {
            font-weight: bold;color: #2762E0;padding-left: size(15);
          }
          .el-select {
            .el-input__inner {
              color: #2762E0;font-weight: bold;
            }
          }
          .input-value {
            .el-input__inner {
              text-align: right;font-weight: bold;
            }
          }
          .el-input__inner {
            background: none;border:none;
          }
        }
        &.swap-down {
          .label {
            font-size: size(16);color: #666666;font-weight: normal;
          }
          .el-select {
            .el-input__inner {
              color: #666666;font-weight: normal;
            }
          }
          .input-value {
            .el-input__inner {
              text-align: left;font-weight: normal;
            }
          }
        }
      }
      .swap-arrow {
        position: absolute;top: size(50);left: 50%;font-size: size(30);color: #2762E0;margin-left:size(-15);
      }
    }
  }
}

.coin-logo {
  width: size(20);height: size(20);margin-right: size(10);font-size:size(12);
  &.txt {
    border:size(1) solid $color-primary;border-radius: 100%;color: $color-primary;
  }
  img {
    width:100%;display: block;
  }
}
.swap-input-box {
  background: #fff;height: size($white-bgH);border-radius: size(24);position: relative;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public.js'
import getAllAccountList from '@/assets/js/pages/accounts/getAllAccountList.js'
import formatAccountCoins from '@/assets/js/pages/accounts/formatAccountCoins.js'
export default {
  name: 'crossChain',
  data () {
    return {
      coinInfoObj: {},
      selectCoin: 'BTC',
      selectCoinArr: [],
      swap: {
        fee: 0.001,
        fromAddr: '',
        fromValue: 0,
        toAddr: '',
        toValue: 0,
      },
      historyData: [],
      loading: {
        init: true
      },
      unionNode: []
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    NodeAndOtherData (res) {
      console.log(res)
      for (let obj of res.info.nodeList) {
        if (obj.nodeType === 0) {
          this.unionNode.push(obj.name)
        }
      }
    }
  },
  mounted () {
    this.loading.init = true
    setTimeout(() => {
      this.init()
    }, 300)
  },
  methods: {
    ...getAllAccountList,
    ...formatAccountCoins,
    init () {
      this.$socket.emit('NodeAndOtherData')
      this.getAllAccountList().then(res => {
        // console.log(res)
        this.getAllCoins(res)
      })
    },
    getAllCoins (res) {
      let arr = [], allCoins = []
      for (let obj of res) {
        arr.push({ p1: 'dcrm', p2: 'getAccountsBalance', p3: [obj.publicKey, this.address] })
      }
      this.$$.batchRequest(arr).then(res1 => {
        // console.log(res1)
        for (let i = 0, len = res1.length; i < len; i++) {
          let cbData = res1[i], arr1 = []
          if (typeof cbData === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            arr1 = cbData.Data.result.Balances
          }
          let coinArr = this.formatAccountCoins(arr1, res[i].accountType)
          allCoins.push(...coinArr)
        }
        for (let obj of allCoins) {
          if (!this.coinInfoObj[obj.coinType]) {
            this.coinInfoObj[obj.coinType] = []
          }
          this.coinInfoObj[obj.coinType].push(obj)
        }
        // console.log(allCoins)
        this.changeCoin()
        this.loading.init = false
      })
    },
    changeCoin () {
      this.selectCoinArr = this.coinInfoObj[this.selectCoin]
      this.swap.fromAddr = ''
      // console.log(123)
    },
    getHistory () {

    },
    changeValue () {
      this.swap.toValue = (1 - this.swap.fee) * this.swap.fromValue
    }
  }
}
</script>