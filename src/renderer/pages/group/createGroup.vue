<template>
  <div class="boxConntent1 container">
    <div class="c-form-box">
      <el-form :model="groupForm" ref="groupForm" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="账户名" prop="name">
          <el-input v-model="groupForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模式">
          <el-select v-model="groupForm.mode" placeholder="请选择模式" class="WW100">
            <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(eNode, index) in groupForm.eNode"
          :label="'用户' + index"
          :key="eNode.key"
          :prop="'eNode.' + index + '.value'"
          :rules="{
            required: true, message: '用户不能为空', trigger: 'blur'
          }"
        >
          <div class="flex-bc">
            <el-input v-model="eNode.value"></el-input>
            <el-button @click.prevent="removeDomain(eNode)" class="ml-10" v-if="Number(index) !== 0">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('groupForm')">提交</el-button>
          <el-button @click="addDomain">新增用户</el-button>
          <el-button @click="resetForm('groupForm')">重置</el-button>
          <el-button @click="toUrl('/group')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="$t('BTN').UNLOCK" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick">
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/index';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      eDialog: {
        pwd: false
      },
      dataPage: {},
      groupForm: {
        mode: '3/3',
        eNode: [
          {
            value: 'enode://5a7e7e449806cb67d412c92cfd3d0ea9cee109f494244c5c4e7cfda00142ae1c4c16f40d104b4b22b62e31827450a708ff281bafaaa58d624e227c81aab65c3c@127.0.0.1:12341'
          },
          {
            value: 'enode://e84133c51e96cd9d604ccd3627fa0c07262b827390d8a97a516a14193e3b50a9763ef0169a4f198f9ea203e7af66d067d30a7ea15c708cf0c618e709e368a057@127.0.0.1:12342'
          },
          {
            value: 'enode://1f9141662d5da3dc8c62dab372db2b682de194a42fe341f4b9ea6e89804129cbdf11a53a882e77c8139390f8ac2a485fcdbc9231ae3f9f130af2552ac7196235@127.0.0.1:12343'
          },
        ],
        name: ''
      },
      modeArr: this.$$.mode,
      rules: {
        name: [
          { required: true, message: '请输入公共账户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    // console.log(mode)
    this.$$.getGroup()
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
    },
    getSignData (data) {
      console.log(data)
      this.createGroup()
      this.eDialog.pwd = false
    },
    openPwdDialog () {
      try {
        // let nonce = this.$$.getNonce(this.address, 'ALL')
        let nonce = 0
        if (!isNaN(nonce)) {
          this.dataPage = {
            from: this.address,
            to: this.$$.config.rawTx.to,
            gasLimit: this.$$.config.rawTx.gasLimit,
            gasPrice: this.$$.config.rawTx.gasPrice,
            nonce: nonce
          }
          this.eDialog.pwd = true
          // this.dataPage = this.$$.config.rawTx
          // this.dataPage.from = this.$$.getCookies(this.$$.config.cookies.address)
          console.log(this.dataPage)
        } else {
          console.log(nonce)
          this.$message.error(nonce)
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error.toString())
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.createGroup()
          this.openPwdDialog()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    createGroup () {
      // let eNode = this.$$.web3.dcrm.getEnode()
      let eNode = this.$$.getEnode()
      // let arr = [this.$$.getEnode()]
      let arr = []
      for (let obj of this.groupForm.eNode) {
        arr.push(obj.value)
      }
      try {
        let gInfo = this.$$.createGroup(this.groupForm.name, this.groupForm.mode, arr)
        if (gInfo && !gInfo.Error) {
          this.$message({ message: 'Create group success!', type: 'success' })
          this.toUrl('/group')
        } else {
          console.log(gInfo)
          let error = gInfo.Error.toString()
          this.$message.error('123')
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      }
    },
    resetForm(formName) {
      this.groupForm = {
        mode: '3/3',
        eNode: [
          { value: '' },
        ],
        name: ''
      }
    },
    removeDomain(item) {
      var index = this.groupForm.eNode.indexOf(item)
      if (index > 0) {
        this.groupForm.eNode.splice(index, 1)
      }
    },
    addDomain() {
      this.groupForm.eNode.push({
        value: '',
        key: Date.now()
      });
    }
  }
}
</script>