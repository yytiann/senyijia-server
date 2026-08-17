import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        code: string;
        nickname?: string;
        avatar?: string;
    }): Promise<{
        code: number;
        msg: string;
        data: import("./auth.service").LoginResult;
    } | {
        code: number;
        msg: any;
        data: null;
    }>;
    getUserInfo(authHeader: string): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./auth.service").User;
    }>;
    logout(authHeader: string): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    private extractToken;
    adminLogin(body: {
        username: string;
        password: string;
    }): Promise<{
        code: number;
        msg: string;
        data: import("./auth.service").AdminLoginResult;
    } | {
        code: number;
        msg: any;
        data: null;
    }>;
    getAdminInfo(authHeader: string): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: Omit<import("./auth.service").Admin, "password">;
    }>;
    adminLogout(authHeader: string): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
}
