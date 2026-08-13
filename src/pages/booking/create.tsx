import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Calendar as CalendarIcon,
  MapPin,
  CircleCheck,
  Wind,
  Droplets,
  Sparkles,
  ThermometerSun
} from 'lucide-react-taro'
import { Network } from '@/network'

// 服务项目选项
const SERVICE_OPTIONS = [
  { value: 'formaldehyde', label: '除甲醛治理', icon: Wind, color: '#0D9488' },
  { value: 'disinfection', label: '全屋消杀消毒', icon: Droplets, color: '#0EA5E9' },
  { value: 'comprehensive', label: '室内环境综合治理', icon: Sparkles, color: '#8B5CF6' },
  { value: 'detection', label: '空气检测服务', icon: ThermometerSun, color: '#F59E0B' }
]

// 场地类型选项
const VENUE_TYPES = [
  { value: 'home', label: '家庭住宅' },
  { value: 'office', label: '办公室' },
  { value: 'shop', label: '商铺' },
  { value: 'factory', label: '厂房' },
  { value: 'other', label: '其他' }
]

// 房屋状态选项
const HOUSE_STATUS = [
  { value: 'newly_decorated', label: '刚装修完工' },
  { value: 'occupied', label: '已入住' },
  { value: 'vacant', label: '空置中' }
]

// 时段选项
const TIME_SLOTS = [
  { value: 'morning', label: '上午 (9:00-12:00)' },
  { value: 'afternoon', label: '下午 (13:00-17:00)' },
  { value: 'allday', label: '全天均可' }
]

