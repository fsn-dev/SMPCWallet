<template>
  <div class="boxConntent1 container pt-30 relative">
    <div class="friend-serch flex-sc">
      <el-input :placeholder="$t('tip').searchTip" size="mini" v-model="searchVal" @keyup.enter.native="enterSearch">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="searchFrinds"></i>
      </el-input>
      <span class="blue-txt ml-10" v-if="!isListOrSerch" @click="backFriendList">{{$t('btn').backFriend}}</span>
    </div>
    <div class="friend-list" v-if="viewList.length > 0">
      <ul>
        <li class="item" v-for="(item, index) in viewList" :key="index">
          <div class="flex-bc">
            <div class="flex-sc">
              <div class="header">
                <img :src="item.img">
              </div>
              <span class="font12">{{item.unIP}}</span>
            </div>
            <div>
              <span class="blue-txt" @click="openDelFriend(item)" v-if="isListOrSerch">{{$t('action').delete}}</span>
              <span class="blue-txt" @click="openAddFriend(item)" v-else>{{$t('btn').add}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="WW100 flex-c H90 color_99" v-else>
      Null
    </div>

    <el-dialog :title="$t('tip').name" :visible.sync="eDialog.del" width="30%" center>
      <p class="center">{{$t('tip').deleteFriend}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="delFriend">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('tip').name" :visible.sync="eDialog.add" width="30%" center>
      <p class="center">{{$t('tip').addFriend}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalClick">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="addFriend">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.blue-txt {
  font-size: 12px;color: #2762E0;cursor: pointer;
}
.friend-serch {
  width: 100%;padding: 5px 10px;background: rgba(0,0,0,.06);
  .el-input {
    width: 240px;
    .el-input__inner {
      border-radius: 15px;
    }
  }
}
.friend-list {
  .item {
    width: 100%;padding: 12px 0;color: #999;border-bottom: 1px solid rgba(221, 221, 221, 0.801);
    .header {
      width: 30px;height: 30px;margin-right:10px;
      img {
        width: 100%;height: 100%;display: block;
      }
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
import {nodeDatas, nodeSockets, nodeMethods} from '@/assets/js/pages/node/index.js'
export default {
  name: 'social',
  data () {
    return {
      ...nodeDatas,
      searchVal: '',
      isListOrSerch: true,
      viewList: [],
      searchList: [],
      friendList: [],
      eDialog: {
        del: false,
        add: false
      },
      addObj: {},
      delObj: {},
    }
  },
  computed: {
    ...computedPub,
  },
  sockets: {
    ...nodeSockets,
    UserFriendFind (res) {
      console.log(res)
      this.viewList = []
      if (res.msg ='Success') {
        for (let obj of res.info) {
          obj.img = this.$$.createImg(obj.address)
          this.viewList.push(obj)
        }
        console.log(this.viewList)
        // this.viewList = res.info
      }
    },
    UserEnodeSearch (res) {
      console.log(res)
      this.viewList = []
      if (res.msg === 'Success') {
        for (let obj of res.info) {
          obj.img = this.$$.createImg(obj.address)
          this.viewList.push(obj)
        }
        console.log(this.viewList)
        // this.viewList = res.info
      } else {
        this.msgWarning(this.$t('warn').w_25)
      }
    },
    UserFriendAdd (res) {
      console.log(res)
      if (res.msg === 'Success') {
        this.msgSuccess(this.$t('success').s_8)
      } else {
        this.msgError(res.error)
      }
      this.modalClick()
      this.init()
    },
    UserFriendRemove (res) {
      console.log(res)
      if (res.msg === 'Success') {
        this.msgSuccess(this.$t('success').s_5)
      } else {
        this.msgError(res.error)
      }
      this.modalClick()
      this.init()
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    ...nodeMethods,
    init () {
      this.getFriends()
      this.getNetUrl()
    },
    modalClick () {
      this.eDialog.add = false
      this.eDialog.del = false
      this.delObj = {}
      this.addObj = {}
    },
    backFriendList () {
      this.searchVal = ''
      this.getFriends()
    },
    getFriends () {
      this.isListOrSerch = true
      this.$socket.emit('UserFriendFind', {address: this.address})
    },
    enterSearch (e) {
      if (e.which === 13) {
        this.searchFrinds()
      }
    },
    searchFrinds () {
      this.isListOrSerch = false
      this.$socket.emit('UserEnodeSearch', {searchVal: this.searchVal})
    },
    openAddFriend (item) {
      this.addObj = item
      this.eDialog.add = true
    },
    addFriend () {
      let ipName = this.serverRPC
      for (let obj of this.netUrlArr) {
        if (this.serverRPC === obj.url) {
          ipName = obj.name
          break
        }
      }
      if (this.addObj .unIP === (this.token + '@' + ipName)) {
        this.msgError(this.$t('error').err_17)
        this.modalClick()
        return
      }
      this.$socket.emit('UserFriendAdd', {
        username: this.token,
        address: this.address,
        ip: this.serverRPC,
        unIP: this.addObj .unIP,
      })
    },
    openDelFriend (item) {
      this.delObj = item
      this.eDialog.del = true
    },
    delFriend () {
      this.$socket.emit('UserFriendRemove', {
        address: this.address,
        unIP: this.delObj.unIP,
      })
    }
  }
}
</script>