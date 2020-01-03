<template>
  <div class="boxConntent1 container flex-bc pt-20 pb-20">
    <div class="s-list-box">
      <ul>
        <li class="item" :class="navActive === 0 ? 'active' : ''" @click="toUrl('/set')">{{$t('title').netSet}}</li>
        <li class="item" :class="navActive === 1 ? 'active' : ''" @click="toUrl('/set/groupSet')">组设置</li>
      </ul>
    </div>
    <div class="s-content-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.s-list-box {
  width: 30%;max-width: 300px;min-height: 200px;height: 100%;padding: size(0) 0;overflow: auto;border:size(1) solid #f2f2f2;
  .item {
    width: 100%; cursor: pointer;padding: size(8) size(12);color:$color-gray;
    &:hover{
      background: #c7c6c6;
    }
    &.active {
      background: #e6e5e5;
    }
  }
}
.s-content-box {
  width: 100%;height: 100%;
}

.night {
  .s-list-box {
    border-right:size(1) solid $night-line-color;
    .item {
      color: $night-text-color;
      &:hover{
        background: $night-line-color;
      }
      &.active {
        background: $night-line-color;
      }
    }
  }
}
</style>

<script>
export default {
  name: '',
  data () {
    return {
      navActive: 0
    }
  },
  watch: {
    '$route' (cur) {
      this.setNavBg()
    },
  },
  mounted () {
    this.setNavBg()
  },
  methods: {
    setNavBg () {
      let path = this.$route.path
      console.log(path)
      if (path === '/set') {
        this.navActive = 0
      } else if (path === '/set/groupSet') {
        this.navActive = 1
      }
    }
  }
}
</script>