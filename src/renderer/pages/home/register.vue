<template>
  <div class="flex-c bg" v-loading="loading.wait" element-loading-text="Loading……">
    <div class="user-form-box">

      <div class="user-form-title">
        <logo></logo>
        <router-link to="/" class="back"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</router-link>
        <h3 class="title">{{$t('title').register}}</h3>
      </div>

      <div class="user-form-input">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :rules="rules" :model="registerObj" label-width="120px" label-position="top" @submit.native.prevent>
            <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="registerObj.username" @input="validInfo('username')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password" prop="newpwd">
              <el-input type="password" v-model="registerObj.password" @input="validInfo('password')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password2" prop="renewpwd">
              <el-input type="password" v-model="registerObj.password2" @input="validInfo('password2')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="submitForm('userInfoForm')" :disabled="loading.file" class="btn mt-30 btn-primary">{{$t('btn').create}}</el-button>
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
import headerImg from './js/headerImg'
import {insertAccount, findAccount} from '@/db/accounts'
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
    validInfo (key) {
      if (key) {
        this.registerObj[key] = this.registerObj[key].toString().replace(/\s/g, '')
      }
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
      insertAccount({
        name: this.registerObj.username,
        ks: JSON.stringify(walletJSON)
      }).then(res => {
        console.log(res)
        this.msgSuccess(this.$t('success').s_1)
        this.createHeader(
          walletInit.getPublicKeyString(),
          walletInit.getChecksumAddressString(),
          this.registerObj.username
        )
        this.registerObj = {}
        this.loading.wait = false
        this.toUrl('/')
      }).catch(err => {
        this.msgError(err.error)
        this.loading.wait = false
      })
    },
    changePwd () {
      findAccount({name: this.registerObj.username}).then(res => {
        console.log(res)
        if (res.length > 0) {
          this.msgError(this.$t('error').err_7)
          this.loading.wait = false
        } else {
          this.createFile()
        }
      }).catch(err => {
        this.msgError(err.error)
        this.loading.wait = false
      })
    }
  }
}
</script>