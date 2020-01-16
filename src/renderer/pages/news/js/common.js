import {uodateStatus, findStatus, removeStatus} from '@/db/status'
export const methods = {
  getKeyStatus (key, i, type) {
    findStatus({
      key: key,
      type: 1
    }).then(res => {
      console.log(res)
      if (res.length > 0 && res[0].status) {
        this.newsList[i].status = 1
      } else {
        this.updateStaus(key, i, type)
      }
    })
  },
  updateStaus (key, i, type) {
    uodateStatus({
      key: key,
      type: 1,
      status: 0
    }).then(res => {
      console.log(res)
    })
  },
  async removeStatus (type) {
    let nowDate = Date.now()
    findStatus({}).then(res => {
      console.log(res)
      if (res.length > 0) {
        for (let obj of res) {
          if ((nowDate - obj.updatetime) > (1000 * 60 * 30)) {
            removeStatus({key: obj.key})
          }
        }
      }
    })
  },
}