export const computedPub = {
  address () {
    if (!this.$store.state.address && this.$$.getCookies(this.$$.config.cookies.address)) {
      this.$store.commit('storeAddress', this.$$.getCookies(this.$$.config.cookies.address))
    }
    return this.$store.state.address || this.$$.getCookies(this.$$.config.cookies.address)
  }
} 