<template>
  <div class="d-bg-box">
    <div class="d-relative">
      <div class="d-bg cursorP" :class="closeFlag ? 'd-bg-leave' : 'd-bg-enter'" @click="closeDrawer"></div>
      <div class="d-content" :class="closeFlag ? 'd-content-leave' : 'd-content-enter'">
        <div class="d-relative d-content-bg" :style="isShowLogo ? '' : 'padding-top:20px;'">
          <logo v-if="isShowLogo" @click-logo="closeDrawer"></logo>
          <div class="d-back" v-if="isShowLogo"> <span @click="closeDrawer"><i class="el-icon-arrow-left"></i>{{$t('btn').back}}</span></div>
          <div class="d-relative d-content-info" style="overflow:auto;">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './scss/index';
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'drawer',
  props: {
    isShowLogo: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      closeFlag: false
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
  },
  methods: {
    closeDrawer () {
      this.closeFlag = true
      setTimeout(() => {
        this.$emit('input', false)
        this.$emit('on-close')
      }, 400)
    },
    // goHome () {
    //   let url = this.token ? (Number(this.safeMode) ? '/person' : '/group') : '/'
    //   this.closeDrawer()
    //   this.toUrl(url)
    // }
  }
}
</script>
