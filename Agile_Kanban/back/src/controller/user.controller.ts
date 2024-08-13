import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';

@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const result = await this.userService.login(username, password);
    console.log('Login result:', result);
    return result;
  }

  @Post('/register')
  async register(@Body() body: { username: string; password: string }) {
    console.log('Register request received:', body);
    const { username, password } = body;
    const result = await this.userService.register(username, password);
    console.log('Register result:', result);
    return result;
  }
}
