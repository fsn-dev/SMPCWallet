<template>
  <div>
    <div class="newwallet_box">

      <div class="newWallet_title flex-c">
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

      <div class="createInfo_tip pb-20">
        <h3 class="h3" v-html="$t('IMPORT_WALLET_TIP')" > </h3>
      </div>


    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: "importWallet",
  data () {
    return {
      loginObj: {},
      loading: {
        file: false
      },
    }
  },
  mounted () {
    // this.$$.readFile('fsn')
    // console.log(this.$$.web3)
    // console.log(this.$$.web3.isConnected())
    let pub = this.$$.web3.dcrm.genPubkey()
    console.log(pub)
    // let sign = this.$$.web3.dcrm.sign(pub.pubkey, '0x19b6236d2e7eb3e925d0c6e8850502c1f04822eb9aa67cb92e5004f7017e5e41')
    // console.log(sign)
  },
  methods: {
    goHome () {
      this.$router.push("/")
    },
    submitForm () {
      this.$$.validFile(this.loginObj.username)
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
      this.$$.readFile(this.loginObj.username)
      .then(res => {
        try{
          this.walletInfo = this.$$.wallet.getWalletFromPrivKeyFile(
            res.info,
            this.loginObj.password
          )
          let address = this.walletInfo.getChecksumAddressString()
          this.$$.setToken(this.loginObj.username)
          this.$$.setCookies('address', address)
          this.$store.commit('storeAddress', address)
          this.$router.push('/myAssets')
        } catch (e) {
          this.$message.error(e.toString())
        }
      })
      .catch(err => {
        this.$message.error(err.error.toString())
      })
    },
  }
}
</script>
