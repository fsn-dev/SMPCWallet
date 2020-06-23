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
  getAllAccount () {
    return new Promise(resolve => {
      let sAccount = this.$store.state.allAccount
      if (
        sAccount.timestamp && 
        Date.now() - sAccount.timestamp < (1000 * 60 * 15) &&
        sAccount.list && 
        sAccount.list.length > 0
      ) {
        console.log(sAccount.list)
        resolve(sAccount.list)
      } else {
        this.getAllAccountsCoins().then(res => {
          console.log(res)
          resolve(res)
        })
      }
    })
  },
  getAllAccountList () {
    return new Promise(resolve => {
      let arr = [
        { p1: 'dcrm', p2: 'getAccounts', p3: [this.address, '0'] },
        { p1: 'dcrm', p2: 'getAccounts', p3: [this.address, '1'] },
      ]
      this.$$.batchRequest(arr).then(res => {
        // console.log(res)
        let arr = []
        let groupArr = [], personArr = []
        if (res[0] && res[0].Status) {
          groupArr = this.formatAccount(res[0], 0)
          arr.push(groupArr)
        }
        if (res[1] && res[1].Status) {
          // console.log(this.formatAccount(res[1], 1))
          personArr = this.formatAccount(res[1], 1)
          arr.push(personArr)
        }
        Promise.all(arr).then(data => {
          let allArr = []
          for (let obj of data) {
            allArr.push(...obj)
          }
          allArr = allArr.sort(this.$$.bigToSmallSort('timestamp'))
          resolve(allArr)
        })
      })
    })
  },
  async formatAccount (res, type) {
    let arr = [], arr1 = [], arr2 = []
    if (res.Status !== 'Error') {
      arr = res.Data.result && res.Data.result.Group ? res.Data.result.Group : []
    }
    for (let obj1 of arr) {
      for (let obj2 of obj1.Accounts) {
        if (!arr1.includes(obj2.PubKey)) {
          // console.log(obj2)
          let pubName = await this.getGName(obj2)
          let obj3 = {
            publicKey: obj2.PubKey,
            gID: obj1.GroupID,
            mode: obj2.ThresHold,
            name: pubName && pubName.length > 0 ? pubName[0].name : obj2.PubKey.substr(2, 6),
            timestamp: obj2.TimeStamp,
            accountType: type,
          }
          arr2.push(obj3)
          arr1.push(obj2.PubKey)
        }
      }
    }
    return arr2
  },
  getGName (item) {
    return this.$db.findGaccount({publicKey: item.PubKey, address: this.address})
  },
  getAllAccountsCoins () {
    return new Promise(resolve => {
      this.getAllAccountList().then(res => {
        // console.log(res)
        let arr = []
        if (res.length <= 0) {
          resolve([])
        }
        for (let obj of res) {
          arr.push({ p1: 'dcrm', p2: 'getAccountsBalance', p3: [obj.publicKey, this.address] })
        }
        this.$$.batchRequest(arr).then(res1 => {
          // console.log(res1)
          for (let i = 0, len = res1.length; i < len; i++) {
            let cbData = res1[i], arr1 = []
            if (typeof cbData === 'string') {
              cbData = JSON.parse(cbData)
            }
            if (cbData.Status !== 'Error') {
              arr1 = cbData.Data.result.Balances
            }
            res[i].coinArr = this.formatAccountCoins(arr1)
          }
          this.$store.commit('setAllAccount', res)
          resolve(res)
        })
      })
    })
  },
  formatAccountCoins (res) {
    let arr = res, coinList = []
    let coinObj = {}
    for (let obj of arr) {
      coinObj[obj.Cointype] = {
        coinType: obj.Cointype,
        address: obj.DcrmAddr,
        balance: obj.Balance,
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
      // console.log(coinTypeObj)
      let obj1 = {
        coinType: obj.coinType,
        balance: balance,
        address: address,
        isOpen: obj.isOpen,
        logo: this.$$.setDollar(coinTypeObj.coinType) ? this.$$.setDollar(coinTypeObj.coinType).logo : '',
      }
      coinList.push(obj1)
    }
    // console.log(coinList)
    return coinList
  }
}