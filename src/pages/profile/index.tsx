import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserProfileEditor from '@/components/user-profile-editor'
import {
  User,
  FileText,
  Phone,
  ChevronRight,
  Shield,
  Info,
  Clock,
  CircleCheck,
  CircleX,
  CircleAlert,
  TrendingUp
} from 'lucide-react-taro'
import { Network } from '@/network'

// 订单状态映射
const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待确认', color: '#F59E0B', bgColor: '#FFFBEB' },
  confirmed: { label: '已接单', color: '#0EA5E9', bgColor: '#F0F9FF' },
  scheduled: { label: '已排期', color: '#8B5CF6', bgColor: '#F5F3FF' },
  in_service: { label: '服务中', color: '#0D9488', bgColor: '#F0FDFA' },
  completed: { label: '已完成', color: '#10B981', bgColor: '#ECFDF5' },
  cancelled: { label: '已取消', color: '#EF4444', bgColor: '#FEF2F2' }
}

// 服务项目映射
const SERVICE_NAME_MAP: Record<string, string> = {
  formaldehyde: '除甲醛治理',
  disinfection: '全屋消杀消毒',
  comprehensive: '环境综合治理',
  detection: '空气检测服务'
}

interface Booking {
  id: number
  serviceType: string
  venueType: string
  area: number
  houseStatus: string
  bookingDate: string
  timeSlot: string
  contactName: string
  contactPhone: string
  address: string
  remark: string
  status: string
  createdAt: string
}

