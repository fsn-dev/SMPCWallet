export const signMethods = {
  saveTxnsDB (key) {
    // let value = this.$$.toWei(this.rawTx.value, this.rawTx.coinType)
    let value = this.rawTx.value
    let data = {
      from: this.rawTx.from,
      to: this.rawTx.to,
      hash: '',
      value: value,
      nonce: this.dataPage.nonce,
      coinType: this.rawTx.coinType,
      status: 0,
      pubKey: this.rawTx.pubKey,
      key: key,
      mode: this.groupAccount[this.selectIndex].mode,
      gId: this.groupAccount[this.selectIndex].gID,
      data: this.rawTx.data,
      extendObj: {
        type: 'Contract',
        nonce: this.rawTx.nonce,
        gas: this.rawTx.gas,
        gasPrice: this.rawTx.gasPrice,
        network: this.$$.config.env,
        hash: this.rawTx.hash
      },
      accountType: '0'
    }
    // if (Number(this.accountType) === 1) {
    if (false) {
      data.kId = this.address
      data.eNode = this.eNode
    } else {
      data.gArr = [
        {eNode: this.eNode, nodeKey: this.$$.eNodeCut(this.eNode).key, kId: this.address, status: 5, timestamp: Date.now(), initiate: 1}
      ]
      // for (let obj of this.gMemberSelect) {
      //   if (obj === this.eNode) continue
      //   data.gArr.push({eNode: obj, nodeKey: this.$$.eNodeCut(obj).key, kId: '', status: 0, timestamp: '', initiate: 0})
      // }
    }
    console.log(data)
    // if (Number(this.accountType) === 1) {
    if (this.networkMode) {
      this.$socket.emit('GroupAddTxns', data)
    } else {
      this.$db.AddGroupTxns(data)
    }
    
  },
}