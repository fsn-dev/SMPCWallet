<template>
  <div class="WW100">
    <el-select v-model="mode.select" :placeholder="$t('warn').w_4" class="WW100" :size="size" @change="changeMode">
      <el-option :value="0" :label="$t('label').oneSelf"></el-option>
      <el-option v-for="(item, index) in mode.init" :key="index" :label="item.name + ' ' + $t('label').mode" :value="item.val"></el-option>
    </el-select>
    <div class="flex-bc" :class="size === 'mini' ? 'mt-5' : 'mt-20'" v-if="!mode.select">
      <el-input type="number" :size="size" step="1" min="1" v-model="mode.min" class="mr-10" :disabled="isReset" @blur="changeNum('min', 'max')"></el-input>
      /
      <el-input type="number" :size="size" step="1" min="1" v-model="mode.max" class="ml-10" :disabled="isReset" @blur="changeNum('max', 'min')"></el-input>
      <el-button type="success" :size="size" class="ml-10" v-if="isReset" @click="resetMode">{{$t('btn').restart}}</el-button>
      <el-button type="primary" :size="size" class="ml-10" v-else @click="setMode">{{$t('btn').set}}</el-button>
    </div>
  </div>
</template>

<style lang="scss">

</style>

<script>
export default {
  name: 'setMode',
  props: ['size'],
  data () {
    return {
      mode: {
        init: '',
        select: '',
        min: '',
        max: ''
      },
      isReset: false
    }
  },
  watch: {
  },
  mounted () {
    this.mode = {
      init: this.$$.mode,
      select: this.$$.config.initGroupMode
    }
  },
  methods: {
    changeNum (v1, v2) {
      if (typeof this.mode[v1] !== 'undefined' && this.mode[v1] !== '') {
        if (this.mode[v1].toString().indexOf('.') >= 0) {
          this.mode[v1] = parseInt(this.mode[v1])
        }
        if (this.mode[v1] < 0) {
          this.mode[v1] = -this.mode[v1]
        }
        if (this.mode.min <= this.mode.max) {
          this.changeMode()
        } else if (this.mode.max !== '' && typeof this.mode.max !== 'undefined') {
          this.mode.min = ''
        }
      } else {
        this.msgError(this.$t('warn').w_17)
      }
    },
    changeMode () {
      let _mode = ''
      if (this.mode.select) {
        _mode = this.mode.select
      } else if (!this.mode.select && this.mode.min && this.mode.max) {
        _mode = this.mode.min + '/' + this.mode.max
      }
      this.$emit('setMode', _mode)
    },
    setMode () {
      if (!this.mode.min || !this.mode.max) {
        this.msgError(this.$t('warn').w_17)
        return
      }
      if (Number(this.mode.min) > Number(this.mode.max)) {
        this.msgError(this.$t('warn').w_18)
        return
      }
      this.isReset = true
      this.changeMode()
    },
    resetMode () {
      this.isReset = false
      // this.mode.min = this.mode.max = ''
    }
  }
}
</script>