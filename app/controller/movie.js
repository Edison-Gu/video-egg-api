/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-20 23:03:42
 * @Descripttion: 
 */
const Controller = require('egg').Controller;
const { ctxBody } = require('../utils/common')

class MovieController extends Controller {
  async getMovieList() {
    const { ctx, ctx: { query, service } } = this
    let list = null
    let total = 0
    try {
      let { pageNo = 1, pageSize = 20 } = query
      total = await service.movie.getMovieTotal()
      const findQuery = {}
      list = await service.movie.getMovieList({findQuery, params: { pageNo, pageSize }})
    } catch (error) {
      console.log('----error', error)
    } finally {
      ctx.body = ctxBody({list, custom: { total }})
      return list
    }
  }
}

module.exports = MovieController;