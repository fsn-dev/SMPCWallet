<template>
  <div class="flex-c bg"  v-loading="loading.wait" element-loading-text="Loading……">
    <div class="user-form-box">
      <div class="user-form-title">
        <logo></logo>
        <router-link to="/" class="back"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</router-link>
        <h3 class="title">{{$t('title').login}}</h3>
      </div>

      <div class="user-form-input c-form-box-sm">
        <div class="WW100" style="margin:auto;">
          <el-form ref="userInfoForm" :model="loginObj" :rules="rules" label-width="120px" label-position="top" @submit.native.prevent>
            <!-- <el-form-item :label="$t('label').username" prop="username">
              <el-input v-model="loginObj.username" @input="validInfo('username')"></el-input>
            </el-form-item> -->
            <el-form-item>
              <div slot="label" class="flex-sc">
                <span class="color_red">* </span>
                {{$t('btn').setNode}}
              </div>
              <el-select class="WW100 mt-10" v-model="netUrl" filterable allow-create default-first-option placeholder="" :title="netUrl" no-data-text="Null" :loading="loadingSelect" :loading-text="$t('loading').l_1">
                <el-option
                  v-for="(item, index) in netUrlArr"
                  :key="index"
                  :label="item.name"
                  :value="item.url">
                  <div class="WW100 flex-bc">
                    <span class="WW80 ellipsis">{{ item.name }}</span>
                    <span class="color_green" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                    <span class="color_red" v-else-if="item.status === 0"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
                    <span class="color_99" v-else><i class="el-icon-question mr-5"></i>{{$t('label').unknown}}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <div slot="label" class="flex-sc">
                <span class="color_red">* </span>
                {{$t('label').username}}
              </div>
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
                <el-option v-for="item in userlist" :key="item.username" :label="item.username" :value="item.username">
                  
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
import getEnode from '@/assets/js/pages/node/getEnode.js'
import {nodeDatas, nodeSockets, nodeMethods} from '@/assets/js/pages/node/index.js'
export default {
  name: 'login',
  data () {
    return {
      ...nodeDatas,
      netUrl: '',
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
  watch: {
    serverRPC () {
      this.setSelected()
    },
  },
  sockets: {
    ...nodeSockets
  },
  mounted () {
    this.getAllUser()
    this.getNetUrl()
    this.setSelected()
  },
  methods: {
    ...nodeMethods,
    ...getEnode,
    setSelected () {
      this.netUrl = this.serverRPC ? this.serverRPC : this.$$.config.serverRPC
    },
    getAllUser () {
      this.$db.findAccount({}).then(res => {
        // console.log(res)
        this.userlistInit = res
      })
    },
    remoteMethod (query)  {
      // console.log(query)
      this.loading.user = true
      if (query !== '') {
        this.userlist = this.userlistInit.filter(item => {
          return item.username && item.username.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading.wait = true
          this.setNet()
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    setNet () {
      this.netUrl = this.netUrl.replace(/\s/g, '')
      let url = this.netUrl
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        url = this.netUrl = 'http://' + url
      }
      // console.log(url)
      this.getEnode(url, true).then(res => {
        if (res.status === 'Success') {
          let eNodeInit = res.enode
          let nodeObj = {}
          for (let obj of this.netUrlArr) {
            if (obj.url === url) {
              nodeObj = obj
              break
            }
          }
          this.saveRpcDB(url)
          this.$store.commit('setServerRPC', {info: url})
          this.$store.commit('setServerRPCname', {info: nodeObj.name ? nodeObj.name : url})
          this.$store.commit('setEnode', eNodeInit)
          this.inputFileBtn()
        } else {
          this.loading.wait = false
          this.msgError(this.$t('error').err_9)
        }
      })
    },
    inputFileBtn () {
      this.$db.findAccount({username: this.loginObj.username}).then(res => {
        console.log(res)
        if (res.length > 0) {
          let keystore = res[0].ks
          this.$store.commit('setEmail', res[0].email ? res[0].email : '')
          this.unlock(keystore)
        } else {
          this.msgError(this.$t('error').err_8)
          this.loading.wait = false
        }
      })
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
          console.log(pwd)
          if (!this.eNode) {
            this.msgError(this.$t('error').err_10)
            return
          }
          this.$store.commit('setAddress', {info: address})
          this.$store.commit('setToken', {info: this.loginObj.username})
          this.signEnode(pwd, address)
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
    signEnode (pwd, address) {
      let eNodeKey = this.$$.eNodeCut(this.eNode).key
      this.$$.hexToSign(eNodeKey, pwd).then(res => {
        this.$socket.emit('UserEnodeAdd', {
          // nodeKey: eNodeKey,
          enode: this.eNode,
          sign: res,
          username: this.token,
          ip: this.serverRPC,
          ipName: this.serverRPCname,
          address: this.address,
        })
        this.$store.commit('setEnodeTx', {info: res})
      })
      // let eNodeKey = this.eNode
      // let sign = this.$$.hexToSign(eNodeKey, pwd)
      // this.$socket.emit('UserEnodeAdd', {
      //   // nodeKey: eNodeKey,
      //   enode: this.eNode,
      //   sign: sign,
      //   username: this.token,
      //   ip: this.serverRPC,
      //   ipName: this.serverRPCname,
      //   address: this.address,
      // })
      // this.$store.commit('setEnodeTx', {info: sign})
      // console.log(eNodeKey)
      // let rawTx = {
      //   from: address,
      //   data: eNodeKey
      // }
      // // console.log(rawTx)
      // this.$$.toSign(rawTx, pwd).then(res => {
      //   // console.log(res)
      //   this.$socket.emit('UserEnodeAdd', {
      //     // nodeKey: eNodeKey,
      //     enode: this.eNode,
      //     sign: res.signTx,
      //     username: this.token,
      //     ip: this.serverRPC,
      //     ipName: this.serverRPCname,
      //     address: this.address,
      //   })
      //   this.$store.commit('setEnodeTx', {info: res.signTx})
      // }).catch(err => {
      //   console.log(err)
      //   this.msgError(err.toString())
      // })
    }
  }
}
</script>