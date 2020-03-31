import node from './node/index.js'
import set from './set/index.js'
import status from './status/index.js'
import user from './user/index.js'
import history from './history/index.js'

export default {
  ...node,
  ...set,
  ...status,
  ...user,
  ...history
}