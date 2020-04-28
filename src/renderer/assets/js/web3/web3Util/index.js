import account from './account'
import getNonce from './getNonce'
import getStatus from './getStatus'
import group from './group'
import sendTxns from './sendTxns'
import tools from './tools'

export default {
  ...account,
  ...getNonce,
  ...getStatus,
  ...group,
  ...sendTxns,
  ...tools
}