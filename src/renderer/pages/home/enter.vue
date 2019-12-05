<template>
  <div class="bg flex-c">
    <div class="e-box">
      <div class="line-block logo">
        <!-- <img :src="dayAndNight ? '~@etc/img/logo/logo-white.svg' : '~@etc/img/logo/logo-black.svg'"> -->
        <img src="@etc/img/logo/logo-white.svg" v-if="!dayAndNight">
        <img src="@etc/img/logo/logo-black.svg" v-else>
      </div>
      <h3 class="title" v-html="$t('title').walletTitle"></h3>
      <p class="tip" v-html="$t('tip').walletTip"></p>

      <w-button :ok="$t('btn').login" :cancel="$t('btn').register" @onOk="toUrl('login')" @onCancel="toUrl('register')" class="mt-50"></w-button>
      <el-input v-model="test" class="mt-30"></el-input>
    </div>
  </div>
</template>

<style lang="scss">
.e-box {
  text-align: center;
  .logo {
    height: size(100);
    img {
      height: 100%;
    }
  }
  .title {
    font-size: $text-lg;font-weight: bold;color:$color-black;line-height: size(48);margin: size(40) 0 size(0);
    span {
      color:$color-primary;
    }
  }
  .tip {
    font-size: $text-normal;color:$color-gray;line-height: size(21);
  }
}
.night {
  .e-box {
    .title {
      color: #fff;
    }
  }
}
</style>

<script>
import wButton from '@/components/btn/index'
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: '',
  data () {
    return {
      test: ''
    }
  },
  components: {wButton},
  computed: {
    ...computedPub
  },
  mounted () {
    this.test = this.$$.eNode
  },
  methods: {
    // test0 () {
    //   this.$store.commit('setAddress', {info: '457487s8fg'})
    // },
    test1 (data) {
      // alert(this.address)
      console.log(data)
      alert(123)
    }
  }
}
</script>