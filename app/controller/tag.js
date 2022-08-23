/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 11:01:23
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-23 20:24:25
 * @Descripttion: 
 */
const Controller = require('egg').Controller

class TagController extends Controller {
  async createTag() {
    const { ctx, ctx: { service } } = this
    const res = await service.tag.add()
    if (res) {
      ctx.body = {
        code: 1,
        data: null,
        message: 'success',
      }
    }
  }
}

module.exports = TagController