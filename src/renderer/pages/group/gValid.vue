<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="groupForm" ref="groupForm" label-width="100px" label-position="top">
        <el-form-item label="账户名" prop="name">
          <el-input v-model="groupForm.name" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="模式">
          <el-select v-model="groupForm.mode" placeholder="请选择模式" class="WW100" disabled="disabled">
            <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(eNode, index) in groupForm.eNode" :label="'用户' + index" :key="eNode.key">
          <div class="flex-bc">
            <el-input v-model="eNode.value" disabled="disabled"></el-input>
            <!-- <el-button @click.prevent="removeDomain(eNode)" class="ml-10" v-if="Number(index) !== 0">删除</el-button> -->
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="agreeGroup('groupForm')">同意</el-button>
          <el-button type="danger" @click="refuseGroup('groupForm')">拒绝</el-button>
          <el-button @click="toUrl('/group')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/index';
</style>

<script>
export default {
  name: '',
  data () {
    return {
      groupForm: {},
      modeArr: this.$$.mode,
    }
  },
  mounted () {
    this.showGroupData()
    // console.log(this.$$.getGroupObj(this.groupForm.gID))
  },
  methods: {
    showGroupData () {
      let urlParams = this.$route.query
      let arr = []
      for (let obj of urlParams.Enodes) {
        arr.push({
          value: obj
        })
      }
      this.groupForm = {
        name: urlParams.Gname,
        mode: urlParams.Mode,
        eNode: arr,
        gID: urlParams.Gid,
      }
    },
    agreeGroup () {

    },
    refuseGroup () {

    }
  }
}
</script>
