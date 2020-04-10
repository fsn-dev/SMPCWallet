<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: '/account' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').groupSet}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-collapse accordion>
      <el-collapse-item v-for="(item, index) in getGroup" :key="index">
        <template slot="title">
          <p class="WW80 ellipsis" :title="item.Gid">{{item.name ? item.name : item.Gid}}</p>
        </template>
        <div>
          <ul class="e-list">
            <li class="flex-bc relative pb-10">
              <p class="WW80 ellipsis" :title="item.Gid"><b>ID：</b>{{item.Gid}}</p>
              <el-button size="mini" type="primary" class="" @click="openEditPage(item)">{{$t('btn').setName}}</el-button>
            </li>
            <li v-for="(e, i) in item.Enodes" :key="i" class="item">{{e}}</li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog :title="$t('btn').setName" :visible.sync="eDialog.setName">
      <el-form>
        <el-form-item :label="$t('label').aliases">
          <el-input v-model="gName" clearable></el-input>
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
.n-net-btn {
  position: absolute;top:-8px;right: 0;
}
.e-list {
  width: 100%;padding: 0 size(15);
  .item {
    width: 100%;word-break: break-all;border-top: 1px solid #ddd;padding: size(5) size(8);
    &:last-child {
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      getGroup: [],
      eDialog: {
        setName: false
      },
      gName: '',
      selectionGinfo: ''
    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {
    this.getGroupData()
  },
  methods: {
    getGroupData () {
      this.$$.getGroup().then(res => {
        console.log(res)
        this.getGroup = []
        let arr = res.info ? res.info : []
        for (let i = 0, len = arr.length; i< len; i++) {
          arr[i].name = arr[i].name ? arr[i].name : arr[i].Gid
          this.getGroup.push(arr[i])
          this.getGName(arr[i], i)
        }
      }).catch(err => {
        console.log(err)
        this.msgError(err.error)
      })
    },
    getGName (item, i) {
      this.$db.findGroup({gId: item.Gid, address: this.address,}).then(res => {
        // console.log(res)
        if (res.length > 0) {
          this.getGroup[i].name = res[0].name
        }
      })
    },
    openEditPage (item) {
      this.eDialog.setName = true
      this.selectionGinfo = item
      this.gName = item.name
    },
    editGroup () {
      this.$db.updateGroup({
        gId: this.selectionGinfo.Gid,
        address: this.address,
        name: this.gName
      }).then(res => {
        // console.log(res)
        this.eDialog.setName = false
        this.msgSuccess(this.$t('success').s_8)
        this.getGroupData()
      })
    }
  }
}
</script>