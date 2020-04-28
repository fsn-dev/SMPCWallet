const p2p = [
  {
    name: 'getEnode',
    call: 'dcrm_getEnode',
    params: 0,
    inputFormatter: [],
    outputFormatter: null
  },
  {
    name: 'getEnodeStatus',
    call: 'dcrm_getEnodeStatus',
    params: 1,
    inputFormatter: [null],
    outputFormatter: null
  },
  {
    name: 'createSDKGroup',
    call: 'dcrm_createSDKGroup',
    params: 2,
    inputFormatter: [null, null],
    outputFormatter: null
  },
  {
    name: 'getSDKGroup',
    call: 'dcrm_getSDKGroup',
    params: 1,
    inputFormatter: [null],
    outputFormatter: null
  },
  {
    name: 'getGroupByID',
    call: 'dcrm_getGroupByID',
    params: 1,
    inputFormatter: [null],
    outputFormatter: null
  },
]
export default p2p