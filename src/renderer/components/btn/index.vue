<template>
  <div>
    <div class="flex-c btn-box" :class="type ? 'btn-box1' : ''">
      <span class="btn flex-c left btn-primary" @click="onOk" :class="left ? '' : 'opacity4'">{{ok}}</span>
      <span class="btn flex-c right" @click="onCancel" :class="right ? '' : 'opacity4'">{{cancel}}</span>
      <div class="obliqueLine"></div>
    </div>
  </div>
</template>

<style lang="scss">
$btn-w: 240;
$btn-h: 45;
$offset: 15;
.btn-box {
  width: size($btn-w);position: relative;overflow:hidden;
  .btn {
    width: 50%;height: size($btn-h);font-size: $text-md;font-weight: 600;border-radius:size(3);cursor: pointer;
  }
  .left {
    padding-right: size($offset);
  }
  .right {
    border: size(1) solid $color-primary;color: $color-primary;padding-left: size($offset);
  }
  .obliqueLine {
    width: size($btn-h / 2);height: size($btn-h);position: absolute;background: #fff;transform: skew(-10deg);border-right: size(1) solid $color-primary;border-left: size(1) solid $color-primary;
  }
}
$btn-w1: 130;
$btn-h1: 28;
$offset1: 8;
.btn-box1 {
  width: size($btn-w1);
  .btn {
    height: size($btn-h1);font-size: $text-sm;color: #fff;
  }
  .left {
    padding-right: size($offset1);background: #67C23A;border:1px solid #67C23A;
    &:hover {
      background: #67C23A;border:1px solid #67C23A;
    }
  }
  .right {
    border: size(1) solid $color-primary;padding-left: size($offset1);background: #1b55d1;
  }
  .obliqueLine {
    width: size($btn-h1 / 2);height: size($btn-h1);border-right: size(1) solid transparent;border-left: size(1) solid transparent;
  }
}
.night {
  .btn-box {
    .obliqueLine {
      background: $night-bg-color;
    }
  }
}
</style>

<script>
export default {
  name: 'Button',
  props: {
    ok: {
      default: '确认'
    },
    cancel: {
      default: '取消'
    },
    type:  {
      default: 0
    },
    left: {
      default: true
    },
    right: {
      default: true
    }
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    onOk () {
      this.$emit('onOk', 123)
    },
    onCancel () {
      this.$emit('onCancel')
    }
  }
}
</script>
