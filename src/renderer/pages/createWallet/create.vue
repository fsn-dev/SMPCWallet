<template>
  <div>
    <div class="newwallet_box">

      <div class="newWallet_title flex-c">
        <h3 class="title">{{$t('TITLE').CREATE_NEW_WALLET}}</h3>
      </div>

      <div class="createInfo_box" v-loading="loading.file">
        <div class="W300" style="margin:auto;">
          <el-form ref="userInfoForm" :rules="rules" :model="registerObj" label-width="120px" label-position="top">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="registerObj.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="newpwd">
              <el-input type="password" v-model="registerObj.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="renewpwd">
              <el-input type="password" v-model="registerObj.password2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userInfoForm')" :disabled="loading.file">{{$t('BTN').YES_SURE}}</el-button>
              <!-- <el-button type="primary" @click="changePwd">test</el-button> -->
              <el-button @click="goHome">{{$t('BTN').CANCEL}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <hgroup class="createInfo_tip">
          <h1 class="h1">{{$t('CREATE_TIP').CREATE_TIP_0}}</h1>
          <h2 class="h2">{{$t('CREATE_TIP').CREATE_TIP_1}}</h2>
          <h3 class="h3">
            {{$t('CREATE_TIP').CREATE_TIP_2}}
            <br/>
            {{$t('CREATE_TIP').CREATE_TIP_3}}
          </h3>
        </hgroup>
      </div>

    </div>
  </div>
</template>

<style>

</style>

<script>
import regExp from '@etc/js/config/RegExp'
export default {
  name: "createWallet",
  data () {
    const validatePass = (rule, value, callback) => {
      if (this.registerObj.password) {
        if (!regExp.pwd.test(this.registerObj.password)) {
          callback(new Error('密码只能输入6-20个字母、数字、下划线'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入密码'))
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (!this.registerObj.password2) {
        callback(new Error('请再次输入密码'))
      } else if (this.registerObj.password2 !== this.registerObj.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerObj: {},
      loading: {
        file: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        newpwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        renewpwd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
    }
  },
  mounted () {
  },
  methods: {
    submitForm(formName) {
      if (this.loading.file) return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading.file = true
          this.changePwd()
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    goHome () {
      this.$router.push("/")
    },
    createFile () {
      const walletInit = this.$$.wallet.generate(this.registerObj.password)
      let walletJSON = walletInit.toV3(this.registerObj.password, { kdf: "scrypt", n: 8192 })
      this.$$.fs.writeFile(this.$$.config.baseFileUrl + '/' + this.registerObj.username + '.json', JSON.stringify(walletJSON), (err, res) => {
        if (err) {
          this.$message.error(err.toString())
        } else {
          this.$message({
            message: '创建成功！',
            type: 'success'
          })
        }
        this.registerObj = {}
        this.loading.file = false
        this.goHome()
      })
    },
    changePwd () {
      this.$$.validFile(this.registerObj.username)
      .then(res => {
        if (res.msg === 'Repeat') {
          this.$message.error('账户已存在')
        } else {
          this.createFile()
        }
      })
      .catch(err => {
        this.$message.error(err.error)
      })
    }
  }
}
</script>
