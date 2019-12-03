<template>
  <div v-loading="loading.wait" element-loading-text="Loading……">
    <div class="pwdSure_box">

      <div class="flex-bc selectType_box">

        <div class="selectType_content">
          <!-- <div class="selectType_keystore" id="keystore" data-view="keystore"> -->
            <!-- <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('PLACEHOLDER').ENTER_PASSWORD}}</h3>
            </hgroup> -->
            <div class="selectType_contentBox">
              <el-form ref="userInfoForm" :model="sureForm" label-width="120px" label-position="top">
                <el-form-item label="密码：">
                  <el-input type="password" v-model="sureForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="inputFileBtn">{{$t('BTN').YES_SURE}}</el-button>
                  <el-button @click="elDialogView">{{$t('BTN').CANCEL}}</el-button>
                </el-form-item>
              </el-form>
              <!-- <div class="selectType_contTnput">
                <input type="password" :placeholder="$t('PLACEHOLDER').ENTER_PASSWORD" class="input-text input" v-model="password">
              </div>
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputFileBtn" id="UnlockBtn">{{$t('BTN').UNLOCK}}</button>
              </div> -->
            </div>
          <!-- </div> -->
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
  name: "pwdSure",
  // props: ["sendDataPage"],
  props: {
    sendDataPage: {
      type: Object
    }
  },
  data () {
    return {
      sureForm: {},
      loading: {
        wait: false
      }
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    console.log(this.sendDataPage)
  },
  methods: {
    inputFileBtn () {
      let username = this.token
      this.loading.wait = true
      // console.log(username)
      if (!username) {
        this.$message({
          showClose: true,
          message: '登陆超时，请重新登陆！',
          type: 'error'
        })
        this.$$.quitApp(this)
        this.sureForm.password = ''
        this.loading.wait = false
      } else {
        let fileUrl = this.$$.config.file.ks.url + username + this.$$.config.file.ks.type
        this.$$.readFile(fileUrl)
          .then(res => {
            try{
              console.log(res)
              if (this.$$.wallet.walletRequirePass(res.info)) {
                let walletInfo = this.$$.wallet.getWalletFromPrivKeyFile(
                  res.info,
                  this.sureForm.password
                )
                this.toSign(walletInfo.getPrivateKeyString())
              } else {
                this.$message({
                  showClose: true,
                  message: 'Error',
                  type: 'error'
                })
              }
              // console.log(walletInfo.getPrivateKeyString())
            } catch (e) {
              console.log(e)
              this.elDialogView()
              this.$message({
                showClose: true,
                message: e.toString(),
                type: 'error'
              })
            }
          })
          .catch(err => {
            console.log(err)
            this.elDialogView()
            this.$message({
              showClose: true,
              message: err.toString(),
              type: 'error'
            })
          })
      }
    },
    toSign (pwd) {
      console.log(this.sendDataPage)
      // let type = Number(this.$$.getCookies(this.$$.config.cookies.safeMode))
      let type = 1
      this.$$.toSign(this.sendDataPage, pwd)
        .then(res => {
          this.loading.wait = false
          this.$emit("sendSignData", res)
        })
        .catch(err => {
          console.log(err)
          this.loading.wait = false
          this.$emit("sendSignData", {error: err})
          this.$message({
            showClose: true,
            message: err.toString(),
            type: 'error'
          })
        })
      this.sureForm.password = ''
    },
    elDialogView () {
      this.sureForm.password = ''
      this.loading.wait = false
      this.$emit("elDialogView")
    },
  }
}
</script>
