/*
 * @Author: EdisonGu
 * @Date: 2022-09-01 19:30:17
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-01 19:46:47
 * @Descripttion: 
 */
const Controller = require('egg').Controller

class RecommendController extends Controller {
  async getRecommendList() {
    const { ctx, ctx: { service } } = this
    const res = await service.recommend.get()
    if (res) {
      ctx.body = {
        code: 1,
        data: res,
        message: 'success',
      }
    }
  }
  async createRecommend() {
    const { ctx, ctx: { service, request: { body: { recommendType, recommendName } } } } = this
    if (!recommendType || !recommendName) throw 'missing parameters'
    const res = await service.recommend.add()
    if (res) {
      ctx.body = {
        code: 1,
        data: res,
        message: 'success',
      }
    }
  }
}

module.exports = RecommendController