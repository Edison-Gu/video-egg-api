/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:12:40
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-12 23:31:54
 * @Descripttion: 
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/homeRecommend', controller.movie.getHomeRecommend)
  router.get('/movieList', controller.movie.getMovieList)
  router.get('/movieInfo', controller.movie.getMovieInfo)
  router.get('/movieRecommend', controller.movie.getMovieRecommend)
  router.post('/updateMovie', controller.movie.updateMovie)

  router.get('/tagList', controller.tag.getTagList)
  router.post('/creatTag', controller.tag.createTag)

  router.get('/recommendList', controller.recommend.getRecommendList)
  router.post('/createRecommend', controller.recommend.createRecommend)
};
