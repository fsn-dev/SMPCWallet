<template>
  <div class="boxConntent1 container" v-loading="loading.creat" element-loading-text="账户建立中……">
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
          <div class="flex-sc">
            <span class="color_green" v-if="eNode.value && $$.getEnodeState(eNode.value).Status === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>在线</span>
            <span class="color_red" v-if="eNode.value && $$.getEnodeState(eNode.value).Status !== 'OnLine'"><i class="el-icon-circle-close mr-5"></i>离线</span>
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
      loading: {
        creat: false
      },
      dataPage: {},
      groupForm: {
        mode: '3/3',
        eNode: [
          {
            value: this.$$.getEnode()
          },
          {
            value: 'enode://0129d164529f8806aa584cea39bbc2465f30dfbe3f223f80f9d489f77f8adddcb8e2f93abd7dd58f74bf4e16b1946960ce8187dc7e0931177eb8fdd2835c7f14@127.0.0.1:12342'
          },
          {
            value: 'enode://2c33f740deea9110359741f3da41612a81c156e7e19cc1e805d274642ad07f85226aa1741ea629978e0b9d9c3b86d6cc8b6b5ffc065392a9a1a28aa65a36175a@127.0.0.1:12343'
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
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
    },
    getSignData (data) {
      console.log(data)
      this.modalClick()
      this.loading.creat = true
      this.createGroup()
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
          this.openPwdDialog()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async createGroup () {
      let eNode = this.$$.getEnode()
      let arr = []
      for (let obj of this.groupForm.eNode) {
        arr.push(obj.value)
      }
      this.$$.createGroup(this.groupForm.name, this.groupForm.mode, arr).then(res => {
        let gInfo = res.info
        console.log(gInfo)
        if (gInfo && !gInfo.Error) {
          this.$message({ message: 'Create group success!', type: 'success' })
          this.toUrl('/group')
        } else {
          let error = gInfo.Error.toString()
          this.$message.error(error)
        }
        this.loading.creat = false
      }).catch(err => {
        this.$message.error(error)
        this.loading.creat = false
      })
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