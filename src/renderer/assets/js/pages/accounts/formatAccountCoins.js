let allCoins = [
  { coinType: 'BTC', address: '', balance: '', isOpen: 1},
  { coinType: 'ETH', address: '', balance: '', isOpen: 1},
  { coinType: 'USDT', address: '', balance: '', isOpen: 0},
  { coinType: 'FSN', address: '', balance: '', isOpen: 1},
  { coinType: 'RMBT', address: '', balance: '', isOpen: 0},
]

export default {
  formatAccountCoins (res, accountType) {
    let arr = res, coinList = []
    let coinObj = {}
    for (let obj of arr) {
      coinObj[obj.Cointype] = {
        coinType: obj.Cointype,
        balance: obj.Balance,
        address: obj.DcrmAddr
      }
    }
    for (let obj of allCoins) {
      let address =  '', balance = 0, coinTypeObj = this.$$.cutERC20(obj.coinType)
      if (!coinObj[obj.coinType] && coinObj['ETH'] && coinObj['ETH'].address) {
        address = coinObj['ETH'].address
      } else if (coinObj[obj.coinType] && coinObj[obj.coinType].address) {
        address = coinObj[obj.coinType].address
        balance = coinObj[obj.coinType].balance
      }
      let obj1 = {
        coinType: coinTypeObj.coinType,
        balance: balance,
        address: address,
        isOpen: obj.isOpen,
        logo: this.$$.setDollar(coinTypeObj.coinType) ? this.$$.setDollar(coinTypeObj.coinType).logo : '',
        isERC20: coinTypeObj.type,
        accountType: accountType
      }
      coinList.push(obj1)
    }
    // console.log(coinList)
    return coinList
  }
}