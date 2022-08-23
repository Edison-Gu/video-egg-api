/*
 * @Author: EdisonGu
 * @Date: 2022-08-22 21:05:18
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-23 19:22:19
 * @Descripttion: 
 */
module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  // 数据库表的映射
  const TagSchema = new Schema(
    {
      id: { type: Number, default: 1000 },
      tag_type: { type: String, default: '' },
      tag_name: { type: String, default: '' },
      sort: { type: Number, default: 0 },
    },
    {
      timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
      versionKey: false
    }
  )
  return mongoose.model('tag_list', TagSchema, 'tag_list')
}