<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/account' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').gAccountSet}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ga-list-box">
      <ul class="ul" >
        <li v-for="(item, index) in gAccountList" :key="index" class="item">
          <el-divider content-position="left">{{item.name === item.publicKey ? $t('label').notSetUp : item.name}}</el-divider>
          <div class="flex-bc">
            <p class="pubkey" :title="item.publicKey">{{ item.publicKey }}</p>
            <el-button size="mini" type="primary" class="" @click="openEditPage(item)">{{$t('btn').setName}}</el-button>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog :title="$t('btn').setName" :visible.sync="eDialog.setName">
      <el-form>
        <el-form-item :label="$t('label').aliases">
          <el-input v-model="gAname" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eDialog.setName = false">{{$t('btn').cancel}}</el-button>
        <el-button type="primary" @click="editGroup">{{$t('btn').confirm}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.ga-list-box {
  width: 100%;padding: 0 size(15);
  .ul {
    padding-top: size(5);
    .item {
      width: 100%;
      .pubkey {
        width: 70%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: $color-gray;font-size: $text-normal;
      }
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'gAccount',
  data () {
    return {
      gAccountList: [],
      eDialog: {
        setName: false
      },
      gAname: '',
      selectionGinfo: ''
    }
  },
  computed: {
    ...computedPub,
  },
  watch: {
    accountType () {
      this.getAccountData()
    }
  },
  mounted () {
    this.getAccountData()
  },
  methods: {
    getAccountData () {
      this.$$.getAccounts(this.address, this.accountType).then(res => {
        console.log(res)
        this.gAccountList = []
        let arr = res.info ? res.info : [], arr1 = [], arr2 = []
        for (let obj1 of arr) {
          for (let obj2 of obj1.Accounts) {
            if (!arr1.includes(obj2)) {
              let obj3 = {
                publicKey: obj2.PubKey,
                gID: obj1.GroupID,
                name: obj2.PubKey
              }
              arr2.push(obj3)
              arr1.push(obj2)
            }
          }
        }
        // console.log(arr2)
        for (let i = 0, len = arr2.length; i < len; i++) {
          this.gAccountList.push(arr2[i])
          this.getAccountName(arr2[i], i)
        }
      }).catch(err => {
        if (err.error) {
          this.msgError(err.error)
        }
      })
    },
    getAccountName (item, i) {
      this.$db.findGaccount({publicKey: item.publicKey, address: this.address}).then(res => {
        console.log(res)
        if (res.length > 0) {
          this.gAccountList[i].name = res[0].name
        }
      })
    },
    openEditPage (item) {
      this.eDialog.setName = true
      this.selectionGinfo = item
      this.gAname = item.name
    },
    editGroup () {
      this.$db.updateGaccount({
        publicKey: this.selectionGinfo.publicKey,
        address: this.address,
        name: this.gAname
      }).then(res => {
        console.log(res)
        this.eDialog.setName = false
        this.msgSuccess(this.$t('success').s_8)
        this.getAccountData()
      })
    }
  }
}
</script>