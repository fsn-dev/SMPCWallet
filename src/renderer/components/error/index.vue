<template>
  <div class="boxContent flex-c">
    <div class="error-box center">
      <h3 class="title">404</h3>
      <el-button @click="exit">Go Home</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-box {
  .title {
    font-size: size(100);color: $color-gray;line-height: size(150);
  }
}
</style>

<script>
export default {
  name: 'error',
  methods: {
    exit () {
      this.quitApp()
    }
  }
}
</script>