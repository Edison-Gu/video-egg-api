/*
 * @Author: EdisonGu
 * @Date: 2022-09-13 13:50:06
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-13 13:54:36
 * @Descripttion: 
 */
'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1650287091420_7171';

  // add your middleware config here
  config.middleware = [];

  // graphql配置
  config.graphql = {
    router: '/graphql',
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
    // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
    graphiql: true,
    // 是否设置默认的Query和Mutation, 默认关闭
    defaultEmptySchema: true,
    // graphQL 路由前的拦截器
    * onPreGraphQL(ctx) {
      console.log('---ctx', ctx);
    },
    // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
    // onPreGraphiQL: function* (ctx) {},
    // apollo server的透传参数，参考[文档](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#parameters)
    apolloServerOptions: {
      playground: true,
    },
  };

  config.mongoose = {
    client: {
      url: 'mongodb://EdisonGu:Gu198573@1.14.77.152:27017/web_video?authSource=admin',
      options: {},
    },
  };

  config.redis = {
    clients: {
      emoticon: {
        host: '1.14.77.152',
        port: 6379,
        password: 'Gu198573',
        db: 1
      },
      emoji: {
        host: '1.14.77.152',
        port: 6379,
        password: 'Gu198573',
        db: 2
      }
    }
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],//允许访问接口的白名单，例如：http://localhost:8080 *表示均可访问
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  
  config.cluster = {
    listen: {
      path: '',
      port: 7002,
      hostname: '0.0.0.0'
    }
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  const mongoConfig = {
    a: 1
  }

  // const mongo = {
  //   client: {
  //     host: '1.14.77.152',
  //     port: '27017',
  //     name: 'root',
  //     options: {},
  //   },
  // };

  return {
    ...config,
    ...userConfig,
    mongoConfig
    // mongo,
  };
};
