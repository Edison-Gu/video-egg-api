/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 14:59:36
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-25 22:59:52
 * @Descripttion: 
 */
const { Service } = require('egg')
const { incKey, handleResult } = require('../utils/common')

class Tag extends Service {
  async getTag() {
    const { ctx: { model: { Tag } } } = this
    // const id = await incKey({model: Tag})
    // const tag = new Tag({id})
    const res = await Tag.find()
    return res
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