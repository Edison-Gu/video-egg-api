/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:12:40
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-20 22:56:28
 * @Descripttion: 
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/movieList', controller.movie.getMovieList)
};
