const coins = [
  {
    name: 'getAddr',
    call: 'coins_getAddr',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'getTransactionInfo',
    call: 'coins_getTransactionInfo',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'buildUnsignedTransaction',
    call: 'coins_buildUnsignedTransaction',
    params: 6,
    inputFormatter: [null, null, null, null, null, null],
    outputFormatter: null
  },
  {
    name: 'makeSignedTransaction',
    call: 'coins_makeSignedTransaction',
    params: 3,
    inputFormatter: [null, null, null],
    outputFormatter: null
  },
  {
    name: 'submitTransaction',
    call: 'coins_submitTransaction',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'getDefaultFee',
    call: 'coins_getDefaultFee',
    params: 1,
    inputFormatter: [null],
    outputFormatter: null
  },
  {
    name: 'getAddressBalance',
    call: 'coins_getAddressBalance',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'isToken',
    call: 'coins_isToken',
    params: 1,
    inputFormatter: [null],
    outputFormatter: null
  },
]

export default coins