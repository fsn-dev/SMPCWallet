<template>
  <div class="boxConntent1">
    <!-- <div>
      <el-button>Create Group</el-button>
    </div> -->
    <div class="g-list-box">
      <ul class="boxConntent1" v-if="groupList.length > 0">
        <li class="item flex-sc" :class="gID === item.Gid ? 'active' : ''" v-for="(item, index) in groupList" :key="index" @click="changeGroup(item)">
          <div class="label">{{item.Gname ? item.Gname.substr(0, 1).toUpperCase() : 'G'}}</div>
          {{item.Gname}}
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
  width: 100%;height: 100%;background: #e6e5e5;padding: 5px 0;overflow: auto;
  .item {
    width: 100%;padding: 8px 10px; cursor: pointer;
    $label-h: 30px;
    &:hover{
      background: #c7c6c6;
    }
    &.active {
      background: #c7c6c6;
    }
    .label {
      width: $label-h;height:$label-h;text-align: center;line-height: $label-h;background: #0099ff;border-radius: 4px;color:#fff;margin-right: 10px;font-size: 14px;
    }
  }
}
</style>

<script>
export default {
  name: '',
  data () {
    return {
      groupList: [],
      gID: ''
    }
  },
  watch: {
    '$route' (cur) {
      if (cur.query.gID) {
        this.gID = this.$route.query.gID
      } else {
        this.gID = ''
      }
      // this.refreshPage()
    }
  },
  mounted () {
    this.initGroup()
  },
  methods: {
    initGroup () {
      this.$$.getGroup().then(res => {
        this.groupList = res.info
        if (this.$route.query.gID) {
          this.gID = this.$route.query.gID
        }
      }).catch(err => {
        this.$message.error(error.toString())
      })
    },
    changeGroup (item) {
      console.log(item)
      this.gID = item.Gid
      this.toUrl('/group', {gID: item.Gid})
    }
  }
}
</script>