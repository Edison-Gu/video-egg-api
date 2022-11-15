/*
 * @Author: EdisonGu
 * @Date: 2022-11-13 23:52:17
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-11-15 15:11:01
 * @Descripttion: 
 */
const Url  = require('url')
const Controller = require('egg').Controller;
const { cjBody } = require('../utils/common')

class CmsController extends Controller {
  /**
   * fs: pid - type_id_1
   * wj: pid - type_id_1
   * dd: pid - type_id_1
   * by: pid - type_id_1
   */
  async getcj() {
    const { ctx, ctx: { query } } = this
    const { url = '', uid = '' } = query
    let paramsStr = ''
    let burl = '' // bind url
    let curl = '' // cj url
    let classArr = [] // 分类列表 { type_id, type_name } 
    for (const key in query) {
      if (key !== 'url') {
        paramsStr += `${key}=${query[key]}&`
      }
    }
    if (url.indexOf('?') > -1) {
      curl = `${url}&${paramsStr}a=${Math.random()}`
      const urlQuery = Url.parse(url, true).query
      const { ac = 'list', uid = '' } = urlQuery
      // 为采集的时候需求请求绑定列表，处理采集列表分类
      if (ac === 'videolist') {
        const urlArr = url.split('?')
        burl = uid ? `${urlArr[0]}?ac=list&uid=${uid}` : `${urlArr[0]}?ac=list`
      }
    } else {
      curl = `${url}?${paramsStr}a=${Math.random()}`
    }  
    // if (burl) {
    //   const { status: bStatus, data: bData } = await this.ctx.curl(burl, { timeout: 10000 })
    //   if (bStatus === 200) {
    //     const { class: tempClass = [] } = cjBody(bData)
    //     classArr = tempClass
    //   }
    // }
    const { status, data } = await this.ctx.curl(curl, { timeout: 10000 })
    console.log('----status', status)
    if (status === 200) {
      ctx.body = cjBody(data)
    }
  }
}

module.exports = CmsController;
