const accounts = [
  {
    name: 'getAccounts',
    call: 'dcrm_getAccounts',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'getAccountsBalance',
    call: 'dcrm_getAccountsBalance',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'getBalance',
    call: 'dcrm_getBalance',
    params: 3,
    inputFormatter: [null, null, null],
    outputFormatter: null
  },
]

export default accounts