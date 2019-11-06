<template>
  <div>
    <div class="pwdSure_box">

      <!-- <div class="newWallet_title flex-c">
        <h3 class="title">Import wallet</h3>
      </div> -->

      <div class="flex-bc selectType_box">

        <div class="selectType_content">
          <div class="selectType_keystore" id="keystore" data-view="keystore" v-if="Number(loginState) === 3">
          <!-- <form class="selectType_keystore" id="keystore" data-view="keystore"> -->
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('PLACEHOLDER').ENTER_PASSWORD}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="selectType_KSbtn" v-if="!$store.state.keystoreFile">
                <p class="p" id="fileName">{{$t('PLACEHOLDER').ENTER_PASSWORD}}</p>
                <input
                  type="file"
                  class="file"
                  id="fileUpload"
                  @change="fileUpChange"
                >
              </div>
              <div class="selectType_contTnput" v-if="showPwd">
                <input
                  type="password"
                  :placeholder="$t('PLACEHOLDER').ENTER_PASSWORD"
                  class="input-text input"
                  v-model="password"
                  @keyup="changePwd"
                >
              </div>
              <div class="createInfo_btn flex-c" v-if="showPwdBtn">
                <button class="btn" @click="inputFileBtn" id="UnlockBtn">{{$t('BTN').UNLOCK}}</button>
              </div>
            </div>
          <!-- </form> -->
          </div>

          <div class="selectType_keystore" id="private" data-view="private" v-if="Number(loginState) === 4">
          <!-- <form class="selectType_keystore" id="private" data-view="private"> -->
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('TITLE').PASTE_PRIVATE_KEY}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="selectType_contTnput">
                <input
                  type="password"
                  :placeholder="$t('PLACEHOLDER').ENTER_PRIVATE_KEY"
                  class="input-text input pwdChange"
                  v-model="privateKey"
                  @keyup="changePrv"
                >
              </div>

              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputPwdBtn" v-if="showPwdBtn">{{$t('BTN').UNLOCK}}</button>
              </div>
            </div>
          <!-- </form> -->
          </div>

          <div class="selectType_keystore" id="TREZOR" data-view="TREZOR" v-if="Number(loginState) === 2">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('TITLE').TREZOR_WALLET}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputTREZORBtn" v-if="!$store.state.safeMode">{{$t('BTN').CONNECT_TO_TREZOR}}</button>
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="LEDGER" data-view="LEDGER" v-if="Number(loginState) === 1">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('TITLE').LEDGER_WALLET}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputLEDGERBtn" v-if="!$store.state.safeMode">{{$t('BTN').CONNECT_TO_LEDGER}}</button>
              </div>
            </div>
            <div class="selectType_contTip" v-if="isShowTip">
              {{$t('LEDGER_TIP')}}
            </div>
          </div>

          <div class="selectType_keystore" id="MetaMask" data-view="MetaMask" v-if="Number(loginState) === 0">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('TITLE').METAMASK_WALLET}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputMETAMASKBtn" v-if="!$store.state.safeMode">{{$t('BTN').CONNECT_TO_METAMASK}}</button>
              </div>
              <div class="selectType_contTip" v-if="isMetamaskShowTip">
                {{$t('METAMASK_TIP')}}
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="Mnemonic" data-view="Mnemonic" v-if="Number(loginState) === 5">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{$t('IMPORT_TYPE').Mnemonic}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <el-form label-position="top" label-width="80px">
                <el-form-item>
                  <el-input type="textarea" :rows="4" placeholder="Mnemonic Phrase" v-model="mnemonicPhrase"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                  <el-input v-model="mnemonicPwd" placeholder="Password"></el-input>
                </el-form-item>
              </el-form>
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="MnemonicBtn">{{$t('BTN').UNLOCK}}</button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style>

</style>

