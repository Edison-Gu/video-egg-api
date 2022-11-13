/*
 * @Author: EdisonGu
 * @Date: 2022-09-01 19:22:50
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-01 19:37:06
 * @Descripttion: 首页推荐
 */
module.exports = app => {
  // 引入建立连接的mongoose
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  // 数据库表的映射
  const RecommendSchema = new Schema(
    {
      id: { type: Number, default: 1000 },
      recommend_type: { type: String, default: '' },
      recommend_name: { type: String, default: '' },
      need_tag: { type: Boolean, default: false },
      sort: { type: Number, default: 0 },
    },
    {
      timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
      versionKey: false
    }
  )
  return mongoose.model('recommend_list', RecommendSchema, 'recommend_list')
}