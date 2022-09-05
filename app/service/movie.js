/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:39:53
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-05 16:45:17
 * @Descripttion: 代理豆瓣搜索接口，爬取对应网站内容
 */
const { Service } = require('egg')
const cheerio = require('cheerio')
const { dealStr, transCode, handleResult } = require('../utils/common')

class Movie extends Service {

  async getMovieTotal() {
    const { app, ctx: { model: { Movie } } } = this
    const total = await Movie.count()
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

  async getMovieList({ findQuery = {}, sort = {}, params = {} }) {
    const { app, ctx: { model: { Movie } } } = this
    const { pageSize = 20, pageNo = 1 } = params
    const result = await Movie.find(findQuery).skip(pageSize * (pageNo - 1)).limit(+pageSize).sort(sort)
    return result.map(item => handleResult(item))
  }

  /**
   * 需要配置Schema，不然无法更新成功
   */
  async updateMovie({findQuery = {}, updateInfo = {}}) {
    const { ctx: { model: { Movie } } } = this
    const result = await Movie.updateMany(findQuery, updateInfo)
    return result
  }

  async getMovieInfo() {
    let result = null
    const { app, ctx: { query: { q = '' } } } = this
    const url = `https://movie.douban.com/j/subject_suggest?q=${q}`
    const { status, data } = await app.curl(url);
    if (status === 200 && data && JSON.parse(data)) {
      const info = JSON.parse(data)[0]
      result = await this.getHtml({url: info.url})
    }
    return result
  }
  async getHtml({url}) {
    const { app } = this
    let videoInfo = {}
    // https://movie.douban.com/subject/25828589/?suggest=%E9%BB%91%E5%AF%A1%E5%A6%87
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

module.exports = Movie