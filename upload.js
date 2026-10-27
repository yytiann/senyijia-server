/**
 * 森易家小程序云端自动上传脚本
 * 用法：node upload.js
 * 依赖：miniprogram-ci（微信官方），key/private.appid.key 为上传私钥
 */
const ci = require('miniprogram-ci')
const fs = require('fs')
const path = require('path')

// ===== 配置（手动改） =====
const APPID = process.env.WX_APPID || 'touristappid' // 你的小程序 AppID
const VERSION = process.env.WX_VERSION || '1.0.0' // 版本号
const DESC = process.env.WX_DESC || '森易家小程序自动上传' // 上传备注
// ========================

const privateKeyPath = path.resolve(__dirname, 'key/private.appid.key')

// 校验密钥文件
if (!fs.existsSync(privateKeyPath) || fs.statSync(privateKeyPath).size === 0) {
  console.error('✗ 未检测到上传密钥，请先将 key/private.appid.key 填入微信生成的私钥内容')
  process.exit(1)
}
if (APPID === 'touristappid') {
  console.error('✗ AppID 未配置，请设置 WX_APPID 环境变量或修改 upload.js 中的 APPID')
  process.exit(1)
}

// 打包给微信 CI 的项目
const project = new ci.Project({
  appid: APPID,
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, 'dist'),
  privateKeyPath,
  ignores: ['node_modules/**/*'],
})

// 上传
ci.upload({
  project,
  version: VERSION,
  desc: DESC,
  setting: {
    // Taro 已编译完成，上传时关闭二次编译，避免与产物冲突
    es6: false,
    es7: false,
    minify: false,
    autoPrefixWXSS: false,
    ignoreUploadUnusedFiles: true,
  },
})
  .then(() => {
    console.log(`✓ 上传成功！版本 ${VERSION} 已上传到微信小程序后台`)
    console.log('请在微信公众平台「版本管理」中预览/提交审核')
  })
  .catch(err => {
    console.error('✗ 上传失败：', err.message || err)
    process.exit(1)
  })