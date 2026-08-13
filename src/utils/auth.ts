import Taro from '@tarojs/taro';
import { Network } from '@/network';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

export interface UserInfo {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  phone: string;
}

export interface LoginResult {
  token: string;
  user: UserInfo;
}

/**
 * 微信登录
 */
export async function wxLogin(): Promise<LoginResult | null> {
  try {
    // 获取微信 code
    const loginRes = await Taro.login();
    const code = loginRes.code;

    if (!code) {
      console.error('获取微信 code 失败');
      return null;
    }

    // 调用后端登录接口
    const res = await Network.request({
      url: '/api/auth/login',
      method: 'POST',
      data: {
        code,
        nickname: '',
        avatar: '',
      },
    });

    console.log('登录响应:', res.data);

    const data = res.data?.data;
    if (data?.token && data?.user) {
      // 保存 token 和用户信息
      Taro.setStorageSync(TOKEN_KEY, data.token);
      Taro.setStorageSync(USER_KEY, JSON.stringify(data.user));
      return data;
    }

    return null;
  } catch (error) {
    console.error('登录失败:', error);
    return null;
  }
}

/**
 * 开发环境模拟登录（H5 使用）
 */
export async function mockLogin(userId?: string): Promise<LoginResult | null> {
  try {
    const mockId = userId || `dev_${Date.now()}`;
    const code = `mock_${mockId}`;

    const res = await Network.request({
      url: '/api/auth/login',
      method: 'POST',
      data: {
        code,
        nickname: '开发用户',
        avatar: '',
      },
    });

    console.log('模拟登录响应:', res.data);

    const data = res.data?.data;
    if (data?.token && data?.user) {
      Taro.setStorageSync(TOKEN_KEY, data.token);
      Taro.setStorageSync(USER_KEY, JSON.stringify(data.user));
      return data;
    }

    return null;
  } catch (error) {
    console.error('模拟登录失败:', error);
    return null;
  }
}

/**
 * 获取当前 token
 */
export function getToken(): string | null {
  return Taro.getStorageSync(TOKEN_KEY) || null;
}

/**
 * 获取当前用户信息
 */
export function getUserInfo(): UserInfo | null {
  const userStr = Taro.getStorageSync(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/**
 * 登出
 */
export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      await Network.request({
        url: '/api/auth/logout',
        method: 'POST',
        header: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('登出请求失败:', error);
    }
  }
  Taro.removeStorageSync(TOKEN_KEY);
  Taro.removeStorageSync(USER_KEY);
}

/**
 * 自动登录（页面加载时调用）
 * - 小程序环境：调用微信登录
 * - H5 环境：调用模拟登录
 */
export async function autoLogin(): Promise<UserInfo | null> {
  // 已登录，直接返回
  const currentUser = getUserInfo();
  if (currentUser) {
    return currentUser;
  }

  // 判断环境
  const env = Taro.getEnv();
  const isMiniApp = env === Taro.ENV_TYPE.WEAPP || env === Taro.ENV_TYPE.TT;

  let result: LoginResult | null;
  if (isMiniApp) {
    result = await wxLogin();
  } else {
    // H5 环境使用模拟登录
    result = await mockLogin();
  }

  return result?.user || null;
}
