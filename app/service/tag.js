/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 14:59:36
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-31 23:14:30
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
    const res = await tag.save()
    return res
  }
}

module.exports = Tag