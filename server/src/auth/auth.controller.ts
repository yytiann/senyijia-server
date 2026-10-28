import { Controller, Post, Body, Get, Headers, HttpCode, HttpStatus, Patch } from '@nestjs/common';
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
   * 更新当前用户资料（头像/昵称）
   * PATCH /api/auth/userinfo
   * Header: Authorization: Bearer <token>
   * Body: { nickname?, avatar? }
   */
  @Patch('userinfo')
  @HttpCode(HttpStatus.OK)
  async updateUserInfo(
    @Headers('authorization') authHeader: string,
    @Body() body: { nickname?: string; avatar?: string },
  ) {
    const token = this.extractToken(authHeader);
    if (!token) {
      return { code: 401, msg: '未登录', data: null };
    }

    const user = this.authService.updateUser(token, body.nickname, body.avatar);
    if (!user) {
      return { code: 401, msg: '登录已过期', data: null };
    }

    return {
      code: 200,
      msg: '更新成功',
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

  /**
   * 商户登录
   * POST /api/auth/admin/login
   * Body: { username, password }
   */
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() body: { username: string; password: string }) {
    try {
      const result = await this.authService.adminLogin(body.username, body.password);
      if (!result) {
        return {
          code: 401,
          msg: '账号或密码错误',
          data: null,
        };
      }
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
   * 获取当前商户信息
   * GET /api/auth/admin/info
   * Header: Authorization: Bearer <token>
   */
  @Get('admin/info')
  async getAdminInfo(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    if (!token) {
      return {
        code: 401,
        msg: '未登录',
        data: null,
      };
    }

    const admin = this.authService.verifyAdminToken(token);
    if (!admin) {
      return {
        code: 401,
        msg: '登录已过期',
        data: null,
      };
    }

    return {
      code: 200,
      msg: 'success',
      data: admin,
    };
  }

  /**
   * 商户登出
   * POST /api/auth/admin/logout
   * Header: Authorization: Bearer <token>
   */
  @Post('admin/logout')
  @HttpCode(HttpStatus.OK)
  async adminLogout(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    if (token) {
      this.authService.adminLogout(token);
    }

    return {
      code: 200,
      msg: '登出成功',
      data: null,
    };
  }
}
