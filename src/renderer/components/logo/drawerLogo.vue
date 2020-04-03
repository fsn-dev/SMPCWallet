<template>
  <el-tooltip placement="top" :open-delay="1000">
    <div slot="content">
      <p class="flex-sc"><span class="flex-ec mr-5 W40">App:</span> {{$$.config.AppName}}</p>
      <p class="mt-5 flex-sc" v-if="token"><span class="flex-ec mr-5 W40">User:</span> {{token}}</p>
      <p class="mt-5 flex-sc"><span class="flex-ec mr-5 W40">Mode:</span> {{networkMode ? $t('state').on : $t('state').off}}</p>
      <p class="mt-5 flex-sc"><span class="flex-ec mr-5 W40">Node:</span> {{serverRPC}}</p>
      <p class="mt-5 flex-sc" v-if="$$.config.env === 'dev'"><span class="flex-ec mr-5 W40">ENV:</span>{{$t('label').versionTest}}</p>
    </div>
    <div :title="$$.config.AppName + (token ? '--' + token : '')">
      <logo @click-logo="closeDrawer"></logo>
      <div class="d-back"> <span @click="closeDrawer"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</span></div>
    </div>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.d-back {
  width: 100%;height: size(40);line-height: size(40);color: $color-gray;cursor: pointer;font-weight: bold;margin-top: size(10);
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'drawerLogo',
  data () {
    return {

    }
  },
  computed: {
    ...computedPub
  },
  methods: {
    closeDrawer () {
      this.$emit('close-drawer')
    }
  }
}
</script>