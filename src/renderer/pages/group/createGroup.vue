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
            value: 'enode://d9d6003cd6ee3495e3ad3ff445c514c26919ee83158b9e99a3eb7848517a91352c2a942af0e8bdc6998d90a23ccad6c20ede555961e92f554e81b5de846528b9@127.0.0.1:12341'
          },
          {
            value: 'enode://9ff640ebac7bed2f3d630d00f3b07f2433ee250cd0518b3402d0316757ddb5500698e95b2b2dc35b307798568a13cbb4b5f1737e2ad8efec6a909ddcd09c0306@127.0.0.1:12342'
          },
          {
            value: 'enode://c21cd4377dbe6fc3c93bfaa7de101c5339a650921ffab40ffa408abd1d1a67caae54f7b3b0f997735e3401dc5f1b6f60793de88e94bf09c8569f7db3c67849b0@127.0.0.1:12343'
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
      this.createGroup()
      this.eDialog.pwd = false
    },
    openPwdDialog () {
      try {
        let nonce = this.$$.getNonce(this.address, 'ALL')
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
          this.$message.error(nonce)
        }
      } catch (error) {
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
      let eNode = this.$$.web3.dcrm.getEnode()
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
          this.$message.error(gInfo.Error)
        }
      } catch (error) {
        console.log(error)
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