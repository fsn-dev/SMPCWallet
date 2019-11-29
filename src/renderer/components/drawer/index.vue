<template>
  <div class="d-bg-box">
    <div class="d-relative">
      <div class="d-bg cursorP" @click="closeDrawer"></div>
      <!-- <div class="d-close flex-c" @click="closeDrawer"><i class="el-icon-close"></i></div> -->
      <div class="d-content">
        <div class="d-relative d-content-bg">
          <router-link :to="token ? (Number(this.safeMode) ? 'person' : 'group') : '/'" class="logoImg flex-sc">
            <img src="@etc/img/logo/logo.svg" class="logoImgVisibleLg">
            <p class="appTitle ml-10 flex-c font18"><span>SMPC</span> Wallet</p>
          </router-link>
          <div class="d-back" @click="closeDrawer"> &lt; Back</div>
          <div class="d-relative d-content-info" style="overflow:auto;">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$drawerW: 400;
$animationTime: 0.4s;
.d-relative {
  overflow: hidden;width:100%;height:100%;position: relative;
}
.d-bg-box {
  overflow: hidden;width:100%;height:100%;position: fixed;top:0;right:0;bottom:0;left: 0;z-index: 2002;
  .d-bg {
    width:100%;height:100%;background: rgba(0,0,0,.5);animation: drawerBg $animationTime;
  }
  .d-close {
    $closeSize: 30;
    width: size($closeSize);height: size($closeSize);position: absolute;top:0;right: size($drawerW);z-index: 2;background: rgba(255,255,255,.5);cursor:pointer;
  }
  .d-content {
    width: size($drawerW);height: 100%;background: #fff;position: absolute;top:0;bottom: 0;right: size(0);animation: drawerEnter $animationTime;overflow: auto;
    .d-content-bg {
      $topImgH: 60;
      $topBackH: 40;
      $plr: 25;
      padding-top: size($topImgH + $topBackH + 20);
      .logoImg {
        width: 100%;height: size($topImgH);position: absolute;top:0;left: 0;right:0;padding:size(10) size($plr);
        img {
          height: 100%;
        }
      }
      .d-back {
        width: 100%;height: size($topBackH);line-height: size($topBackH);padding: 0 size($plr);color: $color-gray;position: absolute;top:size($topImgH);left: 0;right:0;cursor: pointer;font-weight: bold;
      }
      .d-content-info {
        overflow: auto;padding: size(0) size($plr) size(20);
      }
    }
  }
}
@keyframes drawerBg {
  from {background: none;}
  to {background: rgba(0,0,0,.5);}
}
@keyframes drawerEnter {
  from {right: size(-$drawerW)}
  to {right: 0}
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'drawer',
  props: {

  },
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
    closeDrawer () {
      this.$emit('input', false)
      this.$emit('on-close')
    }
  }
}
</script>
