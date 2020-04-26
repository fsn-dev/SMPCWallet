<template>
  <div class="boxConntent1 container" id="personInfoBox">
    <!-- <div class="flex-bc t-logo-box">
      <logo @click-logo="closeDrawer"></logo>
      <div class="quit-box cursorP" @click="quitApp()"> {{$t('title').quit}} </div>
    </div> -->
    <ul class="user-list">
      <!-- <li class="item flex-sc" @click="createAccount" :title="$t('btn').createAccount"><i class="el-icon-plus icon"></i>{{$t('btn').createAccount}}</li> -->
      <li class="item flex-sc" v-if="$$.config.accountSwitch.person" @click="changeMode('1')" :title="$t('btn').createPersson"><i class="el-icon-user icon"></i>{{$t('btn').createPersson}}</li>
      <li class="item flex-sc" @click="changeMode('0')" :title="$t('btn').createGroup"><i class="el-icon-money icon"></i>{{$t('btn').createGroup}}</li>
      <!-- <li class="item flex-sc" @click="getAccountData" :title="$t('title').exportAccount"><i class="el-icon-download icon"></i>{{$t('btn').exportAccount}}</li> -->
      <li class="item flex-sc" @click="openUrl('/social')" :title="$t('title').exportAccount"><i class="el-icon-circle-plus-outline icon"></i>{{$t('btn').addFriend}}</li>
      <li class="item flex-sc" @click="openUrl('/set')" :title="$t('btn').set"><i class="el-icon-setting icon"></i>{{$t('btn').set}}</li>
    </ul>
    <set-enode class="mt-20" :class="nodeClass ? 'set-node-box' : ''" :isSetNode="false"></set-enode>


    <el-dialog :title="$t('btn').exportAccount" :visible.sync="eDialog.export" width="300px" :before-close="closeDrawer"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <div>
        {{$t('warn').w_21}}：{{accountData && accountData.account && accountData.account.username ? accountData.account.username : ''}} ?
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDrawer">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="exportAccount">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
// .t-logo-box {
//   border-bottom: 1px solid #ddd;padding-bottom: size(20);
//   .quit-box {
//     padding: size(0) size(8);border: 1px solid $color-primary;color: $color-primary;font-size: $text-sm;display: inline-block;
//   }
// }
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
      ksUrl: '',
      nodeClass: true
    }
  },
  components: {setEnode},
  computed: {
    ...computedPub
  },
  mounted () {
    // console.log(this.$$.config)
    this.getNowPageHeight()
    window.onresize = () => {
      this.getNowPageHeight()
    }
  },
  methods: {
    getNowPageHeight () {
      try {
        let h = document.getElementById('personInfoBox').clientHeight
        if (h < 720) {
          this.nodeClass = false
        } else {
          this.nodeClass = true
        }
      } catch (error) {
        
      }
      // console.log(h)
    },
    closeDrawer () {
      this.eDialog.export = false
      this.accountData = {}
      this.ksName = ''
      this.ksUrl = ''
      this.$emit('closeDrawer')
    },
    createAccount () {
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
      this.$store.commit('setAccountType', {info: type})
      this.createAccount()
      this.closeDrawer()
    },
    getAccountData () {
      this.$db.findAccount({address: this.address}).then(res => {
        // console.log(res)
        this.accountData.account = {
          address: res[0].address,
          ks: res[0].ks,
          username: res[0].username,
          timestamp: res[0].timestamp,
        }
        this.ksName = res[0].username
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