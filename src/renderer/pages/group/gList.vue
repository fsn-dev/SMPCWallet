<template>
  <div class="boxConntent1">
    <!-- <div>
      <el-button>Create Group</el-button>
    </div> -->
    <div class="g-list-box">
      <ul class="boxConntent1" v-if="gList.length > 0">
        <li class="item flex-sc" :class="publicKey === item.publicKey ? 'active' : ''" v-for="(item, index) in gList" :key="index" @click="changeGroup(item)">
          <div class="label">{{item.publicKey ? $$.titleCase(item.publicKey) : 'G'}}</div>
          {{$$.cutOut(item.publicKey, 10,4)}}
        </li>
      </ul>
      <div class="flex-c boxConntent1" v-else>
        <el-button type="primary" @click="toUrl('createGroup')" class="btn-primary">{{$t('btn').createAccount}}</el-button>
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
export default {
  name: '',
  data () {
    return {
      gList: [],
      publicKey: '',
      gID: ''
    }
  },
  computed: {
    ...computedPub,
  },
  watch: {
    '$route' (cur) {
      console.log(cur)
      if (cur.query.gID) {
        this.gID = this.$route.query.gID
        this.publicKey = this.$route.query.publicKey
      } else {
        this.gID = ''
        this.publicKey = ''
      }
      // this.refreshPage()
    }
  },
  mounted () {
    this.publicKey = this.$route.query.publicKey
    // console.log(this.publicKey)
    this.initGroup()
  },
  methods: {
    initGroup () {
      this.$$.getAccounts('', this.safeMode).then(res => {
        console.log(res)
        this.gList = []
        let arr = res.info ? res.info : []
        for (let obj1 of arr) {
          for (let obj2 of obj1.Accounts) {
            this.gList.push({
              publicKey: obj2,
              gID: obj1.GroupID
            })
          }
        }
        if (this.$route.query.gID) {
          this.gID = this.$route.query.gID
        }
      }).catch(err => {
        if (err.error) {
          this.msgError(err.error)
        }
      })
    },
    changeGroup (item) {
      console.log(item)
      this.gID = item.Gid
      this.publicKey = item.publicKey
      this.toUrl('/group', {gID: item.gID, publicKey: item.publicKey})
    }
  }
}
</script>