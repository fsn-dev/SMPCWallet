<template>
  <div class="boxConntent1" v-loading="loading.list" element-loading-text="Loading……">
    <!-- <div>
      <el-button>Create Group</el-button>
    </div> -->
    <div class="g-list-box">
      <ul class="boxConntent1" v-if="gAccountList.length > 0">
        <li class="item flex-sc" :class="publicKey === item.publicKey ? 'active' : ''" v-for="(item, index) in gAccountList" :key="index" @click="changeGroup(item)" :title="item.publicKey">
          <div class="label">{{item.name ? $$.titleCase(item.name) : 'G'}}</div>
          {{item.name.length > 16 ? '04' + $$.cutOut(item.name, 8 ,4) : item.name}}
        </li>
      </ul>
      <div class="flex-c boxConntent1" v-else>
        <el-button type="primary" @click="Number(accountType) ? toUrl('/createPerson') : toUrl('createGroup')" class="btn-primary">{{$t('btn').createAccount}}</el-button>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
.g-list-box {
  width: 100%;height: 100%;padding: size(0) 0;overflow: auto;border-right:size(1) solid #f2f2f2;
  .item {
    width: 100%; cursor: pointer;padding: size(8) size(12);
    $label-h: 30px;
    &:hover{
      background: #c7c6c6;
    }
    &.active {
      background: #e6e5e5;
    }
    .label {
      width: $label-h;height:$label-h;text-align: center;line-height: $label-h;background: #0099ff;border-radius: 4px;color:#fff;margin-right: 10px;font-size: 14px;
    }
    // .el-collapse-item__header {
    //   background: none;
    // }
  }
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
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {findGaccount} from '@/db/gAccount'
export default {
  name: 'accountList',
  data () {
    return {
      gAccountList: [],
      publicKey: '',
      loading: {
        list: true
      }
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
        let arr = res.info ? res.info : [], arr1 = [], arr2 = []
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
                name: obj2.PubKey.substr(2)
              }
              arr2.push(obj3)
              arr1.push(obj2.PubKey)
            }
          }
        }

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
        this.loading.list = false
      }).catch(err => {
        if (err.error) {
          this.msgError(err.error)
        }
        this.loading.list = false
      })
    },
    getGName (item, i) {
      findGaccount({publicKey: item.publicKey}).then(res => {
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
        this.toUrl('/account', {gID: item.gID, publicKey: item.publicKey, mode: item.mode})
      } else {
        this.toUrl('/account', {gID: '', publicKey: '', mode: ''})
      }
      this.$emit('changeAccount')
    }
  }
}
</script>