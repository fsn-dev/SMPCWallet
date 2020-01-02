<template>
  <div class="logoImg flex-sc cursorP" @click="goHome">
    <img src="@etc/img/logo/logo.svg" class="logoImgVisibleLg">
    <p class="appTitle ml-10 flex-c font18"><span>SMPC</span> Wallet</p>
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
      let url = this.token ? (Number(this.safeMode) ? '/person' : '/group') : '/'
      // this.closeDrawer()
      this.$emit('click-logo')
      this.toUrl(url)
    }
  }
}
</script>