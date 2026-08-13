# 森易家 - 设计指南

## 品牌定位

- 品牌名称：森易家
- 定位：专业环境治理科技公司
- 风格：科技简约、环保专业、高级公信力
- 目标用户：C端家庭用户（新房除醛）、B端企业客户（办公/商铺治理）、公共机构（学校/医院等）
- 服务范围：室内空间、商业场所、公共区域、户外环境等各类环境治理需求

## 配色方案

| 用途 | Tailwind 类名 | 色值 |
|------|--------------|------|
| 主色-环保青 | `text-teal-600` / `bg-teal-600` | #0D9488 |
| 主色浅底 | `bg-teal-50` | #F0FDFA |
| 深空灰-标题 | `text-slate-800` | #1E293B |
| 正文色 | `text-slate-600` | #475569 |
| 辅助文字 | `text-slate-400` | #94A3B8 |
| 页面背景 | `bg-slate-50` | #F8FAFC |
| 卡片背景 | `bg-white` | #FFFFFF |
| 分割线 | `border-slate-100` | #F1F5F9 |
| 成功/健康 | `text-emerald-500` | #10B981 |
| 警告 | `text-amber-500` | #F59E0B |
| 错误/危险 | `text-red-500` | #EF4444 |

## 字体规范

- 页面大标题：`text-2xl font-bold text-slate-800`
- 区块标题：`text-xl font-bold text-slate-800`
- 卡片标题：`text-base font-semibold text-slate-800`
- 正文内容：`text-sm text-slate-600`
- 辅助说明：`text-xs text-slate-400`
- 数据指标：`text-2xl font-bold text-teal-600`

## 间距系统

- 页面边距：`px-4`（16px）
- 区块间距：`gap-6` 或 `space-y-6`
- 卡片内边距：`p-4`
- 列表项间距：`gap-3`
- 按钮间距：`gap-3`

## 组件使用原则

- 通用 UI 组件（Button、Input、Card、Tabs、Dialog、Badge、Select 等）统一优先使用 `@/components/ui/*`
- 新页面开发前，先拆分 UI 单元，再映射到组件库
- 禁止用 View/Text 手搓按钮、输入框、弹窗、卡片等通用组件
- 页面容器使用 `bg-slate-50 min-h-full`
- 卡片容器使用 `bg-white rounded-xl`（圆角不超过 xl）

## 导航结构

TabBar 三个页面：
1. 首页（pages/index/index）- 品牌展示与服务入口
2. 预约（pages/booking/create）- 核心预约下单
3. 我的（pages/profile/index）- 订单管理与个人中心

普通页面（非 TabBar）：
- 服务详情页（pages/service/detail）
- 订单详情页（pages/order/detail）
- 关于我们（pages/about/index）

## 小程序约束

- 图片全部使用 TOS 对象存储 URL，不打包进小程序
- TabBar 图标使用本地 PNG（81x81）
- 包体积控制在 2MB 以内
- 列表使用虚拟滚动或分页加载
