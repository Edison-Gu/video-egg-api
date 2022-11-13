/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:12:40
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-13 14:49:40
 * @Descripttion: 
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/homeRecommend', controller.movie.getHomeRecommend) // 首页推荐
  router.get('/movieList', controller.movie.getList)
  router.get('/movieDetail', controller.movie.getDetail)
  router.get('/movieRecommend', controller.movie.getMovieRecommend)
  router.get('/search', controller.movie.searchMovie)
  router.post('/updateMovie', controller.movie.updateInfo)

  router.get('/tagList', controller.tag.getTagList)
  router.post('/creatTag', controller.tag.createTag)

  router.get('/recommendList', controller.recommend.getRecommendList)
  router.post('/createRecommend', controller.recommend.createRecommend)

};
