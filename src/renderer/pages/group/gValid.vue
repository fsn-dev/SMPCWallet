<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="gForm" ref="gForm" label-width="100px" label-position="top">
        <el-form-item label="账户名" prop="name">
          <el-input v-model="gForm.name" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('label').mode">
          <el-select v-model="gForm.mode" placeholder="" class="WW100" disabled="disabled">
            <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(eNode, index) in gForm.eNode" :label="$t('label').admins + index" :key="eNode.key">
          <div class="flex-bc">
            <el-input v-model="eNode.value" disabled="disabled"></el-input>
            <!-- <el-button @click.prevent="removeDomain(eNode)" class="ml-10" v-if="Number(index) !== 0">删除</el-button> -->
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyGroup('AGREE')" v-if="isApply">{{$t('btn').agree}}</el-button>
          <el-button type="danger" @click="applyGroup('DISAGREE')" v-if="isApply">{{$t('btn').refuse}}</el-button>
          <el-button @click="toUrl('/gNewsList')">{{$t('btn').back}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="300" :before-close="modalClick">
      <div>
        <ul>
          <li></li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="confirmGroup">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
// @import '@/assets/scss/index';
</style>

<script>
export default {
  name: '',
  data () {
    return {
      eDialog: {
        confirm: false
      },
      gForm: {},
      modeArr: this.$$.mode,
      gID: this.$$.eNode,
      isApply: false,
      applyType: ''
    }
  },
  mounted () {
    // this.initGroupData = this.$route.query
    // console.log(this.initGroupData)
    this.showGroupData()
  },
  methods: {
    modalClick () {
      this.eDialog.confirm = false
      this.applyType = ''
    },
    async showGroupData () {
      let urlParams = this.$route.query
      let arr = []
      for (let obj of urlParams.Enodes) {
        arr.push({
          value: obj
        })
      }
      this.gForm = {
        name: urlParams.Gname,
        mode: urlParams.Mode,
        eNode: arr,
        gID: urlParams.Gid,
      }
      // console.log(urlParams)
      // let status = this.$$.getGroupStatus()
      if (urlParams.Status && urlParams.Status === 'NEW') {
        this.isApply = true
      } else {
        this.isApply = false
      }
    },
    applyGroup (type) {
      this.applyType = type
      this.eDialog.confirm = true
    },
    confirmGroup () {
      this.$$.validGroup(this.gForm.name, this.gID, this.applyType).then(res => {
        console.log(res)
        if (res.msg === 'Success' && !res.info.Error) {
          this.msgSuccess(this.$t('warn').w_11)
          this.toUrl('/group')
        } else {
          this.msgError(res.info.Error.toString())
        }
      }).catch(err => {
        this.msgError(err.error.toString())
      })
    }
  }
}
</script>
