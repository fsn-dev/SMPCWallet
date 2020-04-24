<template>
  <el-tooltip placement="top" :open-delay="1000">
    <div slot="content">
      <p class="flex-sc"><span class="flex-ec mr-5 W40">App:</span> {{$$.config.AppName}}</p>
      <p class="mt-5 flex-sc" v-if="token"><span class="flex-ec mr-5 W40">User:</span> {{token}}</p>
      <p class="mt-5 flex-sc"><span class="flex-ec mr-5 W40">Node:</span> {{serverRPC}}</p>
      <!-- <p class="mt-5 flex-sc"><span class="flex-ec mr-5 W40">UNIP:</span> {{token + '@' + serverRPCname}}</p> -->
      <p class="mt-5 flex-sc"><span class="flex-ec mr-5 W40">Mode:</span> {{networkMode ? $t('state').on : $t('state').off}}</p>
      <p class="mt-5 flex-sc" v-if="email"><span class="flex-ec mr-5 W40">Email:</span> {{email}}</p>
      <p class="mt-5 flex-sc" v-if="$$.config.env === 'dev'"><span class="flex-ec mr-5 W40">ENV:</span>{{$t('label').versionTest}}</p>
    </div>
    <!-- <div class="logoImg flex-sc cursorP" @click="goHome" :title="$$.config.AppName + (token ? '--' + token : '')"> -->
    <div class="logoImg flex-sc cursorP" @click="goHome">
      <img src="@/assets/img/logo/logo.svg" class="logoImgVisibleLg">
      <p class="appTitle ml-10 flex-c font18"><span>SMPC</span> Wallet</p>
      <span class="color_red font12" v-if="$$.config.env === 'dev'" style="white-space:nowrap;">（{{$t('label').versionTest}}）</span>
    </div>
  </el-tooltip>
</template>

<style lang="scss" scoped>
$logoH: size(40);
.logoImg {
  width: auto;height: $logoH;padding:0;
  img {
    height: $logoH;display: block;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'logo',
  data () {
    return {

    }
  },
  computed: {
    ...computedPub
  },
  mounted () {

  },
  methods: {
    goHome () {
      // let url = this.token ? (Number(this.accountType) ? '/person' : '/group') : '/'
      let url = '/account'
      // this.closeDrawer()
      this.$emit('click-logo')
      this.toUrl(url)
    }
  }
}
</script>