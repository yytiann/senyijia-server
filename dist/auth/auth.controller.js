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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        try {
            const result = await this.authService.wxLogin(body.code, body.nickname, body.avatar);
            return {
                code: 200,
                msg: '登录成功',
                data: result,
            };
        }
        catch (error) {
            return {
                code: 500,
                msg: error.message || '登录失败',
                data: null,
            };
        }
    }
    async getUserInfo(authHeader) {
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
    async logout(authHeader) {
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
    extractToken(authHeader) {
        if (!authHeader)
            return null;
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
        return null;
    }
    async adminLogin(body) {
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
        }
        catch (error) {
            return {
                code: 500,
                msg: error.message || '登录失败',
                data: null,
            };
        }
    }
    async getAdminInfo(authHeader) {
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
    async adminLogout(authHeader) {
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
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('userinfo'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Get)('admin/info'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminInfo", null);
__decorate([
    (0, common_1.Post)('admin/logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map