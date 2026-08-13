import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  FileText,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CircleCheck,
  CircleX,
  CircleAlert,
  TrendingUp,
  Users
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

// 场地类型映射
const VENUE_TYPE_MAP: Record<string, string> = {
  home: '家庭住宅',
  office: '办公室',
  shop: '商铺',
  factory: '厂房',
  other: '其他'
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

interface Statistics {
  total: number
  pending: number
  confirmed: number
  scheduled: number
  inService: number
  completed: number
  cancelled: number
  byService: Record<string, number>
}

const AdminPage = () => {
  const [orders, setOrders] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    confirmed: 0,
    scheduled: 0,
    inService: 0,
    completed: 0,
    cancelled: 0,
    byService: {}
  })

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/bookings',
        method: 'GET'
      })
      console.log('商户端订单列表:', res.data)
      const data = res.data?.data || res.data || []
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('获取订单失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStatistics = useCallback(async () => {
    try {
      const res = await Network.request({
        url: '/api/bookings/meta/statistics',
        method: 'GET'
      })
      console.log('统计数据:', res.data)
      const data = res.data?.data || res.data
      if (data) {
        setStatistics(data)
      }
    } catch (err) {
      console.error('获取统计失败:', err)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    fetchStatistics()
  }, [fetchOrders, fetchStatistics])

  useDidShow(() => {
    fetchOrders()
    fetchStatistics()
  })

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab)

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

  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleOrderId, setScheduleOrderId] = useState<number | null>(null)

  const confirmOrder = async (orderId: number) => {
    try {
      await Taro.showModal({ title: '确认接单', content: '确定要接受这个预约订单吗？' })
      await Network.request({
        url: `/api/bookings/${orderId}/confirm`,
        method: 'POST'
      })
      Taro.showToast({ title: '已接单', icon: 'success' })
      fetchOrders()
      fetchStatistics()
    } catch {
      // 用户取消弹窗或请求失败
    }
  }

  const openScheduleModal = (orderId: number) => {
    setScheduleOrderId(orderId)
    setScheduleDate('')
  }

  const submitSchedule = async () => {
    if (!scheduleOrderId || !scheduleDate) {
      Taro.showToast({ title: '请输入排期日期', icon: 'none' })
      return
    }
    try {
      await Network.request({
        url: `/api/bookings/${scheduleOrderId}/schedule`,
        method: 'POST',
        data: {
          bookingDate: scheduleDate,
          timeSlot: 'morning'
        }
      })
      Taro.showToast({ title: '已排期', icon: 'success' })
      setScheduleOrderId(null)
      fetchOrders()
      fetchStatistics()
    } catch {
      // 请求失败
    }
  }

  const completeOrder = async (orderId: number) => {
    try {
      await Taro.showModal({ title: '标记完成', content: '确定这个订单已完成服务吗？' })
      await Network.request({
        url: `/api/bookings/${orderId}/complete`,
        method: 'POST'
      })
      Taro.showToast({ title: '已完成', icon: 'success' })
      fetchOrders()
      fetchStatistics()
    } catch {
      // 用户取消弹窗或请求失败
    }
  }

  const callCustomer = (phone: string) => {
    Taro.makePhoneCall({ phoneNumber: phone })
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
    <View className="min-h-screen bg-slate-50">
      {/* 统计卡片 */}
      <View className="bg-gradient-to-br from-teal-600 to-teal-700 px-4 pt-8 pb-6">
        <Text className="block text-xl font-bold text-white mb-4">数据概览</Text>
        <View className="flex flex-row gap-3">
          <View className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <Text className="block text-2xl font-bold text-white">{statistics.total}</Text>
            <Text className="block text-xs text-white mt-1">总预约</Text>
          </View>
          <View className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <Text className="block text-2xl font-bold text-white">{statistics.pending}</Text>
            <Text className="block text-xs text-white mt-1">待处理</Text>
          </View>
          <View className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <Text className="block text-2xl font-bold text-white">{statistics.completed}</Text>
            <Text className="block text-xs text-white mt-1">已完成</Text>
          </View>
        </View>
      </View>

      {/* 订单管理 */}
      <View className="px-4 py-4">
        <Text className="block text-lg font-bold text-slate-800 mb-3">订单管理</Text>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pending">待确认</TabsTrigger>
            <TabsTrigger value="confirmed">已接单</TabsTrigger>
            <TabsTrigger value="scheduled">已排期</TabsTrigger>
            <TabsTrigger value="all">全部</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <View className="py-12 text-center">
                <Text className="text-slate-400">加载中...</Text>
              </View>
            ) : filteredOrders.length === 0 ? (
              <View className="py-12 text-center">
                <FileText size={48} color="#CBD5E1" />
                <Text className="block text-slate-400 mt-3">暂无订单</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending
                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        {/* 订单头部 */}
                        <View className="flex items-center justify-between mb-3">
                          <View className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Text className="text-sm font-semibold" style={{ color: statusInfo.color }}>
                              {statusInfo.label}
                            </Text>
                          </View>
                          <Text className="text-xs text-slate-400">
                            #{String(order.id).padStart(4, '0')}
                          </Text>
                        </View>

                        {/* 订单信息 */}
                        <View className="space-y-2 mb-3">
                          <View className="flex items-center gap-2">
                            <TrendingUp size={14} color="#64748B" />
                            <Text className="text-sm text-slate-700">
                              {SERVICE_NAME_MAP[order.serviceType] || order.serviceType}
                            </Text>
                          </View>
                          <View className="flex items-center gap-2">
                            <Users size={14} color="#64748B" />
                            <Text className="text-sm text-slate-700">
                              {VENUE_TYPE_MAP[order.venueType] || order.venueType} · {order.area}㎡
                            </Text>
                          </View>
                          <View className="flex items-center gap-2">
                            <Calendar size={14} color="#64748B" />
                            <Text className="text-sm text-slate-700">
                              {order.bookingDate} {getTimeSlotLabel(order.timeSlot)}
                            </Text>
                          </View>
                          <View className="flex items-center gap-2">
                            <Phone size={14} color="#64748B" />
                            <Text className="text-sm text-slate-700">
                              {order.contactName} · {order.contactPhone}
                            </Text>
                          </View>
                          <View className="flex items-start gap-2">
                            <MapPin size={14} color="#64748B" className="mt-1" />
                            <Text className="text-sm text-slate-700 flex-1">{order.address}</Text>
                          </View>
                          {order.remark && (
                            <View className="bg-slate-50 rounded-lg p-2 mt-2">
                              <Text className="text-xs text-slate-600">备注：{order.remark}</Text>
                            </View>
                          )}
                        </View>

                        {/* 操作按钮 */}
                        <View className="flex gap-2 pt-3 border-t border-slate-100">
                          {order.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                                onClick={() => confirmOrder(order.id)}
                              >
                                <CircleCheck size={14} color="#FFFFFF" className="mr-1" />
                                接单
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => callCustomer(order.contactPhone)}
                              >
                                <Phone size={14} color="#64748B" className="mr-1" />
                                联系
                              </Button>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                onClick={() => openScheduleModal(order.id)}
                              >
                                <Calendar size={14} color="#FFFFFF" className="mr-1" />
                                排期
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => callCustomer(order.contactPhone)}
                              >
                                <Phone size={14} color="#64748B" className="mr-1" />
                                联系
                              </Button>
                            </>
                          )}
                          {order.status === 'scheduled' && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                                onClick={() => completeOrder(order.id)}
                              >
                                <CircleCheck size={14} color="#FFFFFF" className="mr-1" />
                                完成
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => callCustomer(order.contactPhone)}
                              >
                                <Phone size={14} color="#64748B" className="mr-1" />
                                联系
                              </Button>
                            </>
                          )}
                          {(order.status === 'in_service' || order.status === 'completed') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => callCustomer(order.contactPhone)}
                            >
                              <Phone size={14} color="#64748B" className="mr-1" />
                              联系客户
                            </Button>
                          )}
                        </View>
                      </CardContent>
                    </Card>
                  )
                })}
              </View>
            )}
          </TabsContent>
        </Tabs>
      </View>

      {/* 排期弹窗 */}
      <Dialog open={scheduleOrderId !== null} onOpenChange={(open) => !open && setScheduleOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>设置排期日期</DialogTitle>
          </DialogHeader>
          <View className="py-4">
            <View className="bg-slate-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入日期，如 2026-08-20"
                value={scheduleDate}
                onInput={(e) => setScheduleDate(e.detail.value)}
              />
            </View>
          </View>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOrderId(null)}>
              取消
            </Button>
            <Button className="bg-teal-600" onClick={submitSchedule}>
              确认排期
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}

export default AdminPage
