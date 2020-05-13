<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <img src="@/assets/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@/assets/img/logo/logo-black.svg" v-else>
      </div>
      <h3 class="title" v-html="$t('title').walletTitle"></h3>
      <p class="tip color_red" v-html="$t('tip').walletTip"></p>
      <div class="flex-c">
        <w-button :ok="$t('btn').login" :cancel="$t('btn').register" @onOk="toUrl('login')" @onCancel="toUrl('register')" class="mt-20"></w-button>
      </div>
      <div class="flex-c mt-10">
        <div class="importFile flex-sc">
          <span class="font12 color_blue opacity6">{{$t('btn').importAccount}}</span>
          <input type="file" class="file" id="fileUpload" @change="fileUpChange" :title="$t('btn').importAccount">
        </div>
      </div>
      <!-- <div class="WW100 mt-5 flex-c flex-wrap">
        <set-enode :isShowEnode="false"></set-enode>
      </div> -->
      <!-- <div>
        <el-button @click="startLocalNode">启动本地节点</el-button>
        <el-button @click="testLocalNode">测试本地节点</el-button>
      </div> -->
    </div>

    <el-dialog :title="$t('btn').importAccount" :visible.sync="eDialog.import" width="300px" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <div>
        {{$t('warn').w_20}}：{{accountData && accountData.account && accountData.account.username ? accountData.account.username : ''}} ?
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="importAccount">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('btn').importAccount" :visible.sync="eDialog.changeName" width="300px" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <div>
        {{$t('error').err_7}}：{{accountData && accountData.account && accountData.account.username ? accountData.account.username : ''}} ！{{$t('warn').w_22}}：
      </div>
      <div>
        <el-input v-model="newAccountName" :placeholder="$t('warn').w_22"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="changeNewAccount">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import './scss/enter';
.importFile {
  width: size(240);position: relative;
  .file {
    width: 100%;height: 100%;position: absolute;top:0;left: 0;right: 0;bottom: 0;opacity: 0;cursor: pointer;
  }
}
</style>

<script>
import wButton from '@/components/btn/index.vue'
import setEnode from '@/components/setEnode/index.vue'
import regExp from '@/assets/js/config/RegExp.js'
import {computedPub} from '@/assets/js/pages/public'
// import getEnode from '@/assets/js/pages/node/getEnode.js'
// const {spawn} = require('child_process')
export default {
  name: '',
  data () {
    return {
      eDialog: {
        import: false,
        changeName: false
      },
      accountData: {},
      newAccountName: ''
    }
  },
  components: {wButton, setEnode},
  computed: {
    ...computedPub
  },
  mounted () {
    // console.log(this.$$)
  },
  methods: {
    // ...getEnode,
    // startLocalNode () {
    //   try {
    //     // console.log(config)
    //     spawn(this.$$.config.gDcrm)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },
    // testLocalNode () {
    //   let url = this.$$.config.serverRPC
    //   this.getEnode(url, true).then(res => {
    //     console.log(res)
    //     if (res.status === 'Success') {

    //     }
    //   })
    // },
    modalClick () {
      this.eDialog.import = false
      this.eDialog.changeName = false
      this.accountData = {}
      this.newAccountName = ''
    },
    changeNewAccount () {
      if (this.newAccountName) {
        if (!regExp.username.test(this.newAccountName)) {
          this.msgError(this.$t('error').err_2)
        } else {
          this.accountData.account.username = this.newAccountName
          this.importAccount()
        }
      } else {
        this.msgError(this.$t('error').err_1)
      }
    },
    importAccount () {
      let account = this.accountData.account
      // console.log(account)
      this.$db.findAccount({$or: [{address: account.address}, {username: account.username}]}).then(list => {
        // console.log(list)
        if (list.length <= 0) {
          this.$db.insertAccount({
            username: account.username,
            address: account.address,
            ks: account.ks,
            timestamp: account.timestamp,
          }).then(res => {
            console.log(res)
            this.msgSuccess(this.$t('success').s_7)
            this.modalClick()
          }).catch(err => {
            console.log(err.toString())
            this.msgError(err)
            this.modalClick()
          })
        } else {
          this.eDialog.import = false
          this.eDialog.changeName = true
          // this.msgError(this.$t('error').err_7)
          // this.modalClick()
        }
      }).catch(err => {
        console.log(err)
        // this.msgError(err.toString())
        this.msgError(this.$t('error').err_7)
        this.modalClick()
      })
    },
    fileUpChange (event) {
      let reader = new FileReader()
      let fileNameID = document.getElementById("fileName")
      let fileName = event.target.files[0].username
      reader.onload = onLoadEvent => {
        // console.log(onLoadEvent.currentTarget.result)
        let data = onLoadEvent.currentTarget.result
        try {
          data = data ? JSON.parse(data) : ''
          console.log(data)
          if (data) {
            if (data.account && data.account.ks && this.$$.walletRequirePass(data.account.ks)) {
              this.accountData = data
              this.eDialog.import = true
            } else {
              this.msgError(this.$t('error').err_11)
            }
          } else {
            this.msgError(this.$t('error').err_11)
          }
        } catch (error) {
          console.log(error.toString())
          this.msgError(this.$t('error').err_11)
        }
      }
      reader.readAsText(event.target.files[0])
    },
  }
}
</script>