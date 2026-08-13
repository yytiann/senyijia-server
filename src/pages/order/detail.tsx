import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Clock,
  CircleCheck,
  CircleX,
  CircleAlert
} from 'lucide-react-taro'
import { Network } from '@/network'

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: '待商家确认', color: '#F59E0B', bgColor: '#FFFBEB', icon: Clock },
  confirmed: { label: '已接单', color: '#0EA5E9', bgColor: '#F0F9FF', icon: CircleCheck },
  scheduled: { label: '已排期', color: '#8B5CF6', bgColor: '#F5F3FF', icon: CircleCheck },
  in_service: { label: '服务中', color: '#0D9488', bgColor: '#F0FDFA', icon: CircleAlert },
  completed: { label: '已完成', color: '#10B981', bgColor: '#ECFDF5', icon: CircleCheck },
  cancelled: { label: '已取消', color: '#EF4444', bgColor: '#FEF2F2', icon: CircleX }
}

const SERVICE_NAME_MAP: Record<string, string> = {
  formaldehyde: '除甲醛治理',
  disinfection: '全屋消杀消毒',
  comprehensive: '室内环境综合治理',
  detection: '空气检测服务'
}

const VENUE_NAME_MAP: Record<string, string> = {
  home: '家庭住宅',
  office: '办公室',
  shop: '商铺',
  factory: '厂房',
  other: '其他'
}

const TIME_SLOT_MAP: Record<string, string> = {
  morning: '上午 (9:00-12:00)',
  afternoon: '下午 (13:00-17:00)',
  allday: '全天均可'
}

const HOUSE_STATUS_MAP: Record<string, string> = {
  newly_decorated: '刚装修完工',
  occupied: '已入住',
  vacant: '空置中'
}

interface OrderDetail {
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
  adminRemark: string
}

const OrderDetailPage = () => {
  const router = useRouter()
  const orderId = router.params.id
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useState(() => {
    fetchOrderDetail()
  })

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/bookings/${orderId}`,
        method: 'GET'
      })
      console.log('订单详情:', res.data)
      const data = res.data?.data || res.data
      setOrder(data)
    } catch (err) {
      console.error('获取订单详情失败:', err)
    } finally {
      setLoading(false)
    }
  }, [orderId])

  const cancelOrder = async () => {
    if (!order) return
    try {
      await Taro.showModal({ title: '确认取消', content: '确定要取消这个预约吗？取消后不可恢复。' })
      await Network.request({
        url: `/api/bookings/${order.id}/cancel`,
        method: 'POST'
      })
      Taro.showToast({ title: '已取消预约', icon: 'success' })
      fetchOrderDetail()
    } catch {
      // 用户取消弹窗或请求失败
    }
  }

  if (loading) {
    return (
      <View className="min-h-full bg-slate-50 flex items-center justify-center">
        <Text className="text-sm text-slate-400">加载中...</Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View className="min-h-full bg-slate-50 flex items-center justify-center">
        <Text className="text-sm text-slate-400">订单不存在</Text>
      </View>
    )
  }

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending
  const StatusIcon = statusInfo.icon

  return (
    <View className="min-h-full bg-slate-50">
      <ScrollView scrollY className="h-full">
        {/* 状态头部 */}
        <View
          className="px-4 pt-6 pb-5"
          style={{ backgroundColor: statusInfo.bgColor }}
        >
          <View className="flex items-center gap-3">
            <View
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${statusInfo.color}20` }}
            >
              <StatusIcon size={24} color={statusInfo.color} />
            </View>
            <View>
              <Text className="block text-lg font-bold" style={{ color: statusInfo.color }}>
                {statusInfo.label}
              </Text>
              <Text className="block text-xs text-slate-500 mt-1">
                订单编号：SYJ{String(order.id).padStart(6, '0')}
              </Text>
            </View>
          </View>
        </View>

        {/* 服务信息 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-sm font-semibold text-slate-800 mb-3">服务信息</Text>
              <View className="flex flex-col gap-3">
                <View className="flex items-center justify-between">
                  <Text className="text-xs text-slate-400">服务项目</Text>
                  <Text className="text-sm text-slate-700 font-medium">
                    {SERVICE_NAME_MAP[order.serviceType] || order.serviceType}
                  </Text>
                </View>
                <Separator />
                <View className="flex items-center justify-between">
                  <Text className="text-xs text-slate-400">场地类型</Text>
                  <Text className="text-sm text-slate-700">
                    {VENUE_NAME_MAP[order.venueType] || order.venueType}
                  </Text>
                </View>
                <Separator />
                <View className="flex items-center justify-between">
                  <Text className="text-xs text-slate-400">建筑面积</Text>
                  <Text className="text-sm text-slate-700">{order.area}m²</Text>
                </View>
                <Separator />
                <View className="flex items-center justify-between">
                  <Text className="text-xs text-slate-400">房屋状态</Text>
                  <Text className="text-sm text-slate-700">
                    {HOUSE_STATUS_MAP[order.houseStatus] || order.houseStatus || '未填写'}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 预约时间 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-sm font-semibold text-slate-800 mb-3">预约时间</Text>
              <View className="flex flex-col gap-3">
                <View className="flex items-center gap-2">
                  <Calendar size={14} color="#0D9488" />
                  <Text className="text-sm text-slate-700">{order.bookingDate}</Text>
                </View>
                <View className="flex items-center gap-2">
                  <Clock size={14} color="#0D9488" />
                  <Text className="text-sm text-slate-700">
                    {TIME_SLOT_MAP[order.timeSlot] || order.timeSlot}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 联系信息 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-sm font-semibold text-slate-800 mb-3">联系信息</Text>
              <View className="flex flex-col gap-3">
                <View className="flex items-center gap-2">
                  <User size={14} color="#0D9488" />
                  <Text className="text-sm text-slate-700">{order.contactName}</Text>
                </View>
                <View className="flex items-center gap-2">
                  <Phone size={14} color="#0D9488" />
                  <Text className="text-sm text-slate-700">{order.contactPhone}</Text>
                </View>
                <View className="flex items-start gap-2">
                  <MapPin size={14} color="#0D9488" className="mt-1" />
                  <Text className="text-sm text-slate-700 flex-1">{order.address}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 备注 */}
        {(order.remark || order.adminRemark) && (
          <View className="px-4 mt-3">
            <Card className="border-0 shadow-none bg-white">
              <CardContent className="p-4">
                <Text className="block text-sm font-semibold text-slate-800 mb-3">备注信息</Text>
                {order.remark && (
                  <View className="mb-2">
                    <Text className="text-xs text-slate-400">客户备注</Text>
                    <Text className="block text-sm text-slate-600 mt-1">{order.remark}</Text>
                  </View>
                )}
                {order.adminRemark && (
                  <View>
                    <Text className="text-xs text-slate-400">商家备注</Text>
                    <Text className="block text-sm text-slate-600 mt-1">{order.adminRemark}</Text>
                  </View>
                )}
              </CardContent>
            </Card>
          </View>
        )}

        {/* 操作按钮 */}
        <View className="px-4 mt-4 mb-6">
          {order.status === 'pending' && (
            <Button
              className="w-full bg-white text-red-500 border border-red-200 rounded-xl h-11"
              variant="outline"
              onClick={cancelOrder}
            >
              取消预约
            </Button>
          )}
          {order.status === 'completed' && (
            <Button
              className="w-full bg-teal-600 text-white rounded-xl h-11"
              onClick={() => Taro.switchTab({ url: '/pages/booking/create' })}
            >
              再次预约
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderDetailPage
