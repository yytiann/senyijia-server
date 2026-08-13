import { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Network } from '@/network'

type OrderStatus = 'pending' | 'confirmed' | 'scheduled' | 'in_service' | 'completed' | 'cancelled'

interface Booking {
  id: number
  userId: string
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
  status: OrderStatus
  scheduleStartTime?: string
  scheduleDuration?: number
  createdAt: string
}

interface AdminInfo {
  id: string
  username: string
  name: string
  role: string
}

export default function AdminWeb() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const [orders, setOrders] = useState<Booking[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    scheduled: 0,
    inService: 0,
    completed: 0,
    cancelled: 0
  })

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleDuration, setScheduleDuration] = useState(2)

  // 检查登录状态
  useEffect(() => {
    const token = Taro.getStorageSync('admin_token')
    if (token) {
      checkLoginStatus()
    }
  }, [])

  const checkLoginStatus = async () => {
    try {
      const res = await Network.request({
        url: '/api/auth/admin/info',
        method: 'GET'
      })
      console.log('获取商户信息:', res.data)
      if (res.data?.code === 200) {
        setAdminInfo(res.data.data)
        setIsLoggedIn(true)
        fetchOrders()
        fetchStatistics()
      }
    } catch (err) {
      console.error('检查登录状态失败:', err)
      Taro.removeStorageSync('admin_token')
    }
  }

  // 登录
  const handleLogin = async () => {
    if (!username || !password) {
      setLoginError('请输入账号和密码')
      return
    }

    setLoading(true)
    setLoginError('')

    try {
      const res = await Network.request({
        url: '/api/auth/admin/login',
        method: 'POST',
        data: { username, password }
      })

      console.log('登录响应:', res.data)

      if (res.data?.code === 200) {
        const { token, admin } = res.data.data
        Taro.setStorageSync('admin_token', token)
        Taro.setStorageSync('admin_info', admin)
        setAdminInfo(admin)
        setIsLoggedIn(true)
        fetchOrders()
        fetchStatistics()
      } else {
        setLoginError(res.data?.msg || '登录失败')
      }
    } catch (err: any) {
      console.error('登录失败:', err)
      setLoginError(err?.data?.msg || '登录失败，请检查账号密码')
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const handleLogout = async () => {
    try {
      await Network.request({
        url: '/api/auth/admin/logout',
        method: 'POST'
      })
    } catch (err) {
      console.error('登出失败:', err)
    } finally {
      Taro.removeStorageSync('admin_token')
      Taro.removeStorageSync('admin_info')
      setIsLoggedIn(false)
      setAdminInfo(null)
    }
  }

  // 获取订单列表
  const fetchOrders = useCallback(async () => {
    try {
      const res = await Network.request({
        url: '/api/bookings',
        method: 'GET'
      })
      console.log('订单列表:', res.data)
      const data = res.data?.data || res.data || []
      const orderList = Array.isArray(data) ? data : []
      setOrders(orderList)
      applyFilter(orderList, statusFilter)
    } catch (err) {
      console.error('获取订单失败:', err)
    }
  }, [statusFilter])

  // 获取统计数据
  const fetchStatistics = useCallback(async () => {
    try {
      const res = await Network.request({
        url: '/api/bookings/meta/statistics',
        method: 'GET'
      })
      console.log('统计数据:', res.data)
      const data = res.data?.data || {}
      const byStatus = data.byStatus || {}
      setStatistics({
        total: data.total || 0,
        pending: byStatus.pending || 0,
        confirmed: byStatus.confirmed || 0,
        scheduled: byStatus.scheduled || 0,
        inService: byStatus.in_service || 0,
        completed: byStatus.completed || 0,
        cancelled: byStatus.cancelled || 0
      })
    } catch (err) {
      console.error('获取统计失败:', err)
    }
  }, [])

  // 应用筛选
  const applyFilter = (orderList: Booking[], status: string) => {
    if (status === 'all') {
      setFilteredOrders(orderList)
    } else {
      setFilteredOrders(orderList.filter(o => o.status === status))
    }
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    applyFilter(orders, status)
  }

  // 接单
  const handleConfirm = async (id: number) => {
    try {
      const res = await Network.request({
        url: `/api/bookings/${id}/confirm`,
        method: 'POST'
      })
      if (res.data?.code === 200) {
        Taro.showToast({ title: '接单成功', icon: 'success' })
        fetchOrders()
        fetchStatistics()
      }
    } catch (err) {
      console.error('接单失败:', err)
      Taro.showToast({ title: '接单失败', icon: 'error' })
    }
  }

  // 打开排期弹窗
  const openScheduleModal = (order: Booking) => {
    setSelectedOrder(order)
    setScheduleDate(order.bookingDate || '')
    setScheduleTime('09:00')
    setScheduleDuration(2)
    setShowScheduleModal(true)
  }

  // 提交排期
  const submitSchedule = async () => {
    if (!selectedOrder || !scheduleDate) {
      Taro.showToast({ title: '请选择日期', icon: 'error' })
      return
    }

    try {
      const res = await Network.request({
        url: `/api/bookings/${selectedOrder.id}/schedule`,
        method: 'POST',
        data: {
          bookingDate: scheduleDate,
          timeSlot: 'all_day',
          scheduleStartTime: scheduleTime,
          scheduleDuration
        }
      })

      if (res.data?.code === 200) {
        Taro.showToast({ title: '排期成功', icon: 'success' })
        setShowScheduleModal(false)
        fetchOrders()
        fetchStatistics()
      }
    } catch (err) {
      console.error('排期失败:', err)
      Taro.showToast({ title: '排期失败', icon: 'error' })
    }
  }

  // 标记完成
  const handleComplete = async (id: number) => {
    try {
      const res = await Network.request({
        url: `/api/bookings/${id}/complete`,
        method: 'POST'
      })
      if (res.data?.code === 200) {
        Taro.showToast({ title: '已完成', icon: 'success' })
        fetchOrders()
        fetchStatistics()
      }
    } catch (err) {
      console.error('标记完成失败:', err)
      Taro.showToast({ title: '操作失败', icon: 'error' })
    }
  }

  // 获取状态文本
  const getStatusText = (status: OrderStatus) => {
    const map = {
      pending: '待确认',
      confirmed: '已接单',
      scheduled: '已排期',
      in_service: '服务中',
      completed: '已完成',
      cancelled: '已取消'
    }
    return map[status] || status
  }

  // 获取状态颜色
  const getStatusColor = (status: OrderStatus) => {
    const map = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      scheduled: '#8b5cf6',
      in_service: '#06b6d4',
      completed: '#10b981',
      cancelled: '#6b7280'
    }
    return map[status] || '#6b7280'
  }

  // 获取服务类型文本
  const getServiceText = (type: string) => {
    const map: Record<string, string> = {
      formaldehyde: '除甲醛治理',
      disinfection: '全屋消杀消毒',
      comprehensive: '环境综合治理',
      detection: '环境检测服务'
    }
    return map[type] || type
  }

  // 登录页面
  if (!isLoggedIn) {
    return (
      <View style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: '400px', background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <View style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f766e', display: 'block' }}>森易家商户管理后台</Text>
            <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', display: 'block' }}>Environmental Governance Management</Text>
          </View>

          <View style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', display: 'block' }}>账号</Text>
            <Input
              style={{ width: '100%', height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px', fontSize: '14px' }}
              placeholder="请输入账号"
              value={username}
              onInput={(e) => setUsername(e.detail.value)}
            />
          </View>

          <View style={{ marginBottom: '24px' }}>
            <Text style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', display: 'block' }}>密码</Text>
            <Input
              style={{ width: '100%', height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px', fontSize: '14px' }}
              placeholder="请输入密码"
              password
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
            />
          </View>

          {loginError && (
            <View style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
              <Text style={{ fontSize: '14px', color: '#dc2626', display: 'block' }}>{loginError}</Text>
            </View>
          )}

          <Button
            style={{ width: '100%', height: '44px', background: '#0f766e', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', border: 'none' }}
            onClick={handleLogin}
          >
            {loading ? '登录中...' : '登 录'}
          </Button>

          <View style={{ marginTop: '24px', padding: '16px', background: '#f0fdfa', borderRadius: '8px' }}>
            <Text style={{ fontSize: '13px', color: '#0f766e', display: 'block', fontWeight: 'bold' }}>测试账号</Text>
            <Text style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', display: 'block' }}>账号：admin</Text>
            <Text style={{ fontSize: '13px', color: '#6b7280', display: 'block' }}>密码：admin123</Text>
          </View>
        </View>
      </View>
    )
  }

  // 管理后台主界面
  return (
    <View style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex' }}>
      {/* 侧边栏 */}
      <View style={{ width: '240px', background: '#0f766e', color: '#fff', minHeight: '100vh', padding: '24px 0' }}>
        <View style={{ padding: '0 24px', marginBottom: '32px' }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', display: 'block' }}>森易家</Text>
          <Text style={{ fontSize: '12px', color: '#99f6e4', marginTop: '4px', display: 'block' }}>商户管理后台</Text>
        </View>

        <View style={{ padding: '0 12px' }}>
          <View style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '8px' }}>
            <Text style={{ fontSize: '14px', display: 'block' }}>订单管理</Text>
          </View>
          <View style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '8px' }}>
            <Text style={{ fontSize: '14px', color: '#99f6e4', display: 'block' }}>数据统计</Text>
          </View>
          <View style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '8px' }}>
            <Text style={{ fontSize: '14px', color: '#99f6e4', display: 'block' }}>客户管理</Text>
          </View>
          <View style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '8px' }}>
            <Text style={{ fontSize: '14px', color: '#99f6e4', display: 'block' }}>系统设置</Text>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: '24px', left: '0', right: '0', padding: '0 12px' }}>
          <View style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Text style={{ fontSize: '13px', color: '#99f6e4', display: 'block', marginBottom: '4px' }}>{adminInfo?.name || '管理员'}</Text>
            <View onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <Text style={{ fontSize: '13px', color: '#fca5a5', display: 'block' }}>退出登录</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 主内容区 */}
      <View style={{ flex: 1, padding: '32px' }}>
        {/* 顶部栏 */}
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', display: 'block' }}>订单管理</Text>
          <Text style={{ fontSize: '14px', color: '#6b7280', display: 'block' }}>{new Date().toLocaleDateString('zh-CN')}</Text>
        </View>

        {/* 数据概览 */}
        <View style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          <View style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Text style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>总预约数</Text>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f766e', display: 'block' }}>{statistics.total}</Text>
          </View>
          <View style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Text style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>待处理</Text>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', display: 'block' }}>{statistics.pending}</Text>
          </View>
          <View style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Text style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>已完成</Text>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', display: 'block' }}>{statistics.completed}</Text>
          </View>
        </View>

        {/* 筛选栏 */}
        <View style={{ background: '#fff', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {['all', 'pending', 'confirmed', 'scheduled', 'completed'].map((status) => (
            <View
              key={status}
              onClick={() => handleStatusFilter(status)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: statusFilter === status ? '#0f766e' : '#f3f4f6',
                color: statusFilter === status ? '#fff' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {status === 'all' ? '全部' : getStatusText(status as OrderStatus)}
            </View>
          ))}
        </View>

        {/* 订单列表 */}
        <View style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <View style={{ display: 'flex', background: '#f9fafb', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <Text style={{ flex: 1, fontSize: '13px', color: '#6b7280', fontWeight: 'bold', display: 'block' }}>订单号</Text>
            <Text style={{ flex: 2, fontSize: '13px', color: '#6b7280', fontWeight: 'bold', display: 'block' }}>服务类型</Text>
            <Text style={{ flex: 2, fontSize: '13px', color: '#6b7280', fontWeight: 'bold', display: 'block' }}>客户信息</Text>
            <Text style={{ flex: 2, fontSize: '13px', color: '#6b7280', fontWeight: 'bold', display: 'block' }}>预约时间</Text>
            <Text style={{ flex: 1, fontSize: '13px', color: '#6b7280', fontWeight: 'bold', display: 'block' }}>状态</Text>
            <Text style={{ flex: 2, fontSize: '13px', color: '#6b7280', fontWeight: 'bold', display: 'block' }}>操作</Text>
          </View>

          {filteredOrders.length === 0 ? (
            <View style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Text style={{ fontSize: '14px', color: '#9ca3af', display: 'block' }}>暂无订单</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <View key={order.id} style={{ display: 'flex', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                <Text style={{ flex: 1, fontSize: '14px', color: '#6b7280', display: 'block' }}>#{order.id}</Text>
                <Text style={{ flex: 2, fontSize: '14px', color: '#1f2937', display: 'block' }}>{getServiceText(order.serviceType)}</Text>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: '14px', color: '#1f2937', display: 'block' }}>{order.contactName}</Text>
                  <Text style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', display: 'block' }}>{order.contactPhone}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: '14px', color: '#1f2937', display: 'block' }}>{order.bookingDate}</Text>
                  <Text style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', display: 'block' }}>{order.scheduleStartTime ? `${order.scheduleStartTime} (${order.scheduleDuration}h)` : order.timeSlot}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: getStatusColor(order.status) + '20' }}>
                    <Text style={{ fontSize: '12px', color: getStatusColor(order.status), display: 'block' }}>{getStatusText(order.status)}</Text>
                  </View>
                </View>
                <View style={{ flex: 2, display: 'flex', gap: '8px' }}>
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      style={{ background: '#0f766e', color: '#fff', border: 'none', fontSize: '12px' }}
                      onClick={() => handleConfirm(order.id)}
                    >
                      接单
                    </Button>
                  )}
                  {(order.status === 'confirmed' || order.status === 'scheduled') && (
                    <Button
                      size="sm"
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', fontSize: '12px' }}
                      onClick={() => openScheduleModal(order)}
                    >
                      排期
                    </Button>
                  )}
                  {order.status === 'scheduled' && (
                    <Button
                      size="sm"
                      style={{ background: '#10b981', color: '#fff', border: 'none', fontSize: '12px' }}
                      onClick={() => handleComplete(order.id)}
                    >
                      完成
                    </Button>
                  )}
                  <Button
                    size="sm"
                    style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', fontSize: '12px' }}
                    onClick={() => Taro.makePhoneCall({ phoneNumber: order.contactPhone })}
                  >
                    联系
                  </Button>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 排期弹窗 */}
        {showScheduleModal && selectedOrder && (
          <View style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <View style={{ width: '500px', background: '#fff', borderRadius: '16px', padding: '32px' }}>
              <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', display: 'block', marginBottom: '24px' }}>订单排期</Text>

              <View style={{ marginBottom: '20px' }}>
                <Text style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>客户信息</Text>
                <Text style={{ fontSize: '14px', color: '#1f2937', display: 'block' }}>{selectedOrder.contactName} - {selectedOrder.contactPhone}</Text>
                <Text style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', display: 'block' }}>{selectedOrder.address}</Text>
              </View>

              <View style={{ marginBottom: '20px' }}>
                <Text style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>服务类型</Text>
                <Text style={{ fontSize: '14px', color: '#1f2937', display: 'block' }}>{getServiceText(selectedOrder.serviceType)} - {selectedOrder.area}㎡</Text>
              </View>

              <View style={{ marginBottom: '20px' }}>
                <Text style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>排期日期</Text>
                <Input
                  type="text"
                  style={{ width: '100%', height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px', fontSize: '14px' }}
                  value={scheduleDate}
                  onInput={(e) => setScheduleDate(e.detail.value)}
                />
              </View>

              <View style={{ marginBottom: '20px' }}>
                <Text style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>开始时间</Text>
                <Input
                  type="text"
                  style={{ width: '100%', height: '44px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px', fontSize: '14px' }}
                  value={scheduleTime}
                  onInput={(e) => setScheduleTime(e.detail.value)}
                />
              </View>

              <View style={{ marginBottom: '24px' }}>
                <Text style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>服务时长</Text>
                <View style={{ display: 'flex', gap: '8px' }}>
                  {[2, 3, 4, 5, 6].map((hours) => (
                    <View
                      key={hours}
                      onClick={() => setScheduleDuration(hours)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: scheduleDuration === hours ? '#0f766e' : '#f3f4f6',
                        color: scheduleDuration === hours ? '#fff' : '#4b5563',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {hours}小时
                    </View>
                  ))}
                </View>
                <Text style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px', display: 'block' }}>
                  预计结束：{scheduleTime} + {scheduleDuration}小时
                </Text>
              </View>

              <View style={{ display: 'flex', gap: '12px' }}>
                <Button
                  style={{ flex: 1, height: '44px', background: '#f3f4f6', color: '#4b5563', borderRadius: '8px', border: 'none', fontSize: '14px' }}
                  onClick={() => setShowScheduleModal(false)}
                >
                  取消
                </Button>
                <Button
                  style={{ flex: 1, height: '44px', background: '#0f766e', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 'bold' }}
                  onClick={submitSchedule}
                >
                  确认排期
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
