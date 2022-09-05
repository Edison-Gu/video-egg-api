/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-05 16:51:25
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
        list: [
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
      // ctx.body = objectBody({
      //   obj: {
      //     // homeBanner: resList[0],
      //     recommend: {
      //       tags,
      //       list: resList[0]
      //     },
      //     newest: {
      //      list: resList[1]
      //     }
      //   }
      // })
    }
  }
  /**
   * movie list
   */
  async getMovieList() {
    const { ctx, ctx: { query, service } } = this
    let list = null
    let total = 0
    let findQuery = {}
    try {
      let { pageNo = 1, pageSize = 20, tag } = query
      if (tag) {
        findQuery.tags = {
          $in: [tag]
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
  /**
   * update movie
   */
  async updateMovie() {
    const { ctx, ctx: { service, request: { body: { ids } } } } = this
    if (!ids) throw 'missing parameters'
    const idList = ids.split(',').map(item => +item)
    const findQuery = {
      id: {
        $in: idList
      }
    }
    const updateInfo = {
      home_type: []
      // name: '绝地战警45'
    }
    const result = await service.movie.updateMovie({findQuery, updateInfo})
    if (result) {
      ctx.body = {
        code: 1,
        data: result,
        message: 'success',
      }
    }
  }
}

module.exports = MovieController;