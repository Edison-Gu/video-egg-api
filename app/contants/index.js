/*
 * @Author: EdisonGu
 * @Date: 2022-11-17 12:02:54
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-11-18 16:56:12
 * @Descripttion: 常量
 */

const lang = ['粤语', '闽南语', '泰语', '日语', '法语', '德语', '韩语', '英语']

// 国语
const cnArr = [
  {
    str: '国语',
    rpStr: '国语'
  },
  {
    str: '汉语',
    rpStr: '国语'
  },
  {
    str: '汉语版',
    rpStr: '国语'
  },
  {
    str: '普通话',
    rpStr: '国语'
  },
  {
    str: '普通话版',
    rpStr: '国语'
  },
  {
    str: '汉语普通话',
    rpStr: '国语'
  },
  {
    str: '汉语普通话版',
    rpStr: '国语'
  }
]

// 其它语言 
const otherArr = [
  ...lang.map(item => ({
    str: item,
    rpStr: item
  })),
  ...lang.map(item => ({
    str: `${item}版`,
    rpStr: item 
  }))
]
// 给语言加特殊符号
const addSymbols = arr => {
  const tArr = ['()','（）','[]','【】','{}','「」']
  const list = []
  tArr.forEach(el => {
    const fSrt = el.substring(0,1)
    const lStr = el.substring(el.length - 1)
    const tempList = []
    arr.map(item => {
      const tmpItem = JSON.parse(JSON.stringify(item))
      tmpItem.str = `${fSrt}${item.str}${lStr}`
      tempList.push(tmpItem)
    })
    list.push(...tempList)
  })
  return list.length ? list : arr
}

const areaArr = [
  {
    str: '内地',
    rpStr: '大陆'
  },
  {
    str: '中国',
    rpStr: '大陆'
  },
  {
    str: '中国大陆',
    rpStr: '大陆'
  },
  {
    str: '中国香港',
    rpStr: '香港'
  },
  {
    str: '中国台湾',
    rpStr: '台湾'
  },
  {
    str: '中国澳门',
    rpStr: '澳门'
  },
  {
    str: '美国',
    rpStr: '欧美'
  },
  {
    str: '英国',
    rpStr: '欧美'
  },
  {
    str: '德国',
    rpStr: '欧美'
  },
  {
    str: '法国',
    rpStr: '欧美'
  }
]
// II
const vArr = [
  {
    str: 'II',
    rpStr: '2'
  },
  {
    str: 'III',
    rpStr: '3'
  },
  {
    str: 'Ⅱ',
    rpStr: '2'
  },
  {
    str: 'Ⅲ',
    rpStr: '3'
  },
]

const langArr = [
  ...cnArr,
  ...otherArr,
  ...addSymbols(cnArr),
  ...addSymbols(otherArr),
]

module.exports = {
  areaArr,
  langArr,
  vArr
}
