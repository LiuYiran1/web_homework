import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as cors from 'koa2-cors';
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    this.app.useMiddleware([ReportMiddleware]);

    this.app.use(cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization',
    }));

    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