<script>
let ethFuncs = require('@/assets/js/ethFuncs')
export default {
  name: "pwdSure",
  props: ["sendDataPage"],
  data () {
    return {
      password: "",
      fileJSON: "",
      showPwd: false,
      showPwdBtn: false,
      fileData: "",
      privateKey: "",
      walletInfo: "",
      checkAddress: "",
      // dcrmAddress: "",
      isShowTip: true,
      isMetamaskShowTip: true,
      ledger: "",
      selectTypeArr: this.$store.state.loginType,
      mnemonicPhrase: "",
      mnemonicPwd: "",
      con_gasPrice: 0,
      con_gasLimit: 0,
      con_nonce: 0,
      setSendType: ''
    }
  },
  sockets: {
    base (data) {
      console.log(data)
      this.con_gasPrice = data.info.gasPrice
      this.con_gasLimit = data.info.gasLimit
      this.con_nonce = data.info.nonce
      this.getDecrAddressSign(this.setSendType)
    }
  },
  computed: {
    loginState () {
      return this.$store.state.loginState
    }
  },
  created () {
    if (location.protocol === 'https:' && navigator.userAgent.indexOf('Chrome') !== -1) {
      this.isShowTip = false
    }
    if (location.protocol === 'https:') {
      this.isMetamaskShowTip = false
    }
    if (this.$store.state.keystoreFile) {
      this.showPwd = this.$$.walletRequirePass(this.$store.state.keystoreFile)
    }
    if (this.$store.state.walletFn) {
      this.walletInfo = this.$store.state.walletFn
    }
  },
  mounted () {
  },
  methods: {
    fileUpChange (event) {
      let reader = new FileReader()
      let fileNameID = document.getElementById("fileName")
      this.password = ""
      let fileName = event.target.files[0].name
      reader.onload = onLoadEvent => {
        this.fileData = onLoadEvent.currentTarget.result
        this.showPwd = this.$$.walletRequirePass(this.fileData)
        if (this.showPwd) {
          fileNameID.innerHTML = fileName
        } else {
          fileNameID.innerHTML = this.$t('BTN').PASTE_PRIVATE_KEY
        }
      }
      reader.readAsText(event.target.files[0])
    },
    inputFileBtn () {
      try{
        this.walletInfo = wallet.getWalletFromPrivKeyFile(
          // this.fileData,
          this.$store.state.keystoreFile ? this.$store.state.keystoreFile : this.fileData,
          this.password
        )
        this.inputAfter()
      } catch (e) {
        this.$message.error(e)
      }
    },
    inputPwdBtn () {
      try {
        this.walletInfo = new wallet(
          new Buffer(this.$$.fixPkey(this.privateKey), "hex")
        )
        this.inputAfter()
      } catch (e) {
        console.log(e)
        this.$message.error(e)
      }
    },
    inputAfter () {
      this.checkAddress = this.walletInfo.getChecksumAddressString()
      if (this.checkAddress.toLowerCase() !== this.sendDataPage.from.toLowerCase()) {
        this.$message.error(this.$t('ERROR_TIP').TIP_7)
        return
      }
      this.sendType('INPUT')
    },
    inputTREZORBtn () {
      if (!this.$store.state.wallet.trezor) {
        this.$message.error(this.$t('ERROR_TIP').TIP_3)
        return
      }
      this.checkAddress = this.$store.state.address
      this.sendType('TREZOR')
    },
    trezorStx (rawTx, stxData) {
      let params = this.$store.state.wallet.HDpath
      rawTx.value = ethFuncs.sanitizeHex(rawTx.value.toString(16))
      rawTx.data = rawTx.data ? this.$$.strToHexCharCode(rawTx.data) : ''
      rawTx.gasLimit = ethFuncs.sanitizeHex(rawTx.gasLimit.toString(16))
      rawTx.gasPrice = ethFuncs.sanitizeHex(rawTx.gasPrice.toString(16))
      rawTx.nonce = ethFuncs.sanitizeHex(rawTx.nonce.toString(16))
      console.log(rawTx)
      let TrezorConnect = this.$store.state.wallet.trezor
      TrezorConnect.ethereumSignTransaction({
        path: params,
        transaction:  rawTx
      }).then((res) => {
        console.log(res)
        console.log(rawTx)
        if (!res.success) {
          return
        }
        let resPayload = res.payload,
          v = resPayload.v,
          r = resPayload.r,
          s = resPayload.s;

        // check the returned signature_v and recalc signature_v if it needed
        // see also https://github.com/trezor/trezor-mcu/pull/399
        if (v <= 1) {
          console.log(v)
          // for larger chainId, only signature_v returned. simply recalc signature_v
          v += 2 * rawTx.chainId + 35
        }
        // v = parseInt(v, 16)
        // v = v.toString(16)
        console.log(v)
        rawTx.v = ethFuncs.sanitizeHex(v)
        rawTx.r = ethFuncs.sanitizeHex(r)
        rawTx.s = ethFuncs.sanitizeHex(s)
        // console.log(rawTx)
        var eTx = new ethUtil.Tx(rawTx)
        console.log(eTx)
        rawTx.rawTx = JSON.stringify(rawTx)
        rawTx.signedTx = ethFuncs.sanitizeHex(eTx.serialize().toString("hex"))
        rawTx.isError = false
        if (stxData) {
          stxData.serializedTx = rawTx.signedTx
        } else {
          stxData = rawTx.signedTx
        }
        console.log(rawTx)
        this.sendSignData(stxData)
      })
    },
    inputLEDGERBtn () {
      if (!this.$store.state.wallet.ledger) {
        this.$message.error(this.$t('ERROR_TIP').TIP_3)
        return
      }
      this.checkAddress = this.$store.state.address
      this.sendType('LEDGER')
    },
    ledgerStx (txData, stxData) {
      var app = this.$store.state.wallet.ledger
      txData.path = this.$store.state.wallet.HDpath
      txData.data = txData.data ? this.$$.strToHexCharCode(txData.data) : ''
      var rawTx = {
        nonce: Number(txData.nonce),
        gasPrice: Number(txData.gasPrice),
        gasLimit: Number(txData.gasLimit),
        to: ethFuncs.sanitizeHex(txData.to),
        value: Number(txData.value),
        data: ethFuncs.sanitizeHex(txData.data)
      }
      rawTx.chainId = txData.chainId
      var eTx = new ethUtil.Tx(txData)
      var EIP155Supported = false
      var localCallback = (result, error) => {
        // console.log(result)
        // console.log(error)
        if (typeof error != "undefined") {
          this.$message.error(error)
          return
        }
        var splitVersion = result['version'].split('.');
        if (parseInt(splitVersion[0]) > 1) {
            EIP155Supported = true;
        } else if (parseInt(splitVersion[1]) > 0) {
            EIP155Supported = true;
        } else if (parseInt(splitVersion[2]) > 2) {
            EIP155Supported = true;
        }
        this.signTxLedger(app, eTx, rawTx, txData, !EIP155Supported, stxData);
      }
      app.getAppConfiguration(localCallback)
    },
    signTxLedger (app, eTx, rawTx, txData, old, stxData) {
      eTx.raw[6] = rawTx.chainId
      eTx.raw[7] = eTx.raw[8] = 0
      var toHash = old ? eTx.raw.slice(0, 6) : eTx.raw
      // var toHash = eTx.raw
      var txToSign = ethUtil.rlp.encode(toHash)
      var localCallback = (result, error) => {
        console.log(result)
        console.log(error)
        if (typeof error != "undefined") {
          error = error.errorCode ? u2f.getErrorByCode(error.errorCode) : error
          this.$message.error(error)
          return
        }
        var v = result['v'].toString(16);
        if (!old) {
          // EIP155 support. check/recalc signature v value.
          var rv = parseInt(v, 16)
          var cv = rawTx.chainId * 2 + 35
          if (rv !== cv && (rv & cv) !== rv) {
              cv += 1 // add signature v bit.
              // console.log(cv)
          }
          v = cv.toString(16);
        }
        rawTx.v = "0x" + v;
        rawTx.r = "0x" + result['r'];
        rawTx.s = "0x" + result['s'];
        eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
        rawTx.isError = false;
        console.log(rawTx)
        if (stxData) {
          stxData.serializedTx = rawTx.signedTx
        } else {
          stxData = rawTx.signedTx
        }
        this.sendSignData(stxData)
      }
      app.signTransaction(txData.path, txToSign.toString('hex'), localCallback);
    },
    inputMETAMASKBtn () {
      if (!web3) {//用来判断你是否安装了metamask
        window.alert('Please install MetaMask first.')//如果没有会去提示你先去安装
        return
      }
      if (!web3.eth.coinbase) {//这个是判断你有没有登录，coinbase是你此时选择的账号
        window.alert('Please activate MetaMask first.')
        return
      }
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // console.log(web3.eth.coinbase)
        this.checkAddress = web3.eth.coinbase
        if (this.checkAddress.toLowerCase() !== this.sendDataPage.from.toLowerCase()) {
          this.$message.error(this.$t('ERROR_TIP').TIP_7)
          return
        }
        this.sendType('METAMASK')
      }
    },
    metamaskStx (rawTx, stxData) {
      rawTx.nonce = "0x" + rawTx.nonce.toString(16)
      rawTx.gasPrice = "0x" + rawTx.gasPrice.toString(16)
      rawTx.gas = rawTx.gasLimit = "0x" + rawTx.gasLimit.toString(16)
      rawTx.value = "0x" + rawTx.value.toString(16)
      console.log(rawTx)
      web3.eth.sendTransaction(rawTx, (err, res) => {
        if (err) {
          console.log(err)
          this.$message.error(err)
          this.sendSignData({txhax: "",status: this.$t('LABEL').FAILURE, type: "METAMASK"})
        } else {
          console.log(res)
          this.$message({ message: this.$t('ERROR_TIP').TIP_10.FIRST + res + this.$t('ERROR_TIP').TIP_10.LAST, type: 'success' })
          this.sendSignData({txhax: res,status: this.$t('LABEL').SUCCESS, type: "METAMASK"})
        }
        this.elDialogView()
      })
    },
    sendType (type) {
      this.setSendType = ''
      if (type === "INPUT") {
        if (this.sendDataPage.sendType === "MYWALLET") {
          this.setConfimAddr()
        }else {
          this.signSendData()
        }
      } else {
        if (this.sendDataPage.sendType === "MYWALLET") {
          this.setConfimAddr()
          this.setSendType = type
        }else {
          this.signSendData(type)
        }
      }
    },
    setConfimAddr () {
      this.$socket.emit('base', {
        from: this.sendDataPage.from,
        to: '0x00000000000000000000000000000000000000dc',
        url: this.$store.state.network.url,
        nonceType: 7
      })
    },
    getDecrAddressSign (type) {
      let rawTx = {
        nonce: Number(this.con_nonce),
        gasPrice: Number(this.con_gasPrice),
        gasLimit: Number(this.con_gasLimit),
        from: this.sendDataPage.from,
        to: "0x00000000000000000000000000000000000000dc",
        value: 0,
        data: this.sendDataPage.data
      }
      let sendBack = {
        coin: this.sendDataPage.coin,
        serializedTx: ""
      }
      rawTx.chainId = Number(this.$store.state.network.chainId)
      console.log(rawTx)
      if (type === 'METAMASK') {
        this.metamaskStx(rawTx, sendBack)
      } else if (type === "TREZOR") {
        this.trezorStx(rawTx, sendBack)
      } else if (type === "LEDGER") {
        this.ledgerStx(rawTx, sendBack)
      } else {
        let pwd = this.walletInfo ? this.walletInfo.getPrivateKeyString() : ''
        pwd = pwd.indexOf("0x") === 0 ? pwd.substr(2) : pwd
        let privateKey = new Buffer(pwd, "hex")
        this.signSendDataPub(privateKey, rawTx, sendBack)
      }
    },
    signSendData (type) {
      if (this.checkAddress.toLowerCase() === this.sendDataPage.from.toLowerCase()) {
        let rawTx = {
          // nonce: Number(this.sendDataPage.nonce) === 0 ? 1 : Number(this.sendDataPage.nonce),
          nonce: Number(this.sendDataPage.nonce),
          gasPrice: Number(this.sendDataPage.gasPrice),//Number类型 
          gasLimit: Number(this.sendDataPage.gasLimit),
          from: this.sendDataPage.from,
          to: this.sendDataPage.to,
          value: Number(this.sendDataPage.value),//Number类型
          data: this.sendDataPage.data
        }
        rawTx.chainId = this.sendDataPage.chainId ? this.sendDataPage.chainId : Number(this.$store.state.network.chainId)

        console.log(rawTx)
        if (type === 'METAMASK') {
          this.metamaskStx(rawTx)
        } else if (type === "TREZOR") {
          this.trezorStx(rawTx)
        } else if (type === "LEDGER") {
          this.ledgerStx(rawTx)
        } else {
          let privateKey = new Buffer(this.$$.fixPkey((this.walletInfo ? this.walletInfo.getPrivateKeyString() : '')), "hex")
          this.signSendDataPub(privateKey, rawTx)
        }
      } else {
        this.$message.error(this.$t('ERROR_TIP').TIP_7)
        return
      }
    },
    signSendDataPub (pwd, rawTx, sendBack) {
      // if (!pwd) 
      // console.log(pwd)
      let Tx = require("ethereumjs-tx")
      let tx = new Tx(rawTx)
      tx.sign(pwd)
      let serializedTx = tx.serialize()
      let serializedTxString = serializedTx.toString("hex")
      serializedTxString = serializedTxString.indexOf("0x") === 0 ? serializedTxString : ("0x" + serializedTxString)
      console.log(serializedTxString)
      if (sendBack) {
        sendBack.serializedTx = serializedTxString
      } else {
        sendBack = serializedTxString
      }
      this.sendSignData(sendBack)
    },
    sendSignData (data) {
      this.$emit("sendSignData", data)
      this.password = ""
      this.privateKey = ""
      this.checkAddress = ""
      this.showPwdBtn = false
    },
    elDialogView () {
      this.$emit("elDialogView")
    },
    changePrv (e) {
      this.showPwdBtn = true
      if (e.which === 13) {
        this.inputPwdBtn()
      }
    },
    changePwd (e) {
      if (e.which === 13) {
        this.inputFileBtn()
      }
      this.showPwdBtn = true
    }
  }
}
</script>
