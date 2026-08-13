import { Controller, Post, Body, Get, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 微信登录
   * POST /api/auth/login
   * Body: { code, nickname?, avatar? }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { code: string; nickname?: string; avatar?: string }) {
    try {
      const result = await this.authService.wxLogin(body.code, body.nickname, body.avatar);
      return {
        code: 200,
        msg: '登录成功',
        data: result,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '登录失败',
        data: null,
      };
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/userinfo
   * Header: Authorization: Bearer <token>
   */
  @Get('userinfo')
  async getUserInfo(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    if (!token) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }

    const user = this.authService.verifyToken(token);
    if (!user) {
      return {
        code: 401,
        msg: '登录已过期',
        data: null,
      };
    }

    return {
      code: 200,
      msg: 'success',
      data: user,
    };
  }

  /**
   * 登出
   * POST /api/auth/logout
   * Header: Authorization: Bearer <token>
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    if (token) {
      this.authService.logout(token);
    }

    return {
      code: 200,
      msg: '登出成功',
      data: null,
    };
  }

  /**
   * 从 Authorization header 提取 token
   */
  private extractToken(authHeader: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }
}
