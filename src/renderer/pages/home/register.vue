<template>
  <div class="flex-c bg" v-loading="loading.wait" element-loading-text="Loading……">
    <div class="user-form-box">

      <div class="user-form-title">
        <logo></logo>
        <router-link to="/" class="back"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</router-link>
        <h3 class="title">{{$t('title').register}}</h3>
      </div>

      <div class="user-form-input c-form-box-sm">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :rules="rules" :model="registerObj" label-width="120px" label-position="top" @submit.native.prevent>
            <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="registerObj.username" @input="validInfo('username')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').email" prop="email" v-if="networkMode && $$.config.isOpenEmail">
              <el-input v-model="registerObj.email" @input="validInfo('email')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').emailValid" prop="emailCode" v-if="networkMode && $$.config.isOpenEmail">
              <div class="flex-bc">
                <el-input v-model="registerObj.emailCode" @input="validInfo('emailCode')"></el-input>
                <el-button type="primary" @click="reqEmailCode" class="ml-10" :loading="loading.code" v-if="!count.start">{{$t('btn').sendEmail}}</el-button>
                <el-button disabled type="default" class="ml-10 W110" v-else>{{count.second}} s</el-button>
              </div>
            </el-form-item>
            <el-form-item :label="$t('label').password" prop="newpwd">
              <el-input type="password" v-model="registerObj.password" @input="validInfo('password')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password2" prop="renewpwd">
              <el-input type="password" v-model="registerObj.password2" @input="validInfo('password2')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="submitForm('userInfoForm')" :disabled="loading.file" class="btn mt-30 btn-primary">{{$t('btn').create}}</el-button>
              <!-- <el-button type="primary" native-type="submit" @click="createFile"  class="btn mt-30 btn-primary">{{$t('btn').create}}</el-button> -->
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
import {computedPub} from '@/assets/js/pages/public'
import regExp from '@/assets/js/config/RegExp.js'
import headerImg from './js/headerImg'
export default {
  name: '',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (this.registerObj.username) {
        if (!regExp.username.test(this.registerObj.username)) {
          callback(new Error(this.$t('error').err_2))
        } else {
          callback()
        }
      } else {
        callback(new Error(this.$t('error').err_1))
      }
      this.validInfo()
    }
    const validateEmail = (rule, value, callback) => {
      if (this.networkMode && this.$$.config.isOpenEmail) {
        if (this.registerObj.email) {
          if (!regExp.email.test(this.registerObj.email)) {
            callback(new Error(this.$t('warn').w_18))
          } else {
            callback()
          }
        } else {
          callback(new Error(this.$t('warn').w_23))
        }
      } else {
        callback()
      }
      this.validInfo()
    }
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
    }
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
        wait: false,
        code: false
      },
      count: {
        start: 0,
        second: 0,
        interval: ''
      },
      insertDBdata: {},
      walletInit: '',
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        emailCode: [
          { required: true, message: this.$t('warn').w_24, trigger: 'blur' },
          // { min: 6, max: 6, message: this.$t('warn').w_24, trigger: 'blur' }
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
  computed: {
    ...computedPub,
  },
  sockets: {
    GetUserIsRepeat (res) {
      if (res.info > 0) {
        this.msgError(this.$t('error').err_7)
        this.loading.wait = false
      } else {
        this.findLocalAccount()
      }
    },
    UserInfoAdd (res) {
      console.log(res)
      if (res.msg === 'Success') {
        this.insertLocalAccount()
      } else {
        this.msgError(res.error)
        this.loading.wait = false
      }
    },
    EmailValidRegister (res) {
      console.log(res)
      if (res.msg === 'Success') {
        this.count.second = 60
        this.countFn()
        this.msgSuccess(this.$t('success').s_9)
      } else {
        this.msgError(this.$t('error').err_16)
      }
      this.loading.code = false
    }
  },
  mounted () {
    // console.log(this.$$.config.isOpenEmail)
  },
  methods: {
    ...headerImg,
    reqEmailCode () {
      if (!this.registerObj.email) {
        this.msgWarning(this.$t('warn').w_23)
        return
      }
      if (!regExp.email.test(this.registerObj.email)) {
        this.msgWarning(this.$t('warn').w_18)
        return
      }
      this.loading.code = true
      this.$socket.emit('EmailValidRegister', {
        email: this.registerObj.email
      })
    },
    countFn () {
      clearInterval(this.count.interval)
      this.count.start = Date.now()
      this.count.interval = setInterval(() => {
        let num = Date.now() - this.count.start
        if (num > 1000 * 60) {
          this.count.second = 0
          this.count.start = 0
          clearInterval(this.count.interval)
        } else {
          this.count.second = 60 - parseInt(num / 1000)
        }
      }, 300)
    },
    validInfo (key) {
      if (key) {
        this.registerObj[key] = this.registerObj[key].toString().replace(/\s/g, '')
      }
      if (
        this.registerObj.username && 
        regExp.username.test(this.registerObj.username) &&
        this.registerObj.password && 
        regExp.pwd.test(this.registerObj.password) && 
        this.registerObj.password2 && 
        regExp.pwd.test(this.registerObj.password2) && 
        (this.registerObj.password === this.registerObj.password2)
      ) {
        if (this.networkMode && this.$$.config.isOpenEmail) {
          if (
            this.registerObj.email && 
            regExp.email.test(this.registerObj.email) && 
            this.registerObj.emailCode && 
            this.registerObj.emailCode.length === 6
          ) {
            this.loading.file = false
          } else  {
            this.loading.file = true
          }
        } else {
          this.loading.file = false
        }
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
      this.walletInit = this.$$.wallet.generate(this.registerObj.password)
      let walletJSON = this.walletInit.toV3(this.registerObj.password, { kdf: "scrypt", n: 8192 })
      walletJSON = JSON.stringify(walletJSON)
      this.insertDBdata = {
        username: this.registerObj.username,
        address: this.walletInit.getChecksumAddressString(),
        password: this.cutPwd(this.registerObj.username, this.registerObj.password),
        ks: walletJSON,
        code: this.registerObj.emailCode,
        email: this.registerObj.email,
        isOpenEmail: this.$$.config.isOpenEmail
      }
      if (this.networkMode) {
        this.$socket.emit('UserInfoAdd', this.insertDBdata)
      } else {
        this.insertLocalAccount()
      }
    },
    insertLocalAccount () {
      this.$db.insertAccount(this.insertDBdata).then(res => {
        console.log(res)
        this.msgSuccess(this.$t('success').s_1)
        this.createHeader(
          this.walletInit.getPublicKeyString(),
          this.insertDBdata.address,
          this.registerObj.username
        )
        this.registerObj = {}
        this.walletInit = null
        this.insertDBdata = {}
        this.loading.wait = false
        this.toUrl('/')
      }).catch(err => {
        console.log(err)
      })
    },
    findLocalAccount () {
      this.$db.findAccount({username: this.registerObj.username}).then(res => {
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
    },
    cutPwd (name, pwd) {
      pwd = pwd.toString()
      return pwd.substr(0,1) + name + pwd.substr(pwd.length - 2, 1)
    },
    changePwd () {
      if (this.networkMode) {
        this.$socket.emit('GetUserIsRepeat', {
          username: this.registerObj.username
        })
      } else {
        this.findLocalAccount()
      }
    }
  }
}
</script>