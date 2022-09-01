/*
 * @Author: EdisonGu
 * @Date: 2022-09-01 19:26:52
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-01 19:48:34
 * @Descripttion: 
 */
const { Service } = require('egg')
const { incKey, handleResult } = require('../utils/common')

class Recommend extends Service {
  async get() {
    const { ctx: { model: { Recommend } } } = this
    // const id = await incKey({model: Tag})
    // const tag = new Tag({id})
    const result = await Recommend.find()
    return result.map(item => handleResult(item))
  }
  async add() {
    const { ctx: { model: { Recommend }, request: { body: { recommendType, recommendName, needTag = false, sort = 0 } } } } = this
    const id = await incKey({model: Recommend})
    const recommend = new Recommend({
      id,
      recommend_type: recommendType,
      recommend_name: recommendName,
      need_tag: needTag,
      sort
    })
    const result = await recommend.save()
    return result
  }
}

module.exports = Recommend