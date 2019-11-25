<template>
  <div class="flex-c bg">
    <div class="register_box">
      <div class="register_title flex-c">
        <h3 class="title">{{$t('IMPORT_WALLET')}}</h3>
      </div>

      <div class="createInfo_box" v-loading="loading.file">
        <div class="W300" style="margin:auto;">
          <el-form ref="userInfoForm" :model="loginObj" label-width="120px" label-position="top">
            <el-form-item label="用户名：">
              <el-input v-model="loginObj.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
              <el-input type="password" v-model="loginObj.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" :disabled="loading.file">{{$t('BTN').YES_SURE}}</el-button>
              <!-- <el-button type="primary" @click="changePwd">test</el-button> -->
              <el-button @click="toUrl('/')">{{$t('BTN').CANCEL}}</el-button>
            </el-form-item>
          </el-form>
        </div>
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

      <!-- <div class="createInfo_tip pb-20">
        <h3 class="h3" v-html="$t('IMPORT_WALLET_TIP')" > </h3>
      </div> -->
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