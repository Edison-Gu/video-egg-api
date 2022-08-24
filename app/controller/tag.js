/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 11:01:23
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-24 23:42:29
 * @Descripttion: 
 */
const Controller = require('egg').Controller

class TagController extends Controller {
  async getTagList() {
    const { ctx, ctx: { service } } = this
    const res = await service.tag.getTag()
    if (res) {
      ctx.body = {
        code: 1,
        data: res,
        message: 'success',
      }
    }
  }
  async createTag() {
    const { ctx, ctx: { service, request: { body: { tagName } } } } = this
    if (!tagName) throw 'missing parameters'
    const res = await service.tag.add()
    if (res) {
      ctx.body = {
        code: 1,
        data: res,
        message: 'success',
      }
    }
  }
}

module.exports = TagController