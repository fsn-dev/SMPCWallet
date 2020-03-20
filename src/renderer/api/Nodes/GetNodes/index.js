
import server from './server'
import local from './local'

function commonFn (that, url, params) {
  return new Promise((resolve, reject) => {
    if (that.$store.state.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      local(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

export default commonFn