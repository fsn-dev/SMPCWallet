<template>
  <div class="flex-c bg"  v-loading="loading.wait" element-loading-text="Loading……">
    <div class="user-form-box">
      <div class="user-form-title">
        <div class="logo flex-sc">
          <img src="@etc/img/logo/logo.svg">
          <p class="appTitle ml-10" v-html="$t('title').walletTitle"></p>
        </div>
        <router-link to="/" class="back">&lt;{{$t('btn').back}}</router-link>
        <h3 class="title">{{$t('title').login}}</h3>
      </div>

      <div class="user-form-input">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :model="loginObj" :rules="rules" label-width="120px" label-position="top">
            <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="loginObj.username" @input="validInfo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password" prop="password">
              <el-input type="password" v-model="loginObj.password" @input="validInfo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('userInfoForm')" :disabled="loading.file" class="btn mt-30 btn-primary">{{$t('btn').login}}</el-button>
              <!-- <el-button type="primary" @click="changePwd">test</el-button> -->
              <!-- <el-button @click="toUrl('/')">{{$t('BTN').CANCEL}}</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>

    </div>
    
  </div>
</template>

<style>

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import headerImg from './headerImg'
export default {
  name: '',
  data () {
    return {
      loginObj: {},
      loading: {
        file: true,
        wait: false
      },
      rules: {
        username: [
          { required: true, message: this.$t('error').err_1, trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('error').err_2, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('error').err_3, trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('error').err_4, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    
  },
  methods: {
    ...headerImg,
    validInfo () {
      if (this.loginObj.username && this.loginObj.username.length >= 3 && this.loginObj.password && this.loginObj.password.length > 5) {
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
            this.validForm()
          }, 300)
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    validForm () {
      this.loading.wait = true
      this.$$.validFile(this.loginObj.username, this.$$.config.file.ks.url, this.$$.config.file.ks.type)
      .then(res => {
        console.log(res)
        if (res.msg === 'Repeat') {
          this.inputFileBtn()
        } else {
          this.$message({
            showClose: true,
            message: this.$t('error').err_8,
            type: 'error',
            customClass:'mzindex'
          })
          this.loading.wait = false
        }
      })
      .catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          message: err.error.toString(),
          type: 'error',
          customClass:'mzindex'
        })
        this.loading.wait = false
      })
    },
    inputFileBtn () {
      let fileUrl = this.$$.config.file.ks.url + this.loginObj.username + this.$$.config.file.ks.type
      // console.log(fileUrl)
      this.$$.readFile(fileUrl).then(res => {
        console.log(res)
        try{
          if (this.$$.wallet.walletRequirePass(res.info)) {
            this.walletInfo = this.$$.wallet.getWalletFromPrivKeyFile(
              res.info,
              this.loginObj.password
            )
            let address = this.walletInfo.getChecksumAddressString()
            this.createHeader(this.walletInfo.getPublicKeyString(), address)
            this.$store.commit('setAddress', {info: address})
            this.$store.commit('setToken', {info: this.loginObj.username})
            this.$store.commit('setWallet', {info: this.walletInfo.getPrivateKeyString()})
            if (Number(this.safeMode)) {
              this.$router.push('/person')
            } else {
              this.$router.push('/group')
            }
          } else {
            this.$message({
              showClose: true,
              message: 'Error',
              type: 'error',
              customClass:'mzindex'
            })
            this.loading.wait = false
          }
        } catch (e) {
          console.log(e)
          this.$message({
            showClose: true,
            message: e.toString(),
            type: 'error',
            customClass:'mzindex'
          })
          this.loading.wait = false
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          message: err.error.toString(),
          type: 'error',
          customClass:'mzindex'
        })
        this.loading.wait = false
      })
    },
  }
}
</script>