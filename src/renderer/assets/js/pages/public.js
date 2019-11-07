export const computedPub = {
  address () {
    if (!this.$store.state.address && this.$$.getCookies('address')) {
      this.$store.commit('storeAddress', this.$$.getCookies('address'))
    }
    return this.$store.state.address || this.$$.getCookies('address')
  }
}