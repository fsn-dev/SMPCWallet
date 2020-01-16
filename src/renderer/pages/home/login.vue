<template>
  <div class="flex-c bg"  v-loading="loading.wait" element-loading-text="Loading……">
    <div class="user-form-box">
      <div class="user-form-title">
        <logo></logo>
        <router-link to="/" class="back"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</router-link>
        <h3 class="title">{{$t('title').login}}</h3>
      </div>

      <div class="user-form-input">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :model="loginObj" :rules="rules" label-width="120px" label-position="top" @submit.native.prevent>
            <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="loginObj.username" @input="validInfo('username')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('label').password" prop="password">
              <el-input type="password" v-model="loginObj.password" @input="validInfo('password')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="submitForm('userInfoForm')" :disabled="loading.file" class="btn mt-30 btn-primary">{{$t('btn').login}}</el-button>
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
import headerImg from './js/headerImg'
import {findAccount} from '@/db/accounts'
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
    // let eNodeKey = this.eNode.match(/enode:\/\/(\S*)@/)
    // console.log(eNodeKey)
    // findAccount({}).then(res => {
    //   console.log(res)
    // })
    // insertAccount({
    //   name: 'test',
    //   ks: '123',
    //   timestamp: Date.now()
    // }).then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    ...headerImg,
    validInfo (key) {
      if (key) {
        this.loginObj[key] = this.loginObj[key].toString().replace(/\s/g, '')
      }
      if (this.loginObj.username && this.loginObj.username.length >= 3 && this.loginObj.password && this.loginObj.password.length > 5) {
        this.loading.file = false
      } else {
        this.loading.file = true
      }
    },
    submitForm(formName) {
      if (this.loading.file) return
      if (!this.eNode) {
        this.msgError(this.$t('error').err_10)
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading.wait = true
          setTimeout(() => {
            // this.validForm()
            this.inputFileBtn()
          }, 300)
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    inputFileBtn () {
      findAccount({name: this.loginObj.username}).then(res => {
        console.log(res)
        if (res.length > 0) {
          let keystore = res[0].ks
          try {
            if (this.$$.walletRequirePass(keystore)) {
              const walletInfo = this.$$.getWalletFromPrivKeyFile(
                keystore,
                this.loginObj.password
              )
              let address = walletInfo.getChecksumAddressString()
              let pwd = walletInfo.getPrivateKeyString()
              // this.createHeader(this.walletInfo.getPublicKeyString(), address)
              // console.log(address)
              // console.log(walletInfo.getPrivateKeyString())
              if (!this.eNode) {
                this.msgError(this.$t('error').err_10)
                return
              }
              this.signEnode(pwd, address)
              this.$store.commit('setAddress', {info: address})
              this.$store.commit('setToken', {info: this.loginObj.username})
              this.$store.commit('setWallet', {info: pwd})
              // return
              if (Number(this.safeMode)) {
                this.$router.push('/person')
              } else {
                this.$router.push('/group')
              }
            } else {
              this.msgError('Error')
              this.loading.wait = false
            }
          } catch (error) {
            console.log(error)
            this.msgError(error.toString())
            this.loading.wait = false
          }
        } else {
          this.msgError(this.$t('error').err_8)
          this.loading.wait = false
        }
      })
    },
    signEnode (pwd, address) {
      let eNodeKey = this.eNode.match(/enode:\/\/(\S*)@/)[1]
      // console.log(eNodeKey)
      let rawTx = {
        from: address,
        data: eNodeKey
      }
      // console.log(rawTx)
      this.$$.toSign(rawTx, pwd).then(res => {
        // console.log(res)
        this.$store.commit('setEnodeTx', {info: res.signTx})
      }).catch(err => {
        console.log(err)
        this.msgError(err.toString())
      })
    }
  }
}
</script>