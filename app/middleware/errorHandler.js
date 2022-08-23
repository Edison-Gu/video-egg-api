/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 20:00:34
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-23 20:37:37
 * @Descripttion: common error message
 */

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
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