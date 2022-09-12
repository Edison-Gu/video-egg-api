/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 20:00:34
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-13 00:23:36
 * @Descripttion: common error message
 */

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      console.log('---ctx', ctx.request.header)
      const { whitelist = '' } = ctx.request.header
      if (whitelist !== 'dogMovie')
      throw {
        status: 300,
        message: '不给过，嘿嘿嘿~'
      }
      await next()
    } catch (error) {
      console.log('----中间件', error)
      const { status } = error
      ctx.app.emit('error', error, ctx)
      const message = status ? error.message : '系统繁忙'
      ctx.body = {
        code: -1,
        message: message
      }
    }
  }
}