
export default {
  allCoinsList () {
    let allCoins = [
      { coinType: 'BTC', address: '', balance: '', isOpen: 1},
      { coinType: 'ETH', address: '', balance: '', isOpen: 1},
      { coinType: 'FSN', address: '', balance: '', isOpen: 1},
      { coinType: 'XRP', address: '', balance: '', isOpen: 1},
      { coinType: 'ERC20USDT', address: '', balance: '', isOpen: 1},
      { coinType: 'ERC20RMBT', address: '', balance: '', isOpen: 1},
      { coinType: 'BCH', address: '', balance: '', isOpen: 1},
      { coinType: 'BNB', address: '', balance: '', isOpen: 1},
      // { coinType: 'ERC20BNB', address: '', balance: '', isOpen: 1},
      { coinType: 'TRX', address: '', balance: '', isOpen: 1},
      
      // { coinType: 'ATOM', address: '', balance: '', isOpen: 1},
      // { coinType: 'ERC20GUSD', address: '', balance: '', isOpen: 1},
      // { coinType: 'ERC20MKR', address: '', balance: '', isOpen: 1},
      // { coinType: 'ERC20HT', address: '', balance: '', isOpen: 1},
      // { coinType: 'ERC20BNT', address: '', balance: '', isOpen: 1},
    ]
    return allCoins
  },
  formatAccountCoins (res, accountType, otherObj) {
    otherObj = otherObj ? otherObj : {}
    let arr = res, coinList = []
    let coinObj = {}
    for (let obj of arr) {
      coinObj[obj.Cointype] = {
        coinType: obj.Cointype,
        balance: obj.Balance,
        address: obj.DcrmAddr
      }
    }
    let allCoins = this.allCoinsList()
    for (let obj of allCoins) {
      let address =  '', balance = 0, coinTypeObj = this.$$.cutERC20(obj.coinType)
      if (!coinObj[obj.coinType] && coinObj['ETH'] && coinObj['ETH'].address) {
        address = coinObj['ETH'].address
      } else if (coinObj[obj.coinType] && coinObj[obj.coinType].address) {
        address = coinObj[obj.coinType].address
        balance = coinObj[obj.coinType].balance
      }
      let obj1 = {
        ...otherObj,
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