/*
 * @Author: EdisonGu
 * @Date: 2022-09-13 11:31:34
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-13 11:32:04
 * @Descripttion: 
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
  return mongoose.model('tv_list', MovieSchema, 'tv_list')
}