<template>
  <div class="logoImg flex-sc cursorP" @click="goHome" :title="$$.config.AppName + (token ? '--' + token : '')">
    <img src="@etc/img/logo/logo.svg" class="logoImgVisibleLg">
    <p class="appTitle ml-10 flex-c font18"><span>SMPC</span> Wallet</p>
    <span class="color_red font12" v-if="!$$.config.versionType" style="white-space:nowrap;">（{{$t('label').versionTest}}）</span>
  </div>
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