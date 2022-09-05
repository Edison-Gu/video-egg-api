/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:34:59
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-05 16:47:09
 * @Descripttion: 电影表
 */
module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  // 数据库表的映射
  const MovieSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    home_type: { type: Array }
    // sex: { type: String }
  })
  return mongoose.model('movie_list', MovieSchema, 'movie_list')
}
