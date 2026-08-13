import { useState, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input as UiInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Network } from '@/network'
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react-taro'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useDidShow(() => {
    // 检查是否已登录
    const token = Taro.getStorageSync('admin_token')
    if (token) {
      Taro.redirectTo({ url: '/pages/admin/index' })
    }
  })

  const handleLogin = useCallback(async () => {
    if (!username.trim()) {
      setError('请输入账号')
      return
    }
    if (!password.trim()) {
      setError('请输入密码')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await Network.request({
        url: '/api/auth/admin/login',
        method: 'POST',
        data: { username: username.trim(), password: password.trim() }
      })

      console.log('[AdminLogin] 登录响应:', res.data)

      if (res.data?.code === 200 && res.data?.data?.token) {
        // 保存商户登录信息
        Taro.setStorageSync('admin_token', res.data.data.token)
        Taro.setStorageSync('admin_info', res.data.data.admin)
        
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/admin/index' })
        }, 500)
      } else {
        setError(res.data?.msg || '登录失败')
      }
    } catch (err) {
      console.error('[AdminLogin] 登录失败:', err)
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }, [username, password])

  return (
    <View className="min-h-screen bg-slate-50">
      {/* 顶部品牌区 */}
      <View className="bg-teal-600 px-6 pt-12 pb-8">
        <View className="flex items-center justify-center mb-4">
          <Shield size={48} color="#ffffff" />
        </View>
        <Text className="block text-center text-2xl font-bold text-white">
          森易家商户后台
        </Text>
        <Text className="block text-center text-sm text-white text-opacity-80 mt-2">
          专业环境治理服务平台
        </Text>
      </View>

      {/* 登录表单 */}
      <View className="px-6 -mt-4">
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <Text className="block text-lg font-semibold text-slate-800 mb-6">
              商户登录
            </Text>

            {/* 账号输入 */}
            <View className="mb-4">
              <Label className="text-sm text-slate-600 mb-2 block">账号</Label>
              <View className="bg-slate-50 rounded-xl px-4 py-3 flex flex-row items-center gap-2">
                <User size={18} color="#64748B" />
                <UiInput
                  className="flex-1 bg-transparent"
                  placeholder="请输入商户账号"
                  value={username}
                  onInput={(e) => setUsername(e.detail.value)}
                />
              </View>
            </View>

            {/* 密码输入 */}
            <View className="mb-4">
              <Label className="text-sm text-slate-600 mb-2 block">密码</Label>
              <View className="bg-slate-50 rounded-xl px-4 py-3 flex flex-row items-center gap-2">
                <Lock size={18} color="#64748B" />
                <UiInput
                  className="flex-1 bg-transparent"
                  placeholder="请输入密码"
                  password={!showPassword}
                  value={password}
                  onInput={(e) => setPassword(e.detail.value)}
                />
                <View onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={18} color="#94A3B8" />
                  ) : (
                    <Eye size={18} color="#94A3B8" />
                  )}
                </View>
              </View>
            </View>

            {/* 错误提示 */}
            {error ? (
              <View className="bg-red-50 rounded-lg p-3 mb-4">
                <Text className="block text-sm text-red-600">{error}</Text>
              </View>
            ) : null}

            {/* 登录按钮 */}
            <Button
              className="w-full bg-teal-600 text-white rounded-xl py-3 mt-2"
              onClick={handleLogin}
              disabled={loading}
            >
              <Text className="block text-base font-medium">
                {loading ? '登录中...' : '登录'}
              </Text>
            </Button>

            {/* 提示信息 */}
            <View className="mt-6 p-4 bg-teal-50 rounded-xl">
              <Text className="block text-xs text-teal-700 leading-relaxed">
                <Text className="block font-medium mb-1">测试账号：</Text>
                账号：admin{'\n'}
                密码：admin123
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 底部说明 */}
      <View className="px-6 mt-8">
        <Text className="block text-center text-xs text-slate-400">
          仅限授权商户使用{'\n'}
          如有疑问请联系平台客服
        </Text>
      </View>
    </View>
  )
}
