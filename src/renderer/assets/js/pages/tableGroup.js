export const tData = {
  tableData: [],
  tableLoading: false,
  pageInfo: {
    pageNum: 1,
    total: 0,
    pageSize: 20,
  },
}

export const tMethods = {
  prevClick () {
    this.pageInfo --
    this.getHistory()
  },
  nextClick () {
    this.pageInfo ++
    this.getHistory()
  },
}

