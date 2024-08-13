import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid: string) {
    const user = await this.userService.getUser(uid);
    if (user) {
      return { success: true, message: 'OK', data: user };
    } else {
      return { success: false, message: 'User not found' };
    }
  }
}
