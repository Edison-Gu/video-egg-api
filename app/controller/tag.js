/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 11:01:23
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-23 19:33:31
 * @Descripttion: 
 */
const Controller = require('egg').Controller

class TagController extends Controller {
  async createTag() {
    const { ctx, ctx: { query, service } } = this
    try {
      // const add = new ctx.model.tag_list
      const res = await service.tag.add()
    } catch (error) {
      console.log('----error', error)
    } finally {
      ctx.body = {
        code: 1,
        data: null,
        message: 'success'
      }
    }
  }
}

module.exports = TagController