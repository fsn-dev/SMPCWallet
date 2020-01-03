<template>
  <div class="boxConntent1 container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mt-15 mb-25 relative">
      <el-breadcrumb-item :to="{ path: Number(safeMode) ? '/person' : '/group' }">{{$t('title').accountList}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('title').netSet}}</el-breadcrumb-item>
      <el-button size="mini" type="primary" class="n-net-btn" @click="eDialog.net = true">{{$t('btn').newBuild}}</el-button>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
.n-net-btn {
  position: absolute;top:-8px;right: 0;
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {

    }
  },
  computed: {
    ...computedPub,
  },
  mounted () {

  },
  methods: {
    
  }
}
</script>