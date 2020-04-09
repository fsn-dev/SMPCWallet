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
            <!-- <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="loginObj.username" @input="validInfo('username')"></el-input>
            </el-form-item> -->


            <el-form-item>
              <div slot="label" class="flex-sc">
                <span class="color_red">* </span>
                {{$t('label').username}}
              </div>
              <!-- <el-input v-model="loginObj.username" @input="validInfo('username')"></el-input> -->
              <el-select
                class="WW100"
                v-model="loginObj.username"
                filterable
                remote
                reserve-keyword
                placeholder=""
                :remote-method="remoteMethod"
                :loading="loading.user"
                no-data-text="Null"
                :loading-text="$t('loading').l_1"
                @change="validInfo('username')"
              >
                <el-option
                  v-for="item in userlist"
                  :key="item.ks"
                  :label="item.name"
                  :value="item.ks">
                </el-option>
              </el-select>
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
export default {
  name: '',
  data () {
    return {
      loginObj: {},
      userlistInit:[],
      userlist:[],
      loading: {
        file: true,
        wait: false,
        user: false
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
    this.getAllUser()
  },
  methods: {
    ...headerImg,
    getAllUser () {
      this.$db.findAccount({}).then(res => {
        console.log(res)
        this.userlistInit = res
      })
    },
    remoteMethod (query)  {
      // console.log(query)
      this.loading.user = true
      if (query !== '') {
        this.userlist = this.userlistInit.filter(item => {
          return item.name.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        })
      } else {
        this.userlist = this.userlistInit
      }
      this.loading.user = false
    },
    validInfo (key) {
      // console.log(key)
      if (key) {
        this.loginObj[key] = this.loginObj[key] ? this.loginObj[key].toString().replace(/\s/g, '') : ''
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
      this.unlock(this.loginObj.username)
      // this.$db.findAccount({name: this.loginObj.username}).then(res => {
      //   console.log(res)
      //   if (res.length > 0) {
      //     let keystore = res[0].ks
      //     this.unlock(keystore)
      //   } else {
      //     this.msgError(this.$t('error').err_8)
      //     this.loading.wait = false
      //   }
      // })
    },
    unlock (keystore) {
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
          this.getHeaderImg(walletInfo.getPublicKeyString(), walletInfo.getChecksumAddressString(),this.loginObj.username)
          this.signEnode(pwd, address)
          this.$store.commit('setAddress', {info: address})
          this.$store.commit('setToken', {info: this.loginObj.username})
          this.$router.push('/account')
        } else {
          this.msgError('Error')
          this.loading.wait = false
        }
      } catch (error) {
        console.log(error)
        this.msgError(error.toString())
        this.loading.wait = false
      }
    },
    async getHeaderImg (hex, address, name) {
      this.$db.findHeaderImg({address: address}).then(res => {
        // console.log(res)
        if (res.length <= 0) {
          this.createHeader(hex, address, name)
        }
      })
    },
    async signEnode (pwd, address) {
      let eNodeKey = this.$$.eNodeCut(this.eNode).key
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