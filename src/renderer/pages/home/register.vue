<template>
  <div class="flex-c bg" v-loading="loading.wait" element-loading-text="Loading……">
    <div class="user-form-box">

      <div class="user-form-title">
        <div class="logo flex-sc">
          <img src="@etc/img/logo/logo.svg">
          <p class="appTitle ml-10" v-html="$t('title').walletTitle"></p>
        </div>
        <router-link to="/" class="back">&lt;{{$t('btn').back}}</router-link>
        <h3 class="title">{{$t('title').register}}</h3>
      </div>

      <div class="user-form-input">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :rules="rules" :model="registerObj" label-width="120px" label-position="top">
            <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="registerObj.username" @input="validInfo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password" prop="newpwd">
              <el-input type="password" v-model="registerObj.password" @input="validInfo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password2" prop="renewpwd">
              <el-input type="password" v-model="registerObj.password2" @input="validInfo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userInfoForm')" :disabled="loading.file" class="btn mt-30 btn-primary">{{$t('btn').create}}</el-button>
              <!-- <el-button type="primary" @click="changePwd">test</el-button> -->
              <!-- <el-button @click="toUrl('/')">{{$t('BTN').CANCEL}}</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>

<script>
import regExp from '@etc/js/config/RegExp'
import headerImg from './headerImg'
export default {
  name: '',
  data () {
    const validatePass = (rule, value, callback) => {
      if (this.registerObj.password) {
        if (!regExp.pwd.test(this.registerObj.password)) {
          callback(new Error(this.$t('error').err_4))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('error').err_3))
      }
      this.validInfo()
    };
    const validatePass2 = (rule, value, callback) => {
      if (!this.registerObj.password2) {
        callback(new Error(this.$t('error').err_5))
      } else if (this.registerObj.password2 !== this.registerObj.password) {
        callback(new Error(this.$t('error').err_6))
      } else {
        callback()
      }
      this.validInfo()
    }
    return {
      registerObj: {},
      loading: {
        file: true,
        wait: false
      },
      rules: {
        username: [
          { required: true, message: this.$t('error').err_1, trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('error').err_2, trigger: 'blur' }
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
    // console.log(headerImg)
  },
  methods: {
    ...headerImg,
    validInfo () {
      if (this.registerObj.username && this.registerObj.password && this.registerObj.password2 && (this.registerObj.password === this.registerObj.password2)) {
        this.loading.file = false
      } else {
        this.loading.file = true
      }
    },
    submitForm(formName) {
      if (this.loading.file) return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading.wait = true
          setTimeout(() => {
            this.changePwd()
          }, 300)
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    createFile () {
      const walletInit = this.$$.wallet.generate(this.registerObj.password)
      let walletJSON = walletInit.toV3(this.registerObj.password, { kdf: "scrypt", n: 8192 })
      let fileUrl = this.$$.config.file.ks.url + this.registerObj.username + this.$$.config.file.ks.type
      this.$$.fs.writeFile(fileUrl, JSON.stringify(walletJSON), (err, res) => {
        if (err) {
          console.log(err)
          this.msgError(err.toString())
        } else {
          this.msgSuccess(this.$t('success').s_1)
          this.createHeader(walletInit.getPublicKeyString(), walletInit.getAddressString())
        }
        this.registerObj = {}
        this.loading.wait = false
        this.toUrl('/')
      })
    },
    changePwd () {
      let fileUrl = this.$$.config.file.ks.url
      this.$$.validFile(this.registerObj.username, fileUrl, this.$$.config.file.ks.type)
      .then(res => {
        if (res.msg === 'Repeat') {
          this.msgError(this.$t('error').err_7)
          this.loading.wait = false
        } else {
          this.createFile()
        }
      })
      .catch(err => {
        this.msgError(err.error)
        this.loading.wait = false
      })
    }
  }
}
</script>