<template>
  <div>
    <div class="flex-c btn-box">
      <span class="btn flex-c left" @click="onOk">{{ok}}</span>
      <span class="btn flex-c right" @click="onCancel">{{cancel}}</span>
      <div class="obliqueLine"></div>
    </div>
  </div>
</template>

<style lang="scss">
$btn-w: 240;
$btn-h: 45;
.btn-box {
  width: size($btn-w);position: relative;overflow:hidden;
  .btn {
    width: 50%;height: size(45);font-size: $text-md;font-weight: 600;border-radius:size(3);cursor: pointer;
  }
  .left {
    background: $color-primary;color: #fff;padding-right: size(15);
  }
  .right {
    border: size(1) solid $color-primary;color: $color-primary;padding-left: size(15);
  }
  .obliqueLine {
    width: size($btn-h / 2);height: size($btn-w);position: absolute;background: #fff;transform: skew(-10deg);border-right: size(1) solid $color-primary;border-left: size(1) solid $color-primary;
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
