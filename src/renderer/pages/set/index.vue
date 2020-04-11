<template>
  <div class="boxConntent1 container relative set-box">
    <div class="s-list-box">
      <ul>
        <!-- <li class="item" :class="navActive === 0 ? 'active' : ''" @click="toUrl('/set')">{{$t('title').netSet}}</li>
        <li class="item" :class="navActive === 1 ? 'active' : ''" @click="toUrl('/set/groupSet')">{{$t('title').groupSet}}</li>
        <li class="item" :class="navActive === 2 ? 'active' : ''" @click="toUrl('/set/gAccount')">{{$t('title').gAccountSet}}</li>
        <li class="item" :class="navActive === 3 ? 'active' : ''" @click="toUrl('/set/release')">{{$t('title').releaseNode}}</li> -->
        <li
          class="item"
          v-for="(item, index) in navArr" :key="index"
          :class="navActive === index ? 'active' : ''"
          @click="toUrl(item.url)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="s-content-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$lw: size(280);
$ptb: size(20);
.set-box {
  padding: $ptb size(15) $ptb $lw;
}
.s-list-box {
  width: $lw;min-height: 200px;overflow: auto;border:size(1) solid #f2f2f2;position:absolute;top:$ptb;left:0;bottom:$ptb;
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
      navActive: 0,
      navArr: []
    }
  },
  watch: {
    '$route' (cur) {
      this.setNavBg()
    },
  },
  created () {
    this.navArr = [
      {url: '/set', name: this.$t('title').netSet},
      {url: '/set/groupSet', name: this.$t('title').groupSet},
      {url: '/set/gAccount', name: this.$t('title').gAccountSet},
      {url: '/set/release', name: this.$t('title').releaseNode},
    ]
  },
  mounted () {
    this.setNavBg()
  },
  methods: {
    setNavBg () {
      let path = this.$route.path
      // console.log(path)
      for (let i = 0, len = this.navArr.length; i < len; i ++) {
        let item = this.navArr[i]
        if (item.url === path) {
          this.navActive = i
          break
        }
      }
    }
  }
}
</script>