const BookingPage = () => {
  const [serviceType, setServiceType] = useState('')
  const [venueType, setVenueType] = useState('')
  const [area, setArea] = useState('')
  const [houseStatus, setHouseStatus] = useState('')
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [address, setAddress] = useState('')
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const handleSubmit = async () => {
    // 表单验证
    if (!serviceType) {
      Taro.showToast({ title: '请选择服务项目', icon: 'none' })
      return
    }
    if (!venueType) {
      Taro.showToast({ title: '请选择场地类型', icon: 'none' })
      return
    }
    if (!area) {
      Taro.showToast({ title: '请输入建筑面积', icon: 'none' })
      return
    }
    if (!bookingDate) {
      Taro.showToast({ title: '请选择预约日期', icon: 'none' })
      return
    }
    if (!timeSlot) {
      Taro.showToast({ title: '请选择上门时段', icon: 'none' })
      return
    }
    if (!contactName || !contactPhone) {
      Taro.showToast({ title: '请填写联系人信息', icon: 'none' })
      return
    }
    if (!address) {
      Taro.showToast({ title: '请填写上门地址', icon: 'none' })
      return
    }
    // 手机号验证
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      // 获取或生成用户标识（真实环境应使用微信 openid）
      let userId = Taro.getStorageSync('userId')
      if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)
        Taro.setStorageSync('userId', userId)
      }

      const res = await Network.request({
        url: '/api/bookings',
        method: 'POST',
        data: {
          userId,
          serviceType,
          venueType,
          area: parseFloat(area),
          houseStatus,
          bookingDate: formatDate(bookingDate),
          timeSlot,
          contactName,
          contactPhone,
          address,
          remark
        }
      })
      console.log('预约提交结果:', res.data)

      Taro.showToast({ title: '预约提交成功', icon: 'success' })

      // 重置表单
      setServiceType('')
      setVenueType('')
      setArea('')
      setHouseStatus('')
      setBookingDate(undefined)
      setTimeSlot('')
      setContactName('')
      setContactPhone('')
      setAddress('')
      setRemark('')

      // 跳转到我的预约
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/profile/index' })
      }, 1500)
    } catch (err) {
      console.error('预约提交失败:', err)
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const chooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation({})
      setAddress(res.address || '')
    } catch {
      // 用户取消选择
    }
  }

  return (
    <View className="min-h-full bg-slate-50 pb-24">
      <View className="px-4 pt-4">
        {/* 页面标题 */}
        <View className="mb-4">
          <Text className="block text-xl font-bold text-slate-800">预约治理服务</Text>
          <Text className="block text-sm text-slate-400 mt-1">
            填写信息后，专业工程师将在30分钟内与您联系
          </Text>
        </View>

        {/* 服务项目 */}
        <Card className="border-0 shadow-none bg-white mb-3">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-slate-800 mb-3">
              <Text className="block">服务项目 *</Text>
            </Label>
            <View className="grid grid-cols-2 gap-2 mt-3">
              {SERVICE_OPTIONS.map((item) => {
                const IconComp = item.icon
                const isSelected = serviceType === item.value
                return (
                  <View
                    key={item.value}
                    className={`rounded-xl p-3 border-2 flex items-center gap-2 ${isSelected ? 'border-teal-600 bg-teal-50' : 'border-slate-100 bg-white'}`}
                    onClick={() => setServiceType(item.value)}
                  >
                    <IconComp size={18} color={isSelected ? '#0D9488' : '#94A3B8'} />
                    <Text
                      className={`text-xs font-medium ${isSelected ? 'text-teal-700' : 'text-slate-600'}`}
                    >
                      {item.label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </CardContent>
        </Card>

        {/* 场地信息 */}
        <Card className="border-0 shadow-none bg-white mb-3">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-slate-800 mb-3">
              <Text className="block">场地信息</Text>
            </Label>

            {/* 场地类型 */}
            <View className="mt-3 mb-3">
              <Text className="block text-xs text-slate-500 mb-2">场地类型 *</Text>
              <Select value={venueType} onValueChange={setVenueType}>
                <SelectTrigger className="bg-slate-50 rounded-xl">
                  <SelectValue placeholder="请选择场地类型" />
                </SelectTrigger>
                <SelectContent>
                  {VENUE_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>

            {/* 建筑面积 */}
            <View className="mb-3">
              <Text className="block text-xs text-slate-500 mb-2">建筑面积（m²）*</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent text-sm"
                  type="number"
                  placeholder="请输入建筑面积"
                  value={area}
                  onInput={(e) => setArea(e.detail.value)}
                />
              </View>
            </View>

            {/* 房屋状态 */}
            <View>
              <Text className="block text-xs text-slate-500 mb-2">房屋状态</Text>
              <Select value={houseStatus} onValueChange={setHouseStatus}>
                <SelectTrigger className="bg-slate-50 rounded-xl">
                  <SelectValue placeholder="请选择房屋状态" />
                </SelectTrigger>
                <SelectContent>
                  {HOUSE_STATUS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>
          </CardContent>
        </Card>

        {/* 预约时间 */}
        <Card className="border-0 shadow-none bg-white mb-3">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-slate-800 mb-3">
              <Text className="block">预约时间</Text>
            </Label>

            {/* 日期选择 */}
            <View className="mt-3 mb-3">
              <Text className="block text-xs text-slate-500 mb-2">预约日期 *</Text>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <View className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <Text className={`text-sm ${bookingDate ? 'text-slate-800' : 'text-slate-400'}`}>
                      {bookingDate ? formatDate(bookingDate) : '请选择预约日期'}
                    </Text>
                    <CalendarIcon size={16} color="#94A3B8" />
                  </View>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={(date) => {
                      setBookingDate(date)
                      setShowCalendar(false)
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                </PopoverContent>
              </Popover>
            </View>

            {/* 时段选择 */}
            <View>
              <Text className="block text-xs text-slate-500 mb-2">上门时段 *</Text>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="bg-slate-50 rounded-xl">
                  <SelectValue placeholder="请选择上门时段" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card className="border-0 shadow-none bg-white mb-3">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-slate-800 mb-3">
              <Text className="block">联系信息</Text>
            </Label>

            <View className="mt-3 mb-3">
              <Text className="block text-xs text-slate-500 mb-2">联系人姓名 *</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent text-sm"
                  placeholder="请输入您的姓名"
                  value={contactName}
                  onInput={(e) => setContactName(e.detail.value)}
                />
              </View>
            </View>

            <View className="mb-3">
              <Text className="block text-xs text-slate-500 mb-2">联系电话 *</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent text-sm"
                  type="number"
                  placeholder="请输入手机号码"
                  value={contactPhone}
                  onInput={(e) => setContactPhone(e.detail.value)}
                />
              </View>
            </View>

            <View>
              <Text className="block text-xs text-slate-500 mb-2">上门地址 *</Text>
              <View className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-2">
                <Input
                  className="flex-1 bg-transparent text-sm"
                  placeholder="请输入详细地址"
                  value={address}
                  onInput={(e) => setAddress(e.detail.value)}
                />
                <View className="flex-shrink-0" onClick={chooseLocation}>
                  <MapPin size={18} color="#0D9488" />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 备注 */}
        <Card className="border-0 shadow-none bg-white mb-3">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-slate-800 mb-3">
              <Text className="block">补充说明</Text>
            </Label>
            <View className="bg-slate-50 rounded-xl p-4 mt-3">
              <Textarea
                className="w-full bg-transparent text-sm"
                style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent' }}
                placeholder="特殊需求、加急、重点治理区域等（选填）"
                maxlength={500}
                value={remark}
                onInput={(e) => setRemark(e.detail.value)}
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 底部提交按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #F1F5F9',
          zIndex: 100
        }}
      >
        <Button
          className="w-full bg-teal-600 text-white rounded-xl h-12"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <Text className="text-base font-semibold">提交中...</Text>
          ) : (
            <View className="flex items-center gap-2">
              <CircleCheck size={18} color="#FFFFFF" />
              <Text className="text-base font-semibold">提交预约</Text>
            </View>
          )}
        </Button>
      </View>
    </View>
  )
}

export default BookingPage
