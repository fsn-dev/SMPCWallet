<template>
  <div class="boxConntent1">
    <!-- <div>
      <el-button>Create Group</el-button>
    </div> -->
    <div class="g-list-box">
      <!-- <el-collapse accordion v-if="groupList.length > 0">
        <el-collapse-item class="item" v-for="(item, index) in groupList" :key="index">
          <template slot="title">
            <div class="flex-sc pl-10">
              <div class="label">{{item.publicKey ? $$.titleCase(item.publicKey) : 'G'}}</div>
              {{$$.cutOut(item.publicKey, 6,4)}}
            </div>
          </template>
          <ul>
            <li></li>
          </ul>
        </el-collapse-item>
      </el-collapse> -->
      <ul class="boxConntent1" v-if="groupList.length > 0">
        <li class="item flex-sc" :class="publicKey === item.publicKey ? 'active' : ''" v-for="(item, index) in groupList" :key="index" @click="changeGroup(item)">
          <div class="label">{{item.publicKey ? $$.titleCase(item.publicKey) : 'G'}}</div>
          {{$$.cutOut(item.publicKey, 10,4)}}
        </li>
      </ul>
      <div class="flex-c boxConntent1" v-else>
        <el-button type="primary" @click="toUrl('createGroup')">创建共管账户</el-button>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
.g-list-box {
  width: 100%;height: 100%;background: #fff;padding: size(0) 0;overflow: auto;border-right:size(1) solid #f2f2f2;
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
</style>

<script>
export default {
  name: '',
  data () {
    return {
      groupList: [],
      publicKey: '',
      gID: ''
    }
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
      this.$$.getAccounts().then(res => {
        console.log(res)
        this.groupList = []
        let arr = res.info ? res.info : []
        for (let obj1 of arr) {
          for (let obj2 of obj1.Accounts) {
            this.groupList.push({
              publicKey: obj2,
              gID: obj1.GroupID
            })
          }
        }
        if (this.$route.query.gID) {
          this.gID = this.$route.query.gID
        }
      }).catch(err => {
        this.$message.error(err.toString())
      })
    },
    changeGroup (item) {
      console.log(item)
      // console.log(this.$$.web3.dcrm.getAccountsBalance(item))
      this.gID = item.Gid
      this.publicKey = item.publicKey
      this.toUrl('/group', {gID: item.gID, publicKey: item.publicKey})
    }
  }
}
</script>