/*
 * @Author: EdisonGu
 * @Date: 2022-08-20 22:44:08
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-11-16 00:24:15
 * @Descripttion: 
 */
'use strict';
// const fs = require('fs')

const ctxBody = ({ data, custom = {} }) => {
  let body = {
    code: data ? 1 : -1,
    data: data ? data : null,
    ...custom,
    message: 'SUCCESS'
  }
  return body
}

const objectBody = ({ obj = {} }) => {
  let body = {
    code: obj ? 1 : -1,
    data: obj ? obj : null,
    message: 'SUCCESS'
  }
  return body
}

const cjBody = (bufferStr) => {
  let result = JSON.parse(bufferStr.toString())
  const { list = [] } = result
  const handleList = list.map(item => {
    let { vod_douban_score = 0, vod_name, type_name } = item
    item.vod_name = dealStr({ str: `${handleCjStr(vod_name)}${transType(type_name)}` })
    vod_douban_score = (+vod_douban_score) > 4 ? vod_douban_score : getRandomScore() // 豆瓣大于4的评分才用，否则取评分
    item.vod_douban_score = vod_douban_score
    item.vod_score = vod_douban_score ? vod_douban_score : getRandomScore() // 没有豆瓣评分取6.8-8.8的随机数
    return item
  })
  result.list = handleList
  return result
}

// 替换采集名称字符串，比如 行尸走肉 第一季 => 行尸走肉第一季, 默认处理100季以内
const handleCjStr = str => {
  str = str.replace(/(^\s*)|(\s*$)/g, '') // 去除前后空格
  let tempStr = ''
  const replaceNumStr = []
  const replaceCnStr = []
  for (let index = 0; index < 100; index++) {
    replaceNumStr.push(`第${index + 1}季`)
    replaceCnStr.push(`第${SectionToChinese(index + 1)}季`)
  }
  replaceCnStr.forEach((item, index) => {
    const cnIndex = str.indexOf(item)
    const numIndex = str.indexOf(replaceNumStr[index])
    if (cnIndex > -1 || numIndex > -1) {
      if (tempStr) return // 防止出现 行尸走肉第一季~第三季的情况
      const tempItem = numIndex > -1 ? replaceNumStr[index] : item
      const strList = str.split(tempItem)
      strList.forEach((el, idx) => {
        if (el) {
          if (idx === 0) {
            el = `${el.replace(/(^\s*)|(\s*$)/g, '')} ${item}`
          }
          tempStr += el
        }
      })
    }
  })
  return tempStr ? tempStr : str
}

// 根据影片类型来判断是否为电影/电视剧/综艺/动漫
const transType = typeName => {
  let transName = 'NetFlyNormal'
  if (typeName.indexOf('片') > -1 || typeName.indexOf('电影') > -1) {
    transName = 'NetFlyMovie'
  } else if (typeName.indexOf('剧') > -1 && typeName.indexOf('片') == -1) {
    transName = 'NetFlyTv'
  } else if (typeName.indexOf('动漫') > -1) {
    transName = 'NetFlyComic'
  } else if (typeName.indexOf('综艺') > -1) {
    transName = 'NetFlyShow'
  } else if (typeName.indexOf('纪录片') > -1) {
    transName = 'NetFlyDocumentary'
  } else if (typeName.indexOf('解说') > -1) {
    transName = 'NetFlyShort'
  } else if (typeName.indexOf('体育') > -1 || typeName.indexOf('球') > -1) {
    transName = 'NetFlySports'
  }
  return transName
}

// 取随机分数
const getRandomScore = (min = 6.8, max = 8.8) => {
  let score = 0
  score = Math.random()*(max - min)+min
  return score.toFixed(2)
}

const randomCount = count => {
  return Math.floor(Math.random() * count)
}
/**
 * 根据id和total获取范围
 */
const maxCount = ({ id, total, pageSize, multiple = 20, spacing = 50 }) => {
  let maxCount = id + pageSize * multiple
  if ((maxCount - 1000) > total) {
    maxCount = id - spacing
  }
  return maxCount
}

/**
 * 去除前后空格和多余的字符
 * @param {*} str 
 */
const dealStr = ({ str, strList = [] }) => {
  strList.forEach(el => {
    str = str.replace(el, '')
  })
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

const transCode = key => {
  let code = ''
  switch (key) {
    case '导演':
      code = 'director'
      break;
    case '编剧':
      code = 'author'
      break;
    case '主演':
      code = 'actor'
      break;
    case '类型':
      code = 'type'
      break;
    case '制片国家/地区':
      code = 'area'
      break;
    case '语言':
      code = 'language'
      break;
    case '上映日期':
      code = 'publish_time'
      break;
    case '片长':
      code = 'video_time'
      break;
    case '又名':
      code = 'other_name'
      break;
    case 'IMDb':
      code = 'imdb_no'
      break;
    case '首播': // 电视剧
      code = 'first_area'
      break;
    case '集数': // 电视剧
      code = 'tv_total'
      break;
    case '单集片长': // 电视剧
      code = 'single_episode_time'
      break;

    default:
      break;
  }
  return code
}
// mongodb auto increment id
const incKey = async ({ model, key = 'id' }) => {
  const sortQuery = {}
  let keyResult = 1000 // The default is 1000
  sortQuery[key] = -1
  const res = await model.findOne().sort(sortQuery)
  if (res) {
    keyResult = res[key] + 1
  }
  return keyResult
}

// str to toLowerCase, 第一个字母大写
const firstStrToUp = str => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

// code_about => CodeAbout
const handleResult = (result) => {
  result = JSON.parse(JSON.stringify(result))
  delete result._id
  let res = {}
  for (const key in result) {
    let str = key
    let value = result[key]
    if (key.indexOf('_') > -1) {
      const keyArr = key.split('_')
      str = ''
      keyArr.forEach((el, index) => {
        index > 0 && (el = firstStrToUp(el))
        str += el
      })
    }
    if (key === 'create_time' || key === 'update_time') {
      value = new Date(value).getTime()
    }
    res[str] = value
  }
  return res
}

// 阿拉伯数字转中文
function SectionToChinese(num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert("Number is wrong!");
    return "Number is wrong!";
  }
  var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
  var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
  var a = ("" + num).replace(/(^0*)/g, "").split("."),
    k = 0,
    re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
          re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }
  if (a.length > 1) //加上小数部分(如果有小数部分) 
  {
    re += BB[6];
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  return re.replace('一十', '十')
}

module.exports = {
  ctxBody,
  objectBody,
  cjBody,
  randomCount,
  maxCount,
  dealStr,
  transCode,
  incKey,
  handleResult
}