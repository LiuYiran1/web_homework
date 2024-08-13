import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1722775533674_6472',
  
  koa: {
    port: 5173,
  },
  
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    allowHeaders: 'Content-Type, Authorization',
  },

  controller: {
    // 控制器路径
    path: 'src/controller/**/*.{ts,js}'
  },
  service: {
    // 服务路径
    path: 'src/service/**/*.{ts,js}'
  },
} as MidwayConfig;
