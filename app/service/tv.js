/*
 * @Author: EdisonGu
 * @Date: 2022-09-13 11:30:42
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-13 13:40:29
 * @Descripttion: 
 */
const { Service } = require('egg')
const cheerio = require('cheerio')
const { dealStr, transCode, handleResult } = require('../utils/common')

class Tv extends Service {
  async getTotal() {
    const { app, ctx: { model: { Tv } } } = this
    const total = await Tv.count()
    return total
    // const { app, ctx: { model: { Emoticon } } } = this
    // const rTotal = await app.redis.get('emoticon').get(EMOTICON_TOTAL)
    // if (rTotal) {
    //   return rTotal
    // } else {
    //   const total = await Emoticon.count()
    //   app.redis.get('emoticon').set(EMOTICON_TOTAL, total, 'EX', CACHE_TIME)
    //   return total
    // }
  }

  async getList({findQuery = {}, sort = {}, params = {}}) {
    const { app, ctx: { model: { Tv } } } = this
    const { pageSize = 20, pageNo = 1 } = params
    const result = await Tv.find(findQuery).skip(pageSize * (pageNo - 1)).limit(+pageSize).sort(sort)
    return result.map(item => handleResult(item))
  }

  async getDetail({findQuery = {}}) {
    const { app, ctx: { model: { Tv } } } = this
    const result = await Tv.find(findQuery)
    return handleResult(result[0])
  }

  /**
   * 需要配置Schema，不然无法更新成功
   */
  async updateInfo({findQuery = {}, updateInfo = {}}) {
    const { ctx: { model: { Tv } } } = this
    const result = await Tv.updateMany(findQuery, updateInfo)
    return result
  }

  // async getDetail() {
  //   let result = null
  //   const { app, ctx: { query: { q = '' } } } = this
  //   const url = `https://Tv.douban.com/j/subject_suggest?q=${q}`
  //   const { status, data } = await app.curl(url);
  //   if (status === 200 && data && JSON.parse(data)) {
  //     const info = JSON.parse(data)[0]
  //     result = await this.getHtml({url: info.url})
  //   }
  //   return result
  // }
  async getHtml({url}) {
    const { app } = this
    let videoInfo = {}
    // https://Tv.douban.com/subject/25828589/?suggest=%E9%BB%91%E5%AF%A1%E5%A6%87
    const { status, data } = await app.curl(url)
    if (status === 200 && data) {
      const pageXml = data.toString()
      const $ = cheerio.load(pageXml, { decodeEntities: false })
      const $content = $('#wrapper #content')
      const $videoInfo = $content.find('.article #info')
      const $year = $content.find('> h1 .year')
      const poster = $content.find('#mainpic a img').attr('src')
      const title = dealStr({ str: $('title').text(), strList: [' (豆瓣)'] })
      const name = $content.find('> h1 span')[0]
      const score = $content.find('#interest_sectl .rating_num').text()
      const description = $content.find('.related-info #link-report > span:first-child').text()
      const infoList = $videoInfo.html().split('<br>')
      const tempInfo = {}
      infoList.forEach(el => {
        let str = $(el).text()
        const strList = dealStr({str}).split(':')
        if (strList.length) {
          const code = transCode(strList[0])
          if (code) {
            str = dealStr({str, strList: [`${strList[0]}:`] })
            const codeList = str.split('/').map(item => dealStr({str: item}))
            tempInfo[code] = str.indexOf('/') > -1 ? codeList : tempInfo[code] = str
          }
        }
      })
      videoInfo = {
        name: $(name).text(),
        title,
        sub_title: dealStr({str: $(name).text(), strList: [title]}),
        year: dealStr({str: $year.text(), strList: ['(', ')']}),
        poster,
        score,
        description: dealStr({str: description}),
        ...tempInfo
        // infoList
      }
      console.log('----videoInfo', videoInfo)
      // videoInfo.name = nameDom.find
    }
    return videoInfo
  }
}

module.exports = Tv