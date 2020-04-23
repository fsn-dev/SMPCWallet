<template>
  <div class="boxConntent1 pb-20" v-loading="loading.list" element-loading-text="Loading……">
    <div class="g-list-box">
      <ul class="boxConntent1" v-if="gAccountList.length > 0">
        <li v-for="(item, index) in gAccountList" :key="index" @click="changeGroup(item)">
          <el-popover placement="right" trigger="hover" :open-delay="2000">
            <div class="pubKeyTip">
              <p class="flex-sc info"><span class="flex-ec label">ID:</span> {{$$.cutOut(item.publicKey, 8 ,8)}}</p>
              <p class="mt-5 flex-sc info"><span class="flex-ec label">GID:</span> {{$$.cutOut(item.gID, 8 ,8)}}</p>
              <p class="mt-5 flex-sc info"><span class="flex-ec label">Mode:</span> {{item.mode}}</p>
              <p class="mt-5 flex-sc info"><span class="flex-ec label">Date:</span> {{item.timestamp ? $$.timeChange(item.timestamp, 'yyyy-mm-dd hh:mm') : ''}}</p>
              <div class="flex-ec mt-10">
                <el-button type="primary" size="mini" @click="toUrl('/set/gAccount')">{{$t('btn').setName}}</el-button>
              </div>
            </div>
            <div class="item flex-sc" :class="publicKey === item.publicKey ? 'active' : ''" slot="reference">
              <div class="label">{{item.name ? $$.titleCase(item.name) : 'A'}}</div>
              <div class="flex-sc flex-wrap">
                <p class="WW100 pubkey">{{item.name.length > 16 ? '04' + $$.cutOut(item.name, 8 ,4) : item.name}}</p>
                <div class="flex-bc font12 color_99 info WW100">
                  <span>{{item.mode}}</span>
                  <span>{{item.timestamp ? $$.timeChange(item.timestamp, 'yyyy-mm-dd hh:mm') : ''}}</span>
                </div>
              </div>
            </div>
          </el-popover>
        </li>
      </ul>
      <div class="flex-c boxConntent1" v-else>
        <el-button type="primary" @click="Number(accountType) ? toUrl('/createPerson') : toUrl('createGroup')" class="btn-primary">{{$t('btn').createAccount}}</el-button>
      </div>
    </div>
    <div class="account-num flex-c">
      Total: {{gAccountList.length}} 
    </div>

  </div>
</template>

<style lang="scss">
.g-list-box {
  width: 100%;height: 100%;padding: size(0) 0;overflow: auto;border-right:size(1) solid #f2f2f2;
  .item {
    width: 100%; cursor: pointer;padding: size(8) size(12);
    $label-h: 36px;
    &:hover{
      background: #c7c6c6;
    }
    &.active {
      background: #e6e5e5;
    }
    .label {
      width: $label-h;height:$label-h;text-align: center;line-height: $label-h;background: #0099ff;border-radius: 4px;color:#fff;margin-right: 10px;font-size: 14px;
    }
    .pubkey {
      line-height: 18px;margin-bottom: 3px;font-size: 14px;color: #333;color: #666;
    }
    .info {
      line-height: 12px;
    }
    // .el-collapse-item__header {
    //   background: none;
    // }
  }
}

.pubKeyTip {
  font-size: 12px;
  .label {
    width: 40px;margin-right: 5px;
  }
}

.account-num {
  position: absolute;bottom:0;left: 0;right: 0;font-size: 12px;background: #f2f2f2;color: #999;border-right:size(1) solid #f2f2f2;
}

.night {
  .g-list-box {
    border-right:size(1) solid $night-line-color;
    .item {
      color: $night-text-color;
      &:hover{
        background: $night-line-color;
      }
      &.active {
        background: $night-line-color;
      }
    }
  }
  .account-num {
    background: $night-line-color;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'accountList',
  data () {
    return {
      gAccountList: [],
      publicKey: '',
      loading: {
        list: true
      },
      visible: false
    }
  },
  computed: {
    ...computedPub,
  },
  watch: {
    accountType (type) {
      this.loading.list = true
      this.init()
    }
  },
  mounted () {
    this.loading.list = true
    // console.log(this.$$.web3)
    this.init()
  },
  methods: {
    init () {
      this.$$.getAccounts(this.address, this.accountType).then(res => {
        console.log(res)
        this.gAccountList = []
        if (res.msg === 'Success') {
          let arr = res.info ? res.info : []
          this.accountFormat(arr)
        } else {
          this.msgError(res.error)
        }
        this.loading.list = false
      })
    },
    accountFormat (arr) {
      let arr1 = [], arr2 = []
      if (arr.length <= 0) {
        this.changeGroup()
        this.loading.list = false
        return
      }
      for (let obj1 of arr) {
        for (let obj2 of obj1.Accounts) {
          if (!arr1.includes(obj2.PubKey)) {
            // console.log(obj2)
            let obj3 = {
              publicKey: obj2.PubKey,
              gID: obj1.GroupID,
              mode: obj2.ThresHold,
              name: obj2.PubKey.substr(2),
              timestamp: obj2.TimeStamp
            }
            arr2.push(obj3)
            arr1.push(obj2.PubKey)
          }
        }
      }
      arr2 = arr2.sort(this.$$.bigToSmallSort('timestamp'))
      for (let i = 0, len = arr2.length; i < len; i++) {
        this.gAccountList.push(arr2[i])
        this.getGName(arr2[i], i)
      }
      if (this.$route.query.gID) {
        this.changeGroup({
          gID: this.$route.query.gID,
          publicKey: this.$route.query.publicKey,
          mode: this.$route.query.mode,
        })
      } else if (this.gAccountList.length > 0) {
        this.changeGroup(this.gAccountList[0])
      } else {
        this.changeGroup()
      }
    },
    getGName (item, i) {
      this.$db.findGaccount({publicKey: item.publicKey, address: this.address}).then(res => {
        // console.log(res)
        if (res.length > 0) {
          this.gAccountList[i].name = res[0].name
        }
      })
    },
    changeGroup (item) {
      // console.log(item)
      if (item) {
        this.publicKey = item.publicKey
        this.toUrl('/account', {gID: item.gID, publicKey: item.publicKey, mode: item.mode})
      } else {
        this.toUrl('/account', {gID: '', publicKey: '', mode: ''})
      }
      this.$emit('changeAccount')
    }
  }
}
</script>