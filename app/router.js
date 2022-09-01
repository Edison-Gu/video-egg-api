/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:12:40
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-01 19:33:50
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

  router.get('/tagList', controller.tag.getTagList)
  router.post('/creatTag', controller.tag.createTag)

  router.get('/recommendList', controller.recommend.getRecommendList)
  router.post('/createRecommend', controller.recommend.createRecommend)
};
