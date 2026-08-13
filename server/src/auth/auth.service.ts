import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface User {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  phone: string;
  createdAt: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
  createdAt: string;
}

export interface AdminLoginResult {
  token: string;
  admin: Omit<Admin, 'password'>;
}

@Injectable()
export class AuthService {
  // 内存存储用户和 token
  private users: Map<string, User> = new Map(); // openid -> User
  private tokens: Map<string, string> = new Map(); // token -> openid
  
  // 商户存储
  private admins: Map<string, Admin> = new Map(); // username -> Admin
  private adminTokens: Map<string, string> = new Map(); // token -> username

  constructor() {
    // 初始化默认商户账号
    this.admins.set('admin', {
      id: 'admin_001',
      username: 'admin',
      password: 'admin123', // 生产环境应该加密存储
      name: '森易家管理员',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * 微信登录
   * 生产环境：用 code 换取 openid
   * 开发环境：支持模拟登录
   */
  async wxLogin(code: string, nickname?: string, avatar?: string): Promise<LoginResult> {
    // 获取 openid
    let openid: string;

    if (code.startsWith('mock_')) {
      // 开发环境模拟登录
      openid = `mock_openid_${code.replace('mock_', '')}`;
    } else {
      // 生产环境：调用微信 API 获取 openid
      // 需要配置 APP_ID 和 APP_SECRET
      openid = await this.getOpenidFromWechat(code);
    }

    // 查找或创建用户
    let user = this.users.get(openid);
    if (!user) {
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        openid,
        nickname: nickname || '微信用户',
        avatar: avatar || '',
        phone: '',
        createdAt: new Date().toISOString(),
      };
      this.users.set(openid, user);
    } else if (nickname || avatar) {
      // 更新用户信息
      user.nickname = nickname || user.nickname;
      user.avatar = avatar || user.avatar;
      this.users.set(openid, user);
    }

    // 生成 token
    const token = this.generateToken();
    this.tokens.set(token, openid);

    return { token, user };
  }

  /**
   * 验证 token
   */
  verifyToken(token: string): User | null {
    const openid = this.tokens.get(token);
    if (!openid) return null;
    return this.users.get(openid) || null;
  }

  /**
   * 根据 openid 获取用户
   */
  getUserByOpenid(openid: string): User | null {
    return this.users.get(openid) || null;
  }

  /**
   * 调用微信 API 获取 openid
   * 生产环境需要配置 APP_ID 和 APP_SECRET
   */
  private async getOpenidFromWechat(code: string): Promise<string> {
    const APP_ID = process.env.WX_APP_ID || '';
    const APP_SECRET = process.env.WX_APP_SECRET || '';

    if (!APP_ID || !APP_SECRET) {
      // 未配置，使用模拟 openid
      return `mock_openid_${code}`;
    }

    try {
      // 调用微信 API
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.errcode) {
        throw new Error(`微信登录失败: ${data.errmsg}`);
      }

      return data.openid;
    } catch (error) {
      console.error('微信登录错误:', error);
      // 降级处理：使用 code 作为 openid
      return `fallback_${code}`;
    }
  }

  /**
   * 生成随机 token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * 登出（删除 token）
   */
  logout(token: string): void {
    this.tokens.delete(token);
  }

  /**
   * 商户登录
   */
  async adminLogin(username: string, password: string): Promise<AdminLoginResult | null> {
    const admin = this.admins.get(username);
    if (!admin || admin.password !== password) {
      return null;
    }

    // 生成 token
    const token = this.generateToken();
    this.adminTokens.set(token, username);

    // 返回不含密码的商户信息
    const { password: _, ...adminInfo } = admin;
    return { token, admin: adminInfo };
  }

  /**
   * 验证商户 token
   */
  verifyAdminToken(token: string): Omit<Admin, 'password'> | null {
    const username = this.adminTokens.get(token);
    if (!username) return null;
    const admin = this.admins.get(username);
    if (!admin) return null;
    
    const { password: _, ...adminInfo } = admin;
    return adminInfo;
  }

  /**
   * 商户登出
   */
  adminLogout(token: string): void {
    this.adminTokens.delete(token);
  }
}