const ProfilePage = () => {
  const [orders, setOrders] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ nickname: string; avatar: string } | null>(null)
  const [editing, setEditing] = useState(false)

  // 判断是否小程序环境（直接判断，避免状态延迟导致白屏）
  const isMiniApp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP || Taro.getEnv() === Taro.ENV_TYPE.TT

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      // 获取登录用户的 userId
      const userStr = Taro.getStorageSync('user_info')
      let userId = ''
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          userId = user.id || user.openid || ''
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
      // 如果未登录，使用本地 userId（降级处理）
      if (!userId) {
        userId = Taro.getStorageSync('userId')
      }

      const res = await Network.request({
        url: '/api/bookings',
        method: 'GET',
        data: { userId }
      })
      console.log('订单列表:', res.data)
      const data = res.data?.data || res.data || []
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('获取订单失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 检查登录状态
  const checkLoginStatus = useCallback(() => {
    const userStr = Taro.getStorageSync('user_info')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsLoggedIn(true)
        setUserInfo(user)
      } catch (e) {
        setIsLoggedIn(false)
        setUserInfo(null)
      }
    } else {
      setIsLoggedIn(false)
      setUserInfo(null)
    }
  }, [])

  // 登录函数
  const handleLogin = useCallback(async () => {
    try {
      // 判断环境
      let code = ''
      if (isMiniApp) {
        // 小程序环境：调用微信登录
        const loginRes = await Taro.login()
        code = loginRes.code
      } else {
        // H5 环境：使用模拟登录
        code = `mock_h5_${Date.now()}`
      }

      if (!code) {
        Taro.showToast({ title: '登录失败', icon: 'none' })
        return
      }

      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: { code, nickname: '', avatar: '' }
      })

      console.log('登录响应:', res.data)

      const data = res.data?.data
      if (data?.token && data?.user) {
        Taro.setStorageSync('auth_token', data.token)
        Taro.setStorageSync('user_info', JSON.stringify(data.user))
        setIsLoggedIn(true)
        setUserInfo(data.user)
        Taro.showToast({ title: '登录成功', icon: 'success' })
        // 登录后重新获取订单
        fetchOrders()
      } else {
        Taro.showToast({ title: '登录失败', icon: 'none' })
      }
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({ title: '登录失败', icon: 'none' })
    }
  }, [fetchOrders])

  // 打开编辑资料
  const openEdit = useCallback(() => {
    setEditing(true)
  }, [])

  // 保存编辑资料（微信头像昵称）
  const handleProfileSave = useCallback(async (nickname: string, avatar: string) => {
    const token = Taro.getStorageSync('auth_token')
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    try {
      const res = await Network.request({
        url: '/api/auth/userinfo',
        method: 'PATCH',
        header: { Authorization: `Bearer ${token}` },
        data: { nickname, avatar },
      })
      console.log('更新资料:', res.data)
      const user = res.data?.data
      if (user) {
        Taro.setStorageSync('user_info', JSON.stringify(user))
        setUserInfo(user)
        setEditing(false)
        Taro.showToast({ title: '保存成功', icon: 'success' })
      } else {
        Taro.showToast({ title: '保存失败', icon: 'none' })
      }
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }, [])

  // 页面加载时检查登录状态并获取订单
  useEffect(() => {
    checkLoginStatus()
    fetchOrders()
  }, [checkLoginStatus, fetchOrders])

  // 页面每次显示时刷新订单（TabBar 切换回来时）
  useDidShow(() => {
    fetchOrders()
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} color="#F59E0B" />
      case 'confirmed': return <CircleCheck size={14} color="#0EA5E9" />
      case 'scheduled': return <CircleCheck size={14} color="#8B5CF6" />
      case 'in_service': return <CircleAlert size={14} color="#0D9488" />
      case 'completed': return <CircleCheck size={14} color="#10B981" />
      case 'cancelled': return <CircleX size={14} color="#EF4444" />
      default: return <Clock size={14} color="#94A3B8" />
    }
  }

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab)

  const goToOrderDetail = (orderId: number) => {
    Taro.navigateTo({ url: `/pages/order/detail?id=${orderId}` })
  }

  const cancelOrder = async (orderId: number) => {
    try {
      await Taro.showModal({ title: '确认取消', content: '确定要取消这个预约吗？' })
      await Network.request({
        url: `/api/bookings/${orderId}/cancel`,
        method: 'POST'
      })
      Taro.showToast({ title: '已取消预约', icon: 'success' })
      fetchOrders()
    } catch {
      // 用户取消弹窗或请求失败
    }
  }

  const makePhoneCall = () => {
    Taro.makePhoneCall({ phoneNumber: '400-888-9999' })
  }

  const goToAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  const getTimeSlotLabel = (slot: string) => {
    switch (slot) {
      case 'morning': return '上午'
      case 'afternoon': return '下午'
      case 'allday': return '全天'
      default: return slot
    }
  }

  return (
    <View className="min-h-full bg-slate-50">
      <ScrollView scrollY className="h-full">
        {/* 用户信息头部 */}
        <View className="bg-white px-4 pt-6 pb-5">
          <View className="flex items-center gap-3">
            {isLoggedIn && userInfo ? (
              editing ? (
                // 编辑资料模式（微信头像昵称填写能力）
                <UserProfileEditor
                  isMiniApp={isMiniApp}
                  initialNickname={userInfo.nickname || ''}
                  initialAvatar={userInfo.avatar || ''}
                  onSave={handleProfileSave}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                // 已登录展示
                <>
                  <View className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden">
                    {userInfo.avatar ? (
                      <Image src={userInfo.avatar} className="w-full h-full" mode="aspectFill" />
                    ) : (
                      <User size={28} color="#0D9488" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="block text-lg font-bold text-slate-800">{userInfo.nickname || '微信用户'}</Text>
                    <Text className="block text-xs text-slate-400 mt-1">
                      微信一键登录，可查看所有预约
                    </Text>
                  </View>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={openEdit}>
                    编辑
                  </Button>
                </>
              )
            ) : (
              <>
                <View className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={28} color="#94A3B8" />
                </View>
                <View className="flex-1">
                  <Text className="block text-lg font-bold text-slate-800">未登录</Text>
                  <Text className="block text-xs text-slate-400 mt-1">
                    用微信一键登录，查看预约记录
                  </Text>
                </View>
                <Button size="sm" className="bg-teal-600 text-white rounded-lg" onClick={handleLogin}>微信一键登录</Button>
              </>
            )}
          </View>
        </View>

        {/* 快捷功能 */}
        <View className="px-4 mt-3">
          <View className="grid grid-cols-4 gap-3 bg-white rounded-xl p-4">
            {[
              { icon: FileText, label: '我的预约', count: orders.length },
              { icon: Clock, label: '待确认', count: orders.filter(o => o.status === 'pending').length },
              { icon: CircleCheck, label: '已完成', count: orders.filter(o => o.status === 'completed').length },
              { icon: Phone, label: '联系客服', count: -1 }
            ].map((item) => {
              const IconComp = item.icon
              return (
                <View
                  key={item.label}
                  className="flex flex-col items-center gap-2"
                  onClick={item.label === '联系客服' ? makePhoneCall : undefined}
                >
                  <View className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <IconComp size={18} color="#0D9488" />
                  </View>
                  <Text className="text-xs text-slate-600">{item.label}</Text>
                  {item.count >= 0 && (
                    <Text className="text-xs font-bold text-teal-600">{item.count}</Text>
                  )}
                </View>
              )
            })}
          </View>
        </View>

        {/* 商户管理入口 */}
        <View className="px-4 mt-3">
          <Card
            className="border-0 shadow-none bg-gradient-to-r from-teal-600 to-teal-700 cursor-pointer"
            onClick={() => Taro.navigateTo({ url: '/pages/admin/login' })}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <View>
                <Text className="block text-base font-bold text-white">商户管理后台</Text>
                <Text className="block text-xs text-white text-opacity-80 mt-1">
                  商户登录进入管理系统
                </Text>
              </View>
              <View className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <TrendingUp size={20} color="#FFFFFF" />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 订单列表 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">我的预约</Text>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-50 rounded-lg mb-3">
                  <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">待确认</TabsTrigger>
                  <TabsTrigger value="confirmed" className="text-xs">已接单</TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs">已完成</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {loading ? (
                    <View className="flex items-center justify-center py-8">
                      <Text className="text-sm text-slate-400">加载中...</Text>
                    </View>
                  ) : filteredOrders.length === 0 ? (
                    <View className="flex flex-col items-center justify-center py-8">
                      <FileText size={40} color="#CBD5E1" />
                      <Text className="text-sm text-slate-400 mt-3">暂无预约记录</Text>
                      <Button
                        className="mt-3 bg-teal-600 text-white rounded-lg"
                        size="sm"
                        onClick={() => Taro.switchTab({ url: '/pages/booking/create' })}
                      >
                        去预约
                      </Button>
                    </View>
                  ) : (
                    <View className="flex flex-col gap-3">
                      {filteredOrders.map((order) => {
                        const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending
                        return (
                          <View
                            key={order.id}
                            className="border border-slate-100 rounded-xl p-3"
                            onClick={() => goToOrderDetail(order.id)}
                          >
                            <View className="flex items-center justify-between mb-2">
                              <Text className="text-sm font-semibold text-slate-800">
                                {SERVICE_NAME_MAP[order.serviceType] || order.serviceType}
                              </Text>
                              <View
                                className="flex items-center gap-1 px-2 py-1 rounded-full"
                                style={{ backgroundColor: statusInfo.bgColor }}
                              >
                                {getStatusIcon(order.status)}
                                <Text
                                  className="text-xs font-medium"
                                  style={{ color: statusInfo.color }}
                                >
                                  {statusInfo.label}
                                </Text>
                              </View>
                            </View>
                            <View className="flex items-center gap-2 mb-1">
                              <Text className="text-xs text-slate-400">
                                {order.bookingDate} {getTimeSlotLabel(order.timeSlot)}
                              </Text>
                            </View>
                            <View className="flex items-center gap-2">
                              <Text className="text-xs text-slate-400 truncate flex-1">
                                {order.address}
                              </Text>
                              <ChevronRight size={14} color="#CBD5E1" />
                            </View>
                            {order.status === 'pending' && (
                              <View className="mt-2 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs text-red-500 border-red-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    cancelOrder(order.id)
                                  }}
                                >
                                  取消预约
                                </Button>
                              </View>
                            )}
                          </View>
                        )
                      })}
                    </View>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </View>

        {/* 其他功能 */}
        <View className="px-4 mt-3 mb-4">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-0">
              <View
                className="flex items-center justify-between p-4 border-b border-slate-50"
                onClick={goToAbout}
              >
                <View className="flex items-center gap-3">
                  <Shield size={18} color="#0D9488" />
                  <Text className="text-sm text-slate-700">关于我们 / 服务保障</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </View>
              <View
                className="flex items-center justify-between p-4 border-b border-slate-50"
                onClick={makePhoneCall}
              >
                <View className="flex items-center gap-3">
                  <Phone size={18} color="#0D9488" />
                  <Text className="text-sm text-slate-700">联系客服</Text>
                </View>
                <View className="flex items-center gap-1">
                  <Text className="text-xs text-slate-400">400-888-9999</Text>
                  <ChevronRight size={16} color="#CBD5E1" />
                </View>
              </View>
              <View className="flex items-center justify-between p-4">
                <View className="flex items-center gap-3">
                  <Info size={18} color="#0D9488" />
                  <Text className="text-sm text-slate-700">服务说明</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
