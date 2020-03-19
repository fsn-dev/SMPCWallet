<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <img src="@etc/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@etc/img/logo/logo-black.svg" v-else>
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
      <div class="WW100 mt-5 flex-c flex-wrap">
        <set-enode :isShowEnode="false"></set-enode>
      </div>
    </div>

    <el-dialog :title="$t('btn').importAccount" :visible.sync="eDialog.import" width="300px" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <div>
        {{$t('warn').w_20}}：{{accountData && accountData.account && accountData.account.name ? accountData.account.name : ''}} ?
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="importAccount">{{$t('btn').confirm}}</el-button>
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
import {computedPub} from '@/assets/js/pages/public'
import {insertAccount, findAccount} from '@/db/accounts'
// import {insertNode, findNode} from '@/db/node'

export default {
  name: '',
  data () {
    return {
      eDialog: {
        import: false
      },
      accountData: {}
    }
  },
  components: {wButton, setEnode},
  computed: {
    ...computedPub
  },
  mounted () {
  },
  methods: {
    modalClick () {
      this.eDialog.import = false
      this.accountData = {}
    },
    importAccount () {
      let account = this.accountData.account
      findAccount({address: account.address}).then(list => {
        console.log(list)
        if (list.length <= 0) {
          insertAccount({
            name: account.name,
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
          this.msgError(this.$t('error').err_7)
          this.modalClick()
        }
      }).catch(err => {
        console.log(err)
        this.msgError(err.toString())
        this.modalClick()
      })
    },
    fileUpChange (event) {
      let reader = new FileReader()
      let fileNameID = document.getElementById("fileName")
      let fileName = event.target.files[0].name
      reader.onload = onLoadEvent => {
        console.log(onLoadEvent.currentTarget.result)
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