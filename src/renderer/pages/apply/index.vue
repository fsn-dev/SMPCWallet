<template>
  <div class="boxConntent1 container">
    <!-- <div class="color_99">Coming soon!</div> -->
    <div class="banner-box">
      <el-carousel height="472px">
        <el-carousel-item>
          <div class="banner-item">
            <div class="img flex-ec"><img src="~@/assets/img/apply/bannerBg.png"></div>
            <div class="content">
              <p class="p p1">{{$t('title').bestApply}}</p>
              <h1 class="h1">{{$t('title').CrossChainTitle}}</h1>
              <p class="p p2">{{$t('tip').CrossChainTip}}</p>
              <el-button type="primary" class="btn-primary btn-install" @click="comingSoon">{{$t('btn').lookDtil}}</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="apply-list-box">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in applyList" :key="index">
          <div class="apply-list-item">
            <div class="apply-list-bg"><img :src="item.bg"></div>
            <div class="apply-list-cont">
              <h3 class="h3">{{item.title}}</h3>
              <ul class="list">
                <li v-for="(items, indexs) in item.list" :key="indexs" class="item flex-sc" :title="items.cont">
                  <i class="round"></i>
                  <span class="span ellipsis">{{items.cont}}</span>
                </li>
              </ul>
              <el-button type="primary" class="btn-primary" @click="comingSoon">{{$t('btn').lookDtil}}</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss">
.banner-box {
  margin-top: 30px;
  .banner-item {
    width: 100%;height: 100%;position: relative;
    .img {
      width: 100%;height: 100%;position:absolute;top:0;right:0;bottom:0;left:0;z-index:0;
      img {
        height: 100%;
      }
    }
    .content {
      width: 100%;height: 100%;position:absolute;top:0;right:0;bottom:0;left:0;padding: 10% 6%;
      .p {
        font-size: 20px;line-height: 30px;
      }
      .p1 {
        color: #2762E0;
      }
      .h1 {
        font-size:45px;color: #252525;line-height: 68px;
      }
      .p2 {
        color: #7F899F;
      }
      .btn-install {
        width: 318px;height: 58px;font-size: 20px;margin-top: 32px;
      }
    }
  }
}
.apply-list-box {
  width: 100%;margin-top:30px;
  .apply-list-item {
    width: 100%;height: 239px;position: relative;
    .apply-list-bg {
      width: 100%;height: 100%;position:absolute;top:0;right:0;bottom:0;left:0;
      img {
        width: 100%;height: 100%;display: block;
      }
    }
    .apply-list-cont {
      width: 100%;height: 100%;position:absolute;top:0;right:0;bottom:0;left:0;padding: 30px 20px;
      .h3 {
        font-size: 20px;line-height: 30px;color: #252525;
      }
      .list {
        height: 90px;margin:10px 5px;
        .item {
          font-size: 14px;color: #00143F;padding:3px 0;
          .round {
            width: 10px;height: 10px;border-radius: 100%;background: rgba(127,137,159,1);margin-right: 10px;
          }
          .span {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: 'apply',
  data () {
    return {
      applyList: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.init()
    }, 300)
  },
  methods: {
    init () {
      this.applyList = [
        {
          title: this.$t('tip').mBTC.title,
          list: [
            {cont: this.$t('tip').mBTC.d1},
            {cont: this.$t('tip').mBTC.d2},
            {cont: this.$t('tip').mBTC.d3},
          ],
          url: '',
          bg: require('@/assets/img/apply/mBTC.png')
        },
        {
          title: this.$t('tip').timelock.title,
          list: [
            {cont: this.$t('tip').timelock.d1},
            {cont: this.$t('tip').timelock.d2},
            {cont: this.$t('tip').timelock.d3},
          ],
          url: '',
          bg: require('@/assets/img/apply/timelock.png')
        },
        {
          title: this.$t('tip').DAO.title,
          list: [
            {cont: this.$t('tip').DAO.d1},
            {cont: this.$t('tip').DAO.d2},
            {cont: this.$t('tip').DAO.d3},
          ],
          url: '',
          bg: require('@/assets/img/apply/DAO.png')
        },
        {
          title: this.$t('tip').DEX.title,
          list: [
            {cont: this.$t('tip').DEX.d1},
            {cont: this.$t('tip').DEX.d2},
            {cont: this.$t('tip').DEX.d3},
          ],
          url: '',
          bg: require('@/assets/img/apply/DEX.png')
        },
      ]
    },
    comingSoon () {
      this.msgWarning('Coming soon!')
    }
  }
}
</script>