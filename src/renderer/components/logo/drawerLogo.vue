<template>
  <div>
    <logo @click-logo="closeDrawer"></logo>
    <div class="d-back"> <span @click="closeDrawer"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</span></div>
  </div>
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