"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor() {
        this.users = new Map();
        this.tokens = new Map();
        this.admins = new Map();
        this.adminTokens = new Map();
        this.admins.set('admin', {
            id: 'admin_001',
            username: 'admin',
            password: 'admin123',
            name: '森易家管理员',
            role: 'admin',
            createdAt: new Date().toISOString(),
        });
    }
    async wxLogin(code, nickname, avatar) {
        let openid;
        if (code.startsWith('mock_')) {
            openid = `mock_openid_${code.replace('mock_', '')}`;
        }
        else {
            openid = await this.getOpenidFromWechat(code);
        }
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
        }
        else if (nickname || avatar) {
            user.nickname = nickname || user.nickname;
            user.avatar = avatar || user.avatar;
            this.users.set(openid, user);
        }
        const token = this.generateToken();
        this.tokens.set(token, openid);
        return { token, user };
    }
    verifyToken(token) {
        const openid = this.tokens.get(token);
        if (!openid)
            return null;
        return this.users.get(openid) || null;
    }
    getUserByOpenid(openid) {
        return this.users.get(openid) || null;
    }
    async getOpenidFromWechat(code) {
        const APP_ID = process.env.WX_APP_ID || '';
        const APP_SECRET = process.env.WX_APP_SECRET || '';
        if (!APP_ID || !APP_SECRET) {
            return `mock_openid_${code}`;
        }
        try {
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.errcode) {
                throw new Error(`微信登录失败: ${data.errmsg}`);
            }
            return data.openid;
        }
        catch (error) {
            console.error('微信登录错误:', error);
            return `fallback_${code}`;
        }
    }
    generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    logout(token) {
        this.tokens.delete(token);
    }
    async adminLogin(username, password) {
        const admin = this.admins.get(username);
        if (!admin || admin.password !== password) {
            return null;
        }
        const token = this.generateToken();
        this.adminTokens.set(token, username);
        const { password: _, ...adminInfo } = admin;
        return { token, admin: adminInfo };
    }
    verifyAdminToken(token) {
        const username = this.adminTokens.get(token);
        if (!username)
            return null;
        const admin = this.admins.get(username);
        if (!admin)
            return null;
        const { password: _, ...adminInfo } = admin;
        return adminInfo;
    }
    adminLogout(token) {
        this.adminTokens.delete(token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthService);
//# sourceMappingURL=auth.service.js.map