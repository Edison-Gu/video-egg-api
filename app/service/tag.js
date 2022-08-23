/*
 * @Author: EdisonGu
 * @Date: 2022-08-23 14:59:36
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-23 19:26:12
 * @Descripttion: 
 */
const { Service } = require('egg')
const { incKey } = require('../utils/common')

class Tag extends Service {
  async add() {
    const { ctx: { model: { Tag } } } = this
    const id = await incKey({model: Tag})
    const tag = new Tag({id})
    const res = await tag.save()
    console.log('---res', res)
    return res
  }
}

module.exports = Tag