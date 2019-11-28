<template>
  <div class="flex-c bg">
    <div class="user-form-box">
      <div class="user-form-title">
        <div class="logo flex-sc">
          <img src="@etc/img/logo/logo.svg">
          <p class="appTitle ml-10"><span>SMPC</span>Wallet</p>
        </div>
        <router-link to="/" class="back">&lt;返回</router-link>
        <h3 class="title">登陆账户</h3>
      </div>

      <div class="user-form-input" v-loading="loading.file">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :model="loginObj" label-width="120px" label-position="top">
            <el-form-item label="用户名：">
              <el-input v-model="loginObj.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
              <el-input type="password" v-model="loginObj.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" :disabled="loading.file" class="btn mt-30">登陆</el-button>
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
export default {
  name: '',
  data () {
    return {
      loginObj: {},
      loading: {
        file: false
      },
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    
  },
  methods: {
    submitForm () {
      this.$$.validFile(this.loginObj.username, this.$$.config.file.ks.url, this.$$.config.file.ks.type)
      .then(res => {
        if (res.msg === 'Repeat') {
          this.inputFileBtn()
        } else {
          this.$message.error('账户不存在')
        }
      })
      .catch(err => {
        console.log(err)
        this.$message.error(err.error.toString())
      })
    },
    inputFileBtn () {
      let fileUrl = this.$$.config.file.ks.url + this.loginObj.username + this.$$.config.file.ks.type
      // console.log(fileUrl)
      this.$$.readFile(fileUrl)
        .then(res => {
          try{
            if (this.$$.wallet.walletRequirePass(res.info)) {
              this.walletInfo = this.$$.wallet.getWalletFromPrivKeyFile(
                res.info,
                this.loginObj.password
              )
              let address = this.walletInfo.getChecksumAddressString()
              // this.$$.setToken(this.loginObj.username)
              // this.$$.setCookies(this.$$.config.cookies.address, address)
              this.$store.commit('setAddress', {info: address})
              this.$store.commit('setToken', {info: this.loginObj.username})
              this.$store.commit('setWallet', this.walletInfo)
              if (Number(this.safeMode)) {
                this.$router.push('/person')
              } else {
                this.$router.push('/group')
              }
            } else {
              this.$message.error('Error')
            }
          } catch (e) {
            console.log(e)
            this.$message.error(e.toString())
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error(err.error.toString())
        })
    },
  }
}
</script>