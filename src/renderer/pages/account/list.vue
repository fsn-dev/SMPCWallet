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
            <div class="item" :class="publicKey === item.publicKey ? 'active' : ''" slot="reference">
              <div class="label flex-c">
                <!-- {{item.name ? $$.titleCase(item.name) : 'A'}} -->
                <img :src="item.img">
              </div>
              <div class="flex-sc flex-wrap" style="width:223px;">
                <div class="WW100 pubkey flex-bc">
                  <!-- <span class="name">{{item.name.length > 16 ? '04' + $$.cutOut(item.name, 6 ,0) : item.name}}</span> -->
                  <span class="name">{{item.name.length > 16 ? item.name.substr(0,6) : item.name}}</span>
                  <div class="flex-ec WW40">
                    <i class="account person" v-if="item.accountType">{{$t('title').person}}</i>
                    <i class="account group" v-if="!item.accountType">{{$t('title').group}}</i>
                    <i class="account mode">{{item.mode}}</i>
                  </div>
                </div>
                <div class="flex-bc font12 color_99 info WW100 mt-10">
                  <span class="WW40 ellipsis">{{$$.cutOut(item.publicKey, 8 , 0)}}</span>
                  <span class="WW50 ellipsis text-r">{{item.timestamp ? $$.timeChange(item.timestamp, 'yyyy-mm-dd') : ''}}</span>
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
    width: 100%; cursor: pointer;padding: size(15) size(12) size(15) size(55);border-bottom: 3px solid #f4f5f7;border-left: 3px solid transparent;position: relative;
    $label-h: 36px;
    &:hover{
      background: rgba(39,98,224,.2);border-left: 3px solid #2762e0;
    }
    &.active {
      background: rgba(39,98,224,.2);border-left: 3px solid #2762e0;
    }
    .label {
      width: $label-h;height:$label-h;border-radius: 4px;color:#fff;margin-right: 10px;position:absolute;top:size(15);left:size(10);
      img {
        width: 100%;height: 100%;display: block;
      }
    }
    .pubkey {
      line-height: 18px;margin-bottom: 3px;font-size: 14px;color: #333;color: #666;
      .name {
        width: 50%;color: #333;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
      }
      .account {
        font-size: 10px;line-height:18px;color: #fff;padding: 0 8px;border-radius: 9px;margin-left: 8px;white-space: nowrap;
      }
      .person {
        background: #2762e0;
      }
      .group {
        background: #ffaa00;
      }
      .mode {
        background: #16a05d;
      }
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
    // accountType (type) {
    //   this.loading.list = true
    //   this.init()
    // }
  },
  mounted () {
    this.loading.list = true
    // console.log(this.$route.query)
    setTimeout(() => {
      this.init()
    }, 300)
  },
  methods: {
    init () {
      let arr = [
        { p1: 'dcrm', p2: 'getAccounts', p3: [this.address, '0'] },
        { p1: 'dcrm', p2: 'getAccounts', p3: [this.address, '1'] },
      ]
      this.$$.batchRequest(arr).then(res => {
        // console.log(res)
        let groupArr = this.formatAccont(res[0], 0)
        let personArr = this.formatAccont(res[1], 1)
        let allArr = [...groupArr, ...personArr]
        // console.log(allArr)
        allArr = allArr.sort(this.$$.bigToSmallSort('timestamp'))
        for (let i = 0, len = allArr.length; i < len; i++) {
          this.gAccountList.push(allArr[i])
          this.getGName(allArr[i], i)
        }
        if (this.$route.query.gID) {
          this.changeGroup(this.$route.query)
        } else if (this.gAccountList.length > 0) {
          this.changeGroup(this.gAccountList[0])
        } else {
          this.changeGroup()
        }
        this.loading.list = false
      })
    },
    formatAccont (res, type) {
      let arr = [], arr1 = [], arr2 = []
      if (res.Status !== 'Error') {
        arr = res.Data.result && res.Data.result.Group ? res.Data.result.Group : []
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
              timestamp: obj2.TimeStamp,
              accountType: type,
              img: this.$$.createImg(obj2.PubKey)
            }
            arr2.push(obj3)
            arr1.push(obj2.PubKey)
          }
        }
      }
      return arr2
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
      console.log(item)
      if (item) {
        this.publicKey = item.publicKey
        this.toUrl('/account', {gID: item.gID, publicKey: item.publicKey, mode: item.mode, accountType: item.accountType})
        this.$store.commit('setAccountType', {info: item.accountType})
      } else {
        this.toUrl('/account', {gID: '', publicKey: '', mode: '', accountType: this.accountType})
      }
      // this.$store.commit('setAccountType', {info: type})
      this.$emit('changeAccount')
    }
  }
}
</script>