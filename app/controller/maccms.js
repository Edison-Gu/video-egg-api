const Controller = require('egg').Controller;
const { cjBody } = require('../utils/common')

class CmsController extends Controller {
  async getcj() {
    const { ctx, ctx: { query } } = this
    const { url = '' } = query
    let paramsStr = ''
    for (const key in query) {
      if (key !== 'url') {
        paramsStr += `${key}=${query[key]}&`
      }
    }
    const { status, data } = await this.ctx.curl(`${url}?${paramsStr}`, { timeout: 10000 })
    console.log('----status', status)
    if (status === 200) {
      ctx.body = cjBody(data)
    }
  }
}

module.exports = CmsController;
