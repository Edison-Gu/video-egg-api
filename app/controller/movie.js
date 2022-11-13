/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-11-13 23:43:46
 * @Descripttion: 
 */

const Controller = require('egg').Controller;
const { ctxBody, objectBody, cjBody } = require('../utils/common')

class MovieController extends Controller {
  /**
   * home recommend
   */
  async getHomeRecommend() {
    const { ctx, ctx: { service } } = this
    const tags = await service.tag.getTag()
    const resList = await Promise.all([
      // service.movie.getList({
      //   findQuery: {
      //    home_type: 'homeBanner'
      //   }
      // }),
      service.movie.getList({
        findQuery: {
         tags: {$in: [tags[0].tagType]},
        //  home_type: 'recommend'
        }
      }),
      service.movie.getList({
        sort: {year: -1}
      }),
      service.movie.getList({
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
  async getList() {
    const { ctx, ctx: { query: { tag, name, year, language, pageNo, pageSize, type = 'movie' }, service } } = this
    const findQuery = {}
    tag && (findQuery.tags = { $in: [tag] })
    language && (findQuery.language = { $in: [language] })
    name && (findQuery.name = name)
    year && (findQuery.year = year)
    const result = await Promise.all([
      service[type].getTotal(),
      service[type].getList({findQuery, params: { pageNo, pageSize }})
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
  async getDetail() {
    const { ctx, ctx: { query: { id, name }, service } } = this
    const findQuery = {}
    if (!id) throw 'missing parameters'
    id && (findQuery.id = +id)
    name && (findQuery.name = name)
    const result = await service.movie.getDetail({findQuery})
    if (result) {
      ctx.body = ctxBody({
        data: result
      })
    }
  }
  /**
   * movie recommend
   */
  async getMovieRecommend() {
    const { ctx, ctx: { query: { id }, service } } = this
    const movieDetail = await service.movie.getDetail({findQuery: { id: +id }})
    const { videoType, tags } = movieDetail
    const findQuery = {
      tags: {$in: tags}
    }
    const result = await service.movie.getList({findQuery})
    if (result) {
      ctx.body = ctxBody({
        data: result
      })
    }
  }
  async searchMovie() {
    const { ctx, ctx: { query: { name }, service } } = this
    const findQuery = {}
    if (!name) throw 'missing parameters'
    name && (findQuery.name = { $regex: name })
    const result = await Promise.all([
      service.movie.getList({findQuery}),
      service.tv.getList({findQuery})
    ])
    if (result) {
      ctx.body = ctxBody({
        data: {
          movie: result[0],
          tv: result[1],
          cartoon: []
        }
      })
    }
  }
  /**
   * update movie
   */
  async updateInfo() {
    const { ctx, ctx: { service, request: { body: { ids, homeType } } } } = this
    if (!ids) throw 'missing parameters'
    const idList = ids.split(',').map(item => +item)
    const updateInfo = {}
    const findQuery = { id: { $in: idList } }
    homeType && (updateInfo.home_type = homeType)
    const result = await service.movie.updateInfo({findQuery, updateInfo})
    console.log('---result', result)
    if (result) {
      ctx.body = ctxBody({
        data: result
      })
    }
  }
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

module.exports = MovieController;