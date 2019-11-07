<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{$t('NAV').MY_WALLET}}</h1>
    </div>

    <div class="contView_box backupInfo_box">
      <div class="backupInfo_top">
        <div class="backupCont_box">
          <h3 class="title">{{$t('TITLE').YOUR_ADDREAA}}</h3>
          <div class="backupCont_input">
            <input
              type="text"
              class="input-text input"
              readonly
              v-model="walletAdress"
              id="walletAdress"
            />
          </div>
          <div v-if="keystoreHide" class="backupCont_box">
            <p class="tip">{{$t('BTN').DOWNLOAD_KEYSTORE1}}</p>
            <a class="btn" :download="keystoreName" :href="keystoreURL">{{$t('BTN').DOWNLOAD}}</a>
          </div>
        </div>

        <div class="backupCont_box" id="receiveAddressBtn">
          <h3 class="title">{{$t('TITLE').PRIVATE_KEY_UNENCRYPTED}}</h3>
          <div class="backupCont_input">
            <input
              type="password"
              class="input-text input input1"
              readonly
              :value="walletInfo ? walletInfo.getPrivateKeyString() : ''"
              id="privateKey"
            />
            <input
              type="text"
              class="input-text input input1"
              id="privateKeyInfo"
              :value="walletInfo ? walletInfo.getPrivateKeyString() : ''"
              style="opacity: 0;"
            />
            <div class="eyesBox showAndHideEyes" id="eyesView" @click="showAndHideEyes"><div class="eyes"><img src="@etc/img/Visible.svg" id="eyesViewId"></div></div>
          </div>
          <button class="btn" @click="copyAddress('privateKeyInfo', 'receiveAddressBtn')" data-toggle="tooltip" data-placement="bottom" :title="$t('BTN').COPY_CLIPBOARD">
            <!-- {{$t('BTN').COPY_CLIPBOARD}} -->
            <el-popover
              trigger="hover"
              :content="$t('BTN').COPY_CLIPBOARD">
              <div class="addreess" slot="reference">{{$t('BTN').COPY_CLIPBOARD}}</div>
            </el-popover>
          </button>
        </div>
      </div>

      <div class="qrcodeView_box">
        <ul>
          <li>
            <div class="qrcodeView_cont">
              <h3 class="title">{{$t('TITLE').YOUR_ADDREAA}}</h3>
              <div id="addressQrcode"></div>
            </div>
          </li>
          <li>
            <div class="qrcodeView_cont">
              <h3 class="title">{{$t('TITLE').PRIVATE_KEY_UNENCRYPTED}}</h3>
              <div id="privateQrcode" data-eyes="1"></div>
              <div class="qrcodeView_black" id="qrcodeViewBlack"></div>
              <div class="qrcodeView_eyes showAndHideEyes cursorP" @click="showAndHideEyes"><img src="@etc/img/Visible.svg" id="qrcodeViewId"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<style>

</style>

<script>
export default {
  name: "backupWallet",
  data () {
    return {
      walletAdress: "",
      keystoreName: "",
      keystoreURL: "",
      keystoreHide: false,
      walletInfo: ''
    }
  },
  created () {

  },
  mounted () {
    this.pageRefresh()
    if (!this.$store.state.address) {
      this.$router.push("/importWallet")
    }
  },
  methods: {
    showAndHideEyes () {
      let privateKey_id = document.getElementById('privateKey'),
          eyesView_id = document.getElementById('eyesViewId'),
          privateQrcode_id = document.getElementById('privateQrcode'),
          qrcodeView_id = document.getElementById('qrcodeViewId'),
          qrcodeView_black_id = document.getElementById('qrcodeViewBlack')
      let eyes_hide = require("@etc/img/Hide.svg"),
          eyes_visible = require("@etc/img/Visible.svg")
      let pwdAndTxt = privateKey_id.getAttribute("type")
      privateQrcode_id.innerHTML = ""
      if (pwdAndTxt === "password") {
        privateKey_id.setAttribute("type", "text")
        eyesViewId.src = eyes_hide
        qrcodeView_id.src = eyes_hide
        privateQrcode_id.setAttribute("data-eyes", "0")
        qrcodeView_black_id.style.display = "none"
        this.$$.qrCode((this.walletInfo ? this.walletInfo.getPrivateKeyString() : ''), "privateQrcode")
      } else {
        privateKey_id.setAttribute("type", "password")
        eyesViewId.src = eyes_visible
        qrcodeView_id.src = eyes_visible
        privateQrcode_id.setAttribute("data-eyes", "1")
        qrcodeView_black_id.style.display = "block"
      }
    },
    pageRefresh () {
      this.walletAdress = this.$store.state.address
      this.keystoreURL = this.$store.state.wallet.keystoreURL
      this.keystoreName = this.$store.state.wallet.downloadName
      if (this.keystoreURL && this.keystoreName) {
        this.keystoreHide = true
      }
      // console.log(this.keystoreHide)
      this.$store.state.walletFn.getPrivateKeyString()
      if (this.walletAdress) {
        this.$$.qrCode(this.walletAdress, "addressQrcode")
      }
      if (this.walletInfo && this.walletInfo.getPrivateKeyString()) {
        this.$$.qrCode((this.walletInfo ? this.walletInfo.getPrivateKeyString() : ''), "privateQrcode")
      }
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand("Copy")
      this.$message({
        message: this.$t('SUCCESS_TIP').TIP_0,
        type: 'success'
      })
    },
  },
  destroyed () {
    this.$store.commit("storeWalletFn", "")
  }
}
</script>
