# 森易家商户管理后台部署说明

## 项目结构

```
├── 小程序端（用户）
│   └── 编译到微信小程序
│
└── H5 后台（商户）
    └── 编译到 H5，部署到独立域名
```

---

## 一、编译 H5 后台

```bash
# 编译 H5 版本
cd /workspace/projects
pnpm build:web
```

编译产物在 `dist-web/` 目录。

---

## 二、部署方案

### 方案 A：Nginx 静态部署（推荐）

#### 1. 上传文件到服务器

```bash
# 上传 dist-web 到服务器
scp -r dist-web/ user@your-server:/var/www/senyijia-admin/
```

#### 2. 配置 Nginx

```nginx
server {
    listen 443 ssl;
    server_name admin.your-domain.com;  # 商户后台域名
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/senyijia-admin;
    index index.html;
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理（解决跨域）
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 3. 访问地址

```
https://admin.your-domain.com
```

---

### 方案 B：Vercel / Netlify 部署（免费）

#### 1. 注册账号
- Vercel: https://vercel.com
- Netlify: https://netlify.com

#### 2. 上传 dist-web 目录
- 直接拖拽上传或连接 Git 仓库

#### 3. 配置环境变量
```
PROJECT_DOMAIN=https://your-api-domain.com
```

#### 4. 访问地址
```
https://your-app.vercel.app
```

---

### 方案 C：GitHub Pages（免费）

#### 1. 创建 GitHub 仓库
```bash
cd dist-web
git init
git add .
git commit -m "Initial deploy"
```

#### 2. 推送到 GitHub
```bash
git remote add origin https://github.com/yourusername/senyijia-admin.git
git push -u origin main
```

#### 3. 开启 GitHub Pages
- Settings → Pages → Source: main branch → Save

#### 4. 访问地址
```
https://yourusername.github.io/senyijia-admin
```

> 注意：需要配置 API 代理或使用 CORS

---

## 三、域名配置

### 1. 添加 DNS 解析

在域名服务商处添加：

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | admin | 你的服务器 IP |

### 2. 申请 SSL 证书

```bash
# 使用 Let's Encrypt（免费）
sudo certbot --nginx -d admin.your-domain.com
```

### 3. 配置小程序后台

小程序后台 → 开发 → 开发设置 → 服务器域名

添加：
- request 合法域名：`https://your-api-domain.com`
- uploadFile 合法域名：`https://your-api-domain.com`

---

## 四、测试账号

```
账号：admin
密码：admin123
```

---

## 五、日常使用

### 商户登录流程

1. 浏览器访问：`https://admin.your-domain.com`
2. 输入账号密码登录
3. 进入订单管理后台
4. 查看订单、接单、排期、标记完成

### 用户端

1. 微信搜索"森易家"小程序
2. 微信登录
3. 提交预约
4. 查看订单状态

---

## 六、更新部署

### 小程序更新
```bash
# 修改代码后
pnpm build:weapp
# 微信开发者工具上传 → 提交审核
```

### H5 后台更新
```bash
# 修改代码后
pnpm build:web
# 上传 dist-web 到服务器
scp -r dist-web/ user@your-server:/var/www/senyijia-admin/
```

> H5 后台更新无需审核，即时生效

---

## 七、注意事项

1. **跨域问题**：H5 后台和 API 需要在同一域名下，或配置 CORS
2. **HTTPS**：生产环境必须使用 HTTPS
3. **Token 存储**：登录 token 存储在 localStorage，注意安全性
4. **数据备份**：定期备份数据库

---

## 八、成本估算

| 项目 | 费用 | 说明 |
|------|------|------|
| 域名 | 50元/年 | admin.your-domain.com |
| 服务器 | 60元/年 | 腾讯云新用户 |
| SSL 证书 | 0元 | Let's Encrypt 免费 |
| **合计** | **约 110元/年** | |

> 如果使用 Vercel/Netlify/GitHub Pages，可以免费部署 H5 后台
