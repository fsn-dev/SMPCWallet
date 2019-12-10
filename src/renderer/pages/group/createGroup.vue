<template>
  <div class="boxConntent1 container" v-loading="loading.creat" element-loading-text="账户建立中……">

    <div :class="formBoxClass ? 'c-form-box' : 'c-form-box-sm'">
      <div class="WW100">
        <el-form :model="groupForm" ref="groupForm" :rules="rules" label-width="100px" label-position="top">
          <el-form-item label="账户名" prop="name">
            <el-input v-model="groupForm.name"></el-input>
          </el-form-item>
          <el-form-item label="组">
            <el-select v-model="gID" :placeholder="$t('warn').w_4" class="WW100" @change="changeGroup">
              <el-option :label="$t('state').null" :value="0"></el-option>
              <el-option v-for="(item, index) in getGroup" :key="index" :label="item.name" :value="item.Gid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label').mode"
            :rules="{
              required: true, message: $t('warn').w_5, trigger: 'blur'
            }">
            <el-select v-model="groupForm.mode" :placeholder="$t('warn').w_6" class="WW100" @change="changeMode" :disabled="gID ? true : false">
              <el-option v-for="(item, index) in modeArr" :key="index" :label="item.name" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(eNode, index) in groupForm.eNode" :label="$t('label').admins + (index + 1)" :key="index" :prop="'eNode.' + index + '.value'"
            :rules="{
              required: true, message: $t('warn').w_7, trigger: 'blur'
            }"
          >
            <div class="flex-bc">
              <el-input v-model="eNode.value" @blur="changeState(eNode, index)" :disabled="gID ? true : false"></el-input>
            </div>
            <div class="flex-sc" v-if="reload">
              <span class="color_green" v-if="eNode.state === 'OnLine'"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
              <span class="color_red" v-if="eNode.state === 'OffLine'"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
            </div>
          </el-form-item>
          <el-form-item class="mt-30">
            <el-button type="primary" @click="submitForm('groupForm')">{{$t('btn').createAccount}}</el-button>
            <el-button @click="resetForm('groupForm')">{{$t('btn').restart}}</el-button>
            <!-- <el-button @click="toUrl('/group')">返回</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="300" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false">
      <div class="confirm-list-box">
        <ul class="list-box">
          <li class="item flex-ai-fs"> <p class="label">账户名:</p> <p class="info">{{groupForm.name}}</p> </li>
          <li class="item flex-ai-fs"> <p class="label">{{$t('label').mode}}:</p> <p class="info">{{groupForm.mode}}{{$t('label').mode}}</p> </li>
          <li class="item flex-ai-fs" v-for="(item, index) in groupForm.eNode" :key="index"> <p class="label">{{$t('label').admins}} {{index + 1}}:</p> <p class="info">{{item.value}}</p> </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="createGroup">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('btn').unlock" :visible.sync="eDialog.pwd" width="300" :before-close="modalClick"  :close-on-click-modal="false" :modal-append-to-body='false'>
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="modalClick" v-if="eDialog.pwd"></pwdSure>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.confirm-list-box {
  width: 100%;
  .list-box {
    width: 100%;
    .item {
      padding: size(8) size(0);color: $color-gray;
      .label {
        width: 15%;text-align: right;padding-right: size(10);font-weight: bold;
      }
      .info {
        width: 85%;word-break: break-all;
      }
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'createAccount',
  props: {
    formBoxClass: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      activeName: 'first',
      reload: true,
      getGroup: [],
      eDialog: {
        pwd: false,
        confirm: false
      },
      loading: {
        creat: false
      },
      gID: 0,
      dataPage: {},
      groupForm: {
        mode: '3/3',
        eNode: [],
        name: ''
      },
      groupMember: '',
      modeArr: this.$$.mode,
      rules: {
        name: [
          { required: true, message: this.$t('warn').w_8, trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('warn').w_9, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.getGroupData()
    this.changeMode()
  },
  methods: {
    modalClick () {
      this.eDialog.pwd = false
      this.eDialog.confirm = false
    },
    getSignData (data) {
      this.modalClick()
      if (data.signTx) {
        this.$$.reqAccount(data.signTx, this.safeMode).then(res => {
          this.$store.commit('setSafeMode', {info: '0'})
          this.toUrl('/group', {gID: this.gID, publicKey: res.info.PubKey})
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: err.error,
            type: 'error'
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: 'Error',
          type: 'error'
        })
      }
    },
    getGroupData () {
      this.$$.getGroup().then(res => {
        console.log(res)
        this.getGroup = res.info ? res.info : []
        // this.getGroup = []
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          message: err.error,
          type: 'error'
        })
      })
    },
    changeGroup () {
      this.groupMember = ''
      for (let obj of this.getGroup) {
        if (this.gID === obj.Gid) {
          this.groupMember = obj
          break
        }
      }
      // console.log(this.groupMember)
      if (this.gID === 0) {
        this.groupForm.mode = '3/3'
        this.changeMode()
      } else {
        this.groupForm.mode = this.groupMember.Mode
        this.groupForm.eNode = []
        for (let obj of this.groupMember.Enodes) {
          this.groupForm.eNode.push({
            value: obj,
            key: Date.now()
          })
        }
      }
    },
    changeState (item, index) {
      this.groupForm.eNode[index].state = this.$$.getEnodeState(item.value)
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    openPwdDialog () {
      if (!this.gID) {
        this.$message({
          showClose: true,
          message: this.$t('warn').w_10,
          type: 'error'
        })
        return
      }
      // this.gMode = '3/3'
      this.dataPage = {
        from: this.address,
        to: this.$$.config.rawTx.to,
        gasLimit: this.$$.config.rawTx.gasLimit,
        gasPrice: this.$$.config.rawTx.gasPrice,
      }
      let nonce = this.$$.getNonce(this.address, '', '')
      this.dataPage.nonce = nonce
      this.dataPage.value = 0
      this.dataPage.data = 'REQDCRMADDR:' + this.gID + ':' + this.groupMember.Mode
      this.eDialog.pwd = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.openPwdDialog()
          this.eDialog.confirm = true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async createGroup () {
      let arr = []
      for (let obj of this.groupForm.eNode) {
        arr.push(obj.value)
      }
      this.$$.createGroup(this.groupForm.name, this.groupForm.mode, arr).then(res => {
        let gInfo = res
        console.log(gInfo)
        if (gInfo.msg === 'Success') {
          this.$message({
            showClose: true,
            message: this.$t('warn').w_11,
            type: 'success'
          })
          // this.toUrl('/group')
        } else {
          let error = gInfo.info.toString()
          this.$message({
            showClose: true,
            message: error,
            type: 'error'
          })
        }
        this.loading.creat = false
        this.eDialog.confirm = false
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err,
          type: 'error'
        })
        this.loading.creat = false
        this.eDialog.confirm = false
      })
    },
    resetForm(formName) {
      this.groupForm = {
        mode: '3/3',
        eNode: [],
        name: ''
      }
      this.gID = 0
      this.changeMode()
    },
    changeMode () {
      let num = Number(this.groupForm.mode.split('/')[1])
      this.groupForm.eNode = []
      for (let i = 0; i < num; i++) {
        this.groupForm.eNode.push({
          value: '',
          key: Date.now()
        })
      }
    },
  }
}
</script>