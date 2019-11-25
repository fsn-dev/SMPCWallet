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
            <el-input v-model="eNode.value" @blur="changeState(eNode, index)"></el-input>
            <el-button @click.prevent="removeDomain(eNode)" class="ml-10" v-if="Number(index) !== 0">删除</el-button>
          </div>
          <div class="flex-sc" v-if="reload">
            <span class="color_green" v-if="eNode.state === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>在线</span>
            <span class="color_red" v-if="eNode.state === 'OffLine'"><i class="el-icon-circle-close mr-5"></i>离线</span>
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
      reload: true,
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
          { value: this.$$.eNode },
          // { value: 'enode://52140e582170c0f9b45aed6d12c0dbe6394eaf52b8f74f7e1d509c2f38c5efeb94ec2678216f5f29e13ae9e0aff920dcb8c0ce85b0397e2efb5de61e4f91ddf7@127.0.0.1:12342' },
          // { value: 'enode://85d920b1fe3a515c3af5f78794c13c686a684515216cffcf379df6839706ad7209589238050608dd27e47500ec6c384f66848f25a82de4cb7e5b228a8a2a30ec@127.0.0.1:12343' },
          { value: 'enode://e84133c51e96cd9d604ccd3627fa0c07262b827390d8a97a516a14193e3b50a9763ef0169a4f198f9ea203e7af66d067d30a7ea15c708cf0c618e709e368a057@127.0.0.1:12342' },
          { value: 'enode://1f9141662d5da3dc8c62dab372db2b682de194a42fe341f4b9ea6e89804129cbdf11a53a882e77c8139390f8ac2a485fcdbc9231ae3f9f130af2552ac7196235@127.0.0.1:12343' },
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
    changeState (item, index) {
      this.groupForm.eNode[index].state = this.$$.getEnodeState(item.value)
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
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
      let arr = []
      for (let obj of this.groupForm.eNode) {
        arr.push(obj.value)
      }
      this.$$.createGroup(this.groupForm.name, this.groupForm.mode, arr).then(res => {
        let gInfo = res
        console.log(gInfo)
        if (gInfo.msg === 'Success') {
          this.$message({ message: 'Create group success!', type: 'success' })
          this.toUrl('/group')
        } else {
          let error = gInfo.info.toString()
          this.$message.error(error)
        }
        this.loading.creat = false
      }).catch(err => {
        this.$message.error(err)
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