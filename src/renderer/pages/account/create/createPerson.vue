<template>
  <div class="boxConntent1 flex-c" v-loading="loading.creat" :element-loading-text="$t('loading').l_1">

    <div class="create-box box_Wshadow1">
      <div class="create-search-box">
        <div class="create-search-bg">
          <div class="search-input flex-bc">
            <el-input placeholder="Search" prefix-icon="el-icon-search" v-model="searchVal" size="mini" @input="searchEnode"></el-input>
            <el-button type="primary" size="mini" class="ml-10" @click="addNode" v-if="userlist.length <= 0 && searchVal.length > 0">{{$t('btn').select}}</el-button>
          </div>
          <div class="search-cont">
            <el-checkbox-group v-model="checkList" class="list">
              <el-checkbox class="item flex-sc" v-for="(item, index) in userlist" :key="index" :label="item.url" :disabled="item.url === serverRPC">
                <el-tooltip placement="top" :open-delay="1000">
                  <div slot="content" class="W300">
                    <p class="flex-sc"><span class="flex-ec mr-5 W40">Name:</span> {{item.name}}</p>
                    <p class="mt-5 flex-sc"><span class="flex-ec mr-5 W40">URL:</span> {{item.url}}</p>
                    <p class="mt-5 flex-sc">
                      <span class="flex-ec mr-5 W40">Status:</span> 
                      <span class="color_green" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                      <span class="color_red" v-else-if="item.status === 0"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
                      <span class="color_99" v-else><i class="el-icon-question mr-5"></i>{{$t('label').unknown}}</span>
                    </p>
                  </div>
                  <div class="W200 ellipsis flex-bc">
                    <p class="WW60 ellipsis">{{item.name}}</p>
                    <span class="color_green" v-if="item.status === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                    <span class="color_red" v-else-if="item.status === 0"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
                    <span class="color_99" v-else><i class="el-icon-question mr-5"></i>{{$t('label').unknown}}</span>
                  </div>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="create-selected-box">
        <div class="create-selected-bg">
          <div class="selected-input">
            <setMode @setMode="getMode" size="mini"></setMode>
          </div>
          <div class="selected-cont">
            <ul class="list">
              <li class="item">
                <div class="flex-sc font12">
                  <span class="color_red">*</span>
                  {{$t('label').admins + 1}}
                  <div class="ml-20">
                    <span class="color_green"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                  </div>
                </div>
                <el-tooltip placement="top" :open-delay="1000">
                  <div slot="content" class="W300">{{eNode}}</div>
                  <el-tag :type="serverRPC" size="medium" class="WW100 flex-bc">Current Node</el-tag>
                </el-tooltip>
              </li>
              <li class="item" v-for="(item, index) in node.select" :key="index">
                <div class="flex-sc font12">
                  <span class="color_red">*</span>
                  {{$t('label').admins + (index + 2)}}
                  <div class="ml-20" v-if="node.refresh">
                    <span class="color_green" v-if="item.state === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                    <span class="color_red" v-else-if="item.state === 0"><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>
                    <span class="color_99" v-else><i class="el-icon-loading mr-5"></i>{{$t('loading').l_1}}</span>
                  </div>
                </div>
                <el-tooltip placement="top" :open-delay="1000">
                  <div slot="content" class="W300">{{item.state ? (item.value ? item.value : item.url) : $t('loading').l_1}}</div>
                  <el-tag @close="removeNode(item, index)" closable :type="item.url" size="medium" class="WW100 flex-bc">
                    {{item.name}}
                  </el-tag>
                </el-tooltip>
              </li>
            </ul>
          </div>
          <div class="flex-ec create-selected-btn">
            <el-button type="primary" size="mini" native-type="submit" @click="submitForm('node')">{{$t('btn').createPersson}}</el-button>
            <el-button size="mini" @click="resetForm('node')">{{$t('btn').restart}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('title').createGroup" :visible.sync="eDialog.confirm" width="70%" :before-close="modalClick" :modal-append-to-body='false' :close-on-click-modal="false" >
      <div class="confirm-list-box" v-loading="loading.confirm" :element-loading-text="$t('loading').l_1">
        <ul class="list-box">
          <li class="item flex-ai-fs" v-for="(item, index) in createEnodeArr" :key="index">
            <div class="label flex-sc">
              {{$t('label').admins}} {{index + 1}}
              <div class="flex-sc" style="font-weight: normal">
                （
                <span class="color_green flex-bc" v-if="item.state === 1"><i class="el-icon-circle-check mr-5"></i>{{$t('state').on}}</span>
                <span class="color_red flex-bc" v-else><i class="el-icon-circle-close mr-5"></i>{{$t('state').off}}</span>）：
              </div>
            </div>
            <p class="info">{{item.name}}</p>
          </li>
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

</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {datas, watchs, methods} from './js/common.js'
import {nodeDatas, nodeSockets, nodeMethods} from '@/assets/js/pages/node/index.js'
import getEnode from '@/assets/js/pages/node/getEnode.js'
import setMode from '@/components/setMode/index.vue'
export default {
  name: 'createPerson',
  props: {
    formBoxClass: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ...datas,
      ...nodeDatas,
      rules: {},
      createEnodeArr: []
    }
  },
  components: {setMode},
  computed: {
    ...computedPub,
  },
  watch: {
    ...watchs,
    netUrlArr () {
      this.userlist = this.netUrlArr
    },
    checkList (cur, old) {
      // console.log(cur)
      // console.log(old)
      if (cur.length > this.node.max) {
        this.checkList.splice(cur.length - 1, 1)
        this.msgError(this.$t('error').err_14)
        return
      } else if (cur.length <= this.node.max) {
        if (cur.length > old.length) {
          this.setNode(cur[cur.length - 1], cur.length - 1)
        } else if (cur.length <= old.length) {
          let removeIndex = 0
          for (let i = 0, len = old.length; i < len; i++) {
            let url = old[i]
            if (!cur.includes(url)) {
              this.node.select.splice(i, 1)
              break
            }
          }
        }
      }
    }
  },
  sockets: {
    ...nodeSockets,
  },
  mounted () {
    this.init()
    this.getNetUrl()
  },
  methods: {
    ...methods,
    ...nodeMethods,
    ...getEnode,
    searchEnode () {
      let query = this.searchVal
      if (query) {
        this.userlist = this.netUrlArr.filter(item => {
          return item.name.toLowerCase().indexOf(query.toString().toLowerCase()) > -1 || item.url.toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        })
      } else {
        this.userlist = this.netUrlArr
      }
    },
    addNode () {
      if (!this.searchVal) {
        this.msgError(this.$t('error').err_12)
        return
      }
      if (this.node.select.length >= this.node.max) {
        this.msgError(this.$t('error').err_14)
        this.searchVal = ''
        return
      }
      if (this.searchVal === this.serverRPC) {
        this.msgError(this.$t('error').err_13)
        this.searchVal = ''
        return
      }
      // console.log(this.searchVal)
      let reg = /[,;\-_=+]+/g
      let arr = []
      if (reg.test(this.searchVal)) {
        let addArr = this.searchVal.replace(reg, ',').split(',')
        // console.log(addArr.includes(this.serverRPC))
        for (let obj of addArr) {
          if (!arr.includes(obj) && this.serverRPC !== obj) {
            let url = obj
            if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
              this.searchVal = url = 'http://' + url
            }
            arr.push(url)
          }
        }
      } else {
        let url = this.searchVal
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          this.searchVal = url = 'http://' + url
        }
        arr.push(this.searchVal)
      }
      // console.log(arr)
      for (let i = 0, len = arr.length; i < len; i++) {
        if (this.checkList.length < this.node.max && !this.checkList.includes(arr[i])) {
          this.checkList.push(arr[i])
          this.setNode(arr[i], i)
        }
      }
      this.searchVal = ''
      this.searchEnode()
    },
    setNode (nodeUrl, index) {
      let isExist = true, nowSelect = {}
      for (let obj of this.netUrlArr) {
        if (obj.url === nodeUrl) {
          isExist = false
          nowSelect = obj
          break
        }
      }
      if (!isExist) {
        let isRepeat = false
        for (let obj of this.node.select) {
          if (obj.url === nowSelect.url) {
            isRepeat = true
            break
          }
        }
        if (isRepeat) {
          setTimeout(() => {
            this.msgError(this.$t('error').err_13 + '  ' + nodeUrl)
          }, index * 150)
          return
        }
      } else {
        let url = nodeUrl
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url
        }
        nowSelect = {
          name: url,
          url: url,
          value: '',
          state: ''
        }
        this.saveRpcDB(nowSelect.url)
      }
      // this.node.select[index] = nowSelect
      this.node.select.push(nowSelect)
      // console.log(this.node.select)
      this.getEnode(nowSelect.url).then(res => {
        let getUrl = nowSelect.url
        let isExistSelectd = false, nowIndex = index
        for (let i = 0, len = this.checkList.length; i < len; i++) {
          let obj = this.checkList[i]
          if (obj === getUrl) {
            isExistSelectd = true
            nowIndex = i
            break
          }
        }
        if (isExistSelectd) {
          if (res.status === 'Success') {
            nowSelect.value = res.enode
            nowSelect.state = 1
          } else {
            nowSelect.value = ''
            nowSelect.state = 0
          }
          this.node.select[nowIndex] = nowSelect
          this.node.refresh = false
          this.$nextTick(() => {
            this.node.refresh = true
          })
        }
      })
    },
    removeNode (item, index) {
      for (let i = 0, len = this.checkList.length; i < len; i++) {
        if (item.url === this.checkList[i]) {
          this.checkList.splice(i, 1)
          break
        }
      }
      this.node.select.splice(index, 1)
    },
    getAllEnode () {
      let arr = []
      for (let obj of this.node.select) {
        arr.push(this.getEnode(obj.url))
      }
      this.createEnodeArr = [{
        name: 'Current Node',
        url: this.serverRPC,
        enode: this.eNode,
        state: 1,
        initiate: 1
      }]
      for (let i = 0, len = this.node.select.length; i < len; i++) {
        if (!this.node.select[i].state) {
          this.eDialog.confirm = false
          this.msgError(this.node.select[i].name + this.$t('error').err_9)
          this.loading.confirm = false
          return
        }
        let obj = {
          name: this.node.select[i].name,
          url: this.node.select[i].url,
          enode: this.node.select[i].value,
          initiate: 0,
          state: this.node.select[i].state,
        }
        // console.log(this.node.select[i].state)
        this.createEnodeArr.push(obj)
      }
      this.loading.confirm = false
    },
    submitForm () {
      // console.log(this.node.select)
      if (this.node.select <= 0 || this.node.select < this.node.min || this.node.select.length < this.node.max) {
        this.msgError(this.$t('error').err_12)
      } else {
        this.eDialog.confirm = true
        this.loading.confirm = true
        this.getAllEnode()
      }
    },
    createGroup () {
      let arr = []
      for (let obj of this.createEnodeArr) {
        arr.push(obj.enode)
      }
      // console.log(arr)
      this.createAndGetGid(this.mode.select, arr)
    },
    saveDB (key) {
      let data = {
        key: key,
        kId: this.address,
        gId: this.gID,
        mode: this.mode.select,
        nonce: Number(this.dataPage.nonce),
        member: [{
          eNode: this.eNode,
          initiate: 1,
        }]
      }
      for (let obj of this.createEnodeArr) {
        if (this.eNode === obj.enode) continue
        let obj1 = {
          eNode: obj.enode,
          initiate: 0,
        }
        data.member.push(obj1)
      }
      if (this.networkMode) {
        this.$socket.emit('PersonAccountsAdd', data)
      } else {
        this.$db.AddPersonAccounts(data)
      }
    },
    changeMode () {
      let modeArr = this.mode.select.split('/')
      this.node.min = Number(modeArr[0]) - 1
      this.node.max = Number(modeArr[1]) - 1
      this.node.select = []
      this.checkList = []
    },
  }
}
</script>