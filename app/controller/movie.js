/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-07 16:12:46
 * @Descripttion: 
 */

const Controller = require('egg').Controller;
const { ctxBody, objectBody } = require('../utils/common')

class MovieController extends Controller {
  /**
   * home recommend
   */
  async getHomeRecommend() {
    const { ctx, ctx: { service } } = this
    const tags = await service.tag.getTag()
    const resList = await Promise.all([
      // service.movie.getMovieList({
      //   findQuery: {
      //    home_type: 'homeBanner'
      //   }
      // }),
      service.movie.getMovieList({
        findQuery: {
         tags: {$in: [tags[0].tagType]},
        //  home_type: 'recommend'
        }
      }),
      service.movie.getMovieList({
        sort: {year: -1}
      })

    ])
    if (resList && resList.length) {
      ctx.body = ctxBody({
        data: [
          {
            homeType: 'recommend',
            homeName: '推荐',
            tags,
            list: resList[0]
          },
          {
            homeType: 'newest',
            homeName: '新片',
            tags: null,
            list: resList[1]
          }
        ]
      })
    }
  }
  /**
   * movie list
   */
  async getMovieList() {
    const { ctx, ctx: { query: { tag, name, year, language, pageNo, pageSize }, service } } = this
    const findQuery = {}
    tag && (findQuery.tags = { $in: [tag] })
    language && (findQuery.language = { $in: [language] })
    name && (findQuery.name = name)
    year && (findQuery.year = year)
    const result = await Promise.all([
      service.movie.getMovieTotal(),
      service.movie.getMovieList({findQuery, params: { pageNo, pageSize }})
    ])
    if (result) {
      ctx.body = ctxBody({
        data: result[1],
        custom: { total: result[0] }
      })
    }
  }
  /**
   * update movie
   */
  async updateMovie() {
    const { ctx, ctx: { service, request: { body: { ids, homeType } } } } = this
    if (!ids) throw 'missing parameters'
    const idList = ids.split(',').map(item => +item)
    const updateInfo = {}
    const findQuery = { id: { $in: idList } }
    homeType && (updateInfo.home_type = homeType)
    const result = await service.movie.updateMovie({findQuery, updateInfo})
    if (result) {
      ctx.body = ctxBody({
        data: result
      })
    }
  }
}

module.exports = MovieController;