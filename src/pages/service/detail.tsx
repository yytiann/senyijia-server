import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Wind,
  Droplets,
  Sparkles,
  ThermometerSun,
  Shield,
  CircleCheck,
  Leaf,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react-taro'

interface ServiceInfo {
  id: string
  name: string
  desc: string
  icon: typeof Wind
  color: string
  scenes: string[]
  process: string[]
  standards: string[]
  advantages: string[]
  warranty: string
}

const SERVICE_MAP: Record<string, ServiceInfo> = {
  formaldehyde: {
    id: 'formaldehyde',
    name: '除甲醛治理',
    desc: '针对新房装修后甲醛超标问题，采用光触媒+生物酶复合技术，从源头分解甲醛分子，治理后空气质量达到国家标准GB/T 18883-2002。',
    icon: Wind,
    color: '#0D9488',
    scenes: ['新房装修', '二手房翻新', '新家具进场', '办公区装修', '商铺精装'],
    process: ['上门检测甲醛浓度', '制定治理方案', '遮蔽保护处理', '喷涂光触媒药剂', '生物酶深层渗透', '封闭门窗反应', '通风换气', '复检验收'],
    standards: ['甲醛≤0.08mg/m³（国标I类）', '使用药剂通过SGS安全认证', '治理后无刺激性气味', '母婴安全级别'],
    advantages: ['源头分解，非掩盖', '一次治理长期有效', '不损伤家具表面', '无二次污染'],
    warranty: '治理达标后提供5年质保，质保期内免费复检'
  },
  disinfection: {
    id: 'disinfection',
    name: '全屋消杀消毒',
    desc: '采用医用级消毒设备与环保消毒剂，对室内空间进行全方位消杀，有效灭杀细菌、病毒、霉菌等有害微生物，营造健康安全的室内环境。',
    icon: Droplets,
    color: '#0EA5E9',
    scenes: ['家庭全屋消毒', '办公区域消杀', '商铺门店消毒', '仓储空间处理', '疫情后消杀'],
    process: ['现场勘查评估', '制定消杀方案', '设备调试部署', '空间雾化消毒', '重点部位处理', '静置作用', '通风散味', '效果检测'],
    standards: ['杀菌率≥99.9%', '消毒剂通过卫生安全评价', '无残留无腐蚀', '作用后空气安全'],
    advantages: ['医用级消毒标准', '360度无死角覆盖', '环保配方安全无害', '快速高效2小时完成'],
    warranty: '消杀效果保障30天，期间可免费补消一次'
  },
  comprehensive: {
    id: 'comprehensive',
    name: '室内环境综合治理',
    desc: '针对室内空气中甲醛、苯系物、TVOC、异味等多种污染物进行综合检测与治理，采用多种技术组合方案，全面改善室内空气质量。',
    icon: Sparkles,
    color: '#8B5CF6',
    scenes: ['新房全面治理', '办公室空气改善', '商铺异味处理', '学校教室治理', '医院病房净化'],
    process: ['多指标检测分析', '污染源排查定位', '综合治理方案设计', '分项针对性处理', '整体空间优化', '通风净化', '复检评估', '质保跟踪'],
    standards: ['甲醛≤0.08mg/m³', '苯≤0.09mg/m³', 'TVOC≤0.50mg/m³', '所有指标达到国标I类'],
    advantages: ['多污染物同步治理', '个性化定制方案', '治理效果全面达标', '长期空气质量保障'],
    warranty: '综合治理达标后提供3年质保，每年免费复检一次'
  },
  detection: {
    id: 'detection',
    name: '空气检测服务',
    desc: '采用专业检测仪器，按照国家标准方法对室内空气中甲醛、苯、TVOC等指标进行精准检测，出具权威检测报告，为治理提供科学依据。',
    icon: ThermometerSun,
    color: '#F59E0B',
    scenes: ['装修后检测', '入住前检测', '治理后验收', '定期环境监测', '办公环境评估'],
    process: ['预约检测时间', '工程师上门采样', '实验室分析', '出具检测报告', '数据解读建议'],
    standards: ['检测依据GB/T 18883标准', '采样点位科学布设', '实验室分析精准可靠', '报告具有参考价值'],
    advantages: ['专业检测仪器', '标准化采样流程', '数据准确可靠', '提供治理建议'],
    warranty: '检测报告真实有效，如治理后复检不达标可免费重新检测'
  }
}

