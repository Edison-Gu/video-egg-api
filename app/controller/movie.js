/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-12 23:42:10
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
      }),
      service.movie.getMovieList({
        findQuery: {
          home_type: {$in: ['classic']},
         //  home_type: 'recommend'
         }
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
          },
          {
            homeType: 'classic',
            homeName: '经典',
            tags: null,
            list: resList[2]
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
   * movie info
   */
  async getMovieInfo() {
    const { ctx, ctx: { query: { id, name }, service } } = this
    const findQuery = {}
    if (!id) throw 'missing parameters'
    id && (findQuery.id = +id)
    name && (findQuery.name = name)
    const result = await service.movie.getMovieInfo({findQuery})
    if (result) {
      ctx.body = ctxBody({
        data: result
      })
    }
  }
  async getMovieRecommend() {
    const { ctx, ctx: { query: { id }, service } } = this
    const movieInfo = await service.movie.getMovieInfo({findQuery: { id: +id }})
    const { videoType, tags } = movieInfo
    const findQuery = {
      tags: {$in: tags}
    }
    const result = await service.movie.getMovieList({findQuery})
    if (result) {
      ctx.body = ctxBody({
        data: result
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
    console.log('---result', result)
    if (result) {
      ctx.body = ctxBody({
        data: result
      })
    }
  }
}

module.exports = MovieController;