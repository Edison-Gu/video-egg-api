/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:56:45
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-31 23:32:47
 * @Descripttion: 
 */

const Controller = require('egg').Controller;
const { ctxBody, objectBody } = require('../utils/common')

class MovieController extends Controller {
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
  async getMovieList() {
    const { ctx, ctx: { query, service } } = this
    let list = null
    let total = 0
    let findQuery = {}
    try {
      let { pageNo = 1, pageSize = 20, type } = query
      if (type) {
        findQuery.tags = {
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