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
export declare class AuthService {
    private users;
    private tokens;
    private admins;
    private adminTokens;
    constructor();
    wxLogin(code: string, nickname?: string, avatar?: string): Promise<LoginResult>;
    verifyToken(token: string): User | null;
    getUserByOpenid(openid: string): User | null;
    private getOpenidFromWechat;
    private generateToken;
    logout(token: string): void;
    adminLogin(username: string, password: string): Promise<AdminLoginResult | null>;
    verifyAdminToken(token: string): Omit<Admin, 'password'> | null;
    adminLogout(token: string): void;
}
