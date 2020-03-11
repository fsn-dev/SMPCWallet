<template>
  <div class="boxConntent1 plr15">
    <div class="flex-bc t-logo-box">
      <logo @click-logo="closeDrawer"></logo>
      <div class="quit-box cursorP" @click="quitApp()"> {{$t('title').quit}} </div>
    </div>
    <ul class="user-list">
      <li class="item flex-sc" @click="createAccount" :title="$t('btn').createAccount"><i class="el-icon-plus icon"></i>{{$t('btn').createAccount}}</li>
      <!-- <li class="item flex-sc" v-if="$$.config.accountSwitch.person" @click="changeMode('1')" :title="$t('title').personAccount"><i class="el-icon-user icon"></i>{{$t('title').personAccount}}</li>
      <li class="item flex-sc" @click="changeMode('0')" :title="$t('title').groupAccount"><i class="el-icon-money icon"></i>{{$t('title').groupAccount}}</li> -->
      <li class="item flex-sc" @click="getAccountData" :title="$t('title').exportAccount"><i class="el-icon-download icon"></i>{{$t('btn').exportAccount}}</li>
      <li class="item flex-sc" @click="openUrl('/set')" :title="$t('btn').set"><i class="el-icon-setting icon"></i>{{$t('btn').set}}</li>
    </ul>
    <set-enode class="mt-20 set-node-box" :isSetNode="false"></set-enode>


    <el-dialog :title="$t('btn').exportAccount" :visible.sync="eDialog.export" width="300px" :before-close="closeDrawer"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <div>
        {{$t('warn').w_21}}：{{accountData && accountData.account && accountData.account.name ? accountData.account.name : ''}} ?
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDrawer">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="exportAccount">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.t-logo-box {
  border-bottom: 1px solid #ddd;padding-bottom: size(20);
  .quit-box {
    padding: size(0) size(8);border: 1px solid $color-primary;color: $color-primary;font-size: $text-sm;display: inline-block;
  }
}
.user-list {
  width: 100%;max-height: size(400);background: #fff;padding: size(5) size(0);border-radius: size(3);margin-bottom: size(50);
  .item {
    padding: size(15) size(0);text-align: left;cursor: pointer;font-size: $text-normal;line-height: size(21);
    &:hover {
      background: #f1f1f1;
    }
    .icon {
      margin-right: size(10);font-size: $text-md;
    }
  }
}
.set-node-box {
  $lrb: size(15);
  position: absolute;left: $lrb;right: $lrb;bottom: $lrb;
}
</style>

<script>
import {findAccount} from '@/db/accounts'
import {computedPub} from '@/assets/js/pages/public'
import setEnode from '@/components/setEnode/index'
export default {
  name: 'personInfo',
  data () {
    return {
      accountData: {},
      eDialog: {
        export: false
      },
      ksName: '',
      ksUrl: ''
    }
  },
  components: {setEnode},
  computed: {
    ...computedPub
  },
  mounted () {
    console.log(this.$$.config)
  },
  methods: {
    closeDrawer () {
      this.eDialog.export = false
      this.accountData = {}
      this.ksName = ''
      this.ksUrl = ''
      this.$emit('closeDrawer')
    },
    createAccount () {
      // this.$store.commit('setAccountType', {info: '0'})
      // if () {
      //   this.toUrl('/createGroup')
      // }
      if (Number(this.accountType)) {
        this.toUrl('/createPerson')
      } else {
        this.toUrl('/createGroup')
      }
      this.closeDrawer()
    },
    openUrl (url) {
      this.toUrl(url)
      this.closeDrawer()
    },
    changeMode (type) {
      // if (Number(type)) {
      //   this.toUrl('/person')
      // } else {
      //   this.toUrl('/group')
      // }
      this.$store.commit('setAccountType', {info: type})
      this.closeDrawer()
    },
    getAccountData () {
      findAccount({address: this.address}).then(res => {
        console.log(res)
        this.accountData.account = {
          address: res[0].address,
          ks: res[0].ks,
          name: res[0].name,
          timestamp: res[0].timestamp,
        }
        this.ksName = res[0].name
        this.eDialog.export = true
      })
    },
    exportAccount () {
      // this.getAccountData()
      this.ksUrl = this.$$.getBlob("text/json;charset=UTF-8", this.accountData)
      let _a = document.createElement('a')
      _a.download = this.ksName + '.json'
      _a.href = this.ksUrl
      _a.click()
      this.closeDrawer()
      this.msgSuccess(this.$t('success').s_6)
      _a = null
      // console.log(this.ksUrl)
    }
  }
}
</script>