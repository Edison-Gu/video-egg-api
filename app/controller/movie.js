/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-28 18:35:16
 * @Descripttion: 
 */

const Controller = require('egg').Controller;
const { ctxBody } = require('../utils/common')

class MovieController extends Controller {
  async getHomeRecommend() {
    const { ctx, ctx: { service } } = this
    const resList = await Promise.all([service.movie.getMovieList({})])
    if (resList && resList.length) {
      ctx.body = ctxBody({ list: resList })
    }
  }
  async getMovieList() {
    const { ctx, ctx: { query, service } } = this
    let list = null
    let total = 0
    let findQuery = {}
    try {
      let { pageNo = 1, pageSize = 20, type } = query
      if (type) {
        findQuery.type = {
          $in: [type]
        }
      }
      total = await service.movie.getMovieTotal()
      list = await service.movie.getMovieList({findQuery, params: { pageNo, pageSize }})
    } catch (error) {
      console.log('----error', error)
    } finally {
      ctx.body = ctxBody({list, custom: { total }})
    }
  }
}

module.exports = MovieController;