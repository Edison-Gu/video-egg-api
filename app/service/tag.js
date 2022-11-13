/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 14:59:36
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-01 19:28:43
 * @Descripttion: 
 */
const { Service } = require('egg')
const { incKey, handleResult } = require('../utils/common')

class Tag extends Service {
  async getTag() {
    const { ctx: { model: { Tag } } } = this
    // const id = await incKey({model: Tag})
    // const tag = new Tag({id})
    const result = await Tag.find()
    return result.map(item => handleResult(item))
  }
  async add() {
    const { ctx: { model: { Tag } } } = this
    const id = await incKey({model: Tag})
    const tag = new Tag({id})
    const result = await tag.save()
    return result
  }
}

module.exports = Tag