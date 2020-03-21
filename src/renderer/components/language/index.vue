<template>
  <div>
    <div class="header-top-lang">
      <el-select v-model="lang" size="mini" @change="changLanguage">
        <el-option v-for="item in languageOption" :key="item.value" :label="item.label" :value="item.value" >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<style lang="scss">
.header-top-lang {
  width: 80px;
  .el-input__inner{
    border:none;padding-left: 0;background: none;color: $color-gray-sm;
  }
}
</style>

<script>
import {computedPub} from '@/assets/js/pages/public'
export default {
  name: 'language',
  data () {
    return {
      lang: this.$i18n.locale,
      languageOption: [
        {value: 'en-US', label: 'English'},
        {value: 'zh-CN', label: '中文简体'}
      ],
    }
  },
  watch: {
    language () {
      this.lang = this.language
    }
  },
  computed: {
    ...computedPub
  },
  mounted () {
    // initMenu(this)
  },
  methods: {
    changLanguage (type) {
      if (type) {
        this.lang = type
      }
      this.$i18n.locale = this.lang
      this.$store.commit('setLanguage', {info: this.lang})
      this.$emit('changeLang')
      // initMenu(this)
      // this.reload()
    }
  }
}
</script>