const ServiceDetailPage = () => {
  const router = useRouter()
  const serviceId = router.params.id || 'formaldehyde'
  const service = SERVICE_MAP[serviceId] || SERVICE_MAP.formaldehyde
  const [activeTab, setActiveTab] = useState<'intro' | 'process' | 'standard'>('intro')

  const IconComp = service.icon

  const goToBooking = () => {
    Taro.switchTab({ url: '/pages/booking/create' })
  }

  return (
    <View className="min-h-full bg-slate-50 pb-24">
      {/* 服务头部 */}
      <View className="bg-white px-4 pt-6 pb-5">
        <View className="flex items-center gap-3 mb-3">
          <View
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${service.color}15` }}
          >
            <IconComp size={24} color={service.color} />
          </View>
          <View className="flex-1">
            <Text className="block text-lg font-bold text-slate-800">{service.name}</Text>
            <Text className="block text-xs text-slate-400 mt-1">专业治理 · 达标保障</Text>
          </View>
        </View>
        <Text className="block text-sm text-slate-600 leading-relaxed">{service.desc}</Text>
      </View>

      {/* Tab 切换 */}
      <View className="bg-white mt-2 px-4">
        <View className="flex gap-6 border-b border-slate-100">
          {(['intro', 'process', 'standard'] as const).map((tab) => (
            <View
              key={tab}
              className={`pb-3 pt-3 border-b-2 ${activeTab === tab ? 'border-teal-600' : 'border-transparent'}`}
              onClick={() => setActiveTab(tab)}
            >
              <Text
                className={`text-sm font-medium ${activeTab === tab ? 'text-teal-600' : 'text-slate-400'}`}
              >
                {tab === 'intro' ? '服务介绍' : tab === 'process' ? '治理流程' : '治理标准'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tab 内容 */}
      <View className="px-4 mt-3">
        {activeTab === 'intro' && (
          <View className="flex flex-col gap-3">
            {/* 适用场景 */}
            <Card className="border-0 shadow-none bg-white">
              <CardContent className="p-4">
                <View className="flex items-center gap-2 mb-3">
                  <MapPin size={16} color="#0D9488" />
                  <Text className="text-sm font-semibold text-slate-800">适用场景</Text>
                </View>
                <View className="flex flex-wrap gap-2">
                  {service.scenes.map((scene) => (
                    <Badge key={scene} variant="secondary" className="text-xs">
                      {scene}
                    </Badge>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* 服务优势 */}
            <Card className="border-0 shadow-none bg-white">
              <CardContent className="p-4">
                <View className="flex items-center gap-2 mb-3">
                  <Leaf size={16} color="#0D9488" />
                  <Text className="text-sm font-semibold text-slate-800">服务优势</Text>
                </View>
                <View className="flex flex-col gap-2">
                  {service.advantages.map((adv) => (
                    <View key={adv} className="flex items-center gap-2">
                      <CircleCheck size={14} color="#0D9488" />
                      <Text className="text-sm text-slate-600">{adv}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>

            {/* 质保政策 */}
            <Card className="border-0 shadow-none bg-teal-50">
              <CardContent className="p-4">
                <View className="flex items-center gap-2 mb-2">
                  <Shield size={16} color="#0D9488" />
                  <Text className="text-sm font-semibold text-slate-800">质保政策</Text>
                </View>
                <Text className="text-sm text-slate-600">{service.warranty}</Text>
              </CardContent>
            </Card>
          </View>
        )}

        {activeTab === 'process' && (
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <View className="flex flex-col gap-4">
                {service.process.map((step, index) => (
                  <View key={index} className="flex items-start gap-3">
                    <View className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <Text className="text-xs text-white font-bold">{index + 1}</Text>
                    </View>
                    <View className="flex-1 pt-1">
                      <Text className="text-sm text-slate-700">{step}</Text>
                    </View>
                    {index < service.process.length - 1 && (
                      <View className="absolute left-4 top-8 w-px h-4 bg-teal-200" />
                    )}
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        {activeTab === 'standard' && (
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-3">
                <Shield size={16} color="#0D9488" />
                <Text className="text-sm font-semibold text-slate-800">治理达标标准</Text>
              </View>
              <View className="flex flex-col gap-3">
                {service.standards.map((std) => (
                  <View key={std} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                    <CircleCheck size={16} color="#10B981" />
                    <Text className="text-sm text-slate-700">{std}</Text>
                  </View>
                ))}
              </View>
              <Separator className="my-4" />
              <View className="flex items-center gap-2">
                <Clock size={14} color="#94A3B8" />
                <Text className="text-xs text-slate-400">
                  治理标准参照 GB/T 18883-2002《室内空气质量标准》
                </Text>
              </View>
            </CardContent>
          </Card>
        )}
      </View>

      {/* 底部预约按钮 */}
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
        <Button className="w-full bg-teal-600 text-white rounded-xl h-12" onClick={goToBooking}>
          <Text className="text-base font-semibold">立即预约此服务</Text>
          <ChevronRight size={18} color="#FFFFFF" className="ml-1" />
        </Button>
      </View>
    </View>
  )
}

export default ServiceDetailPage
