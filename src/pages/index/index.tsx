import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Leaf,
  Wind,
  Droplets,
  Sparkles,
  Shield,
  Award,
  Users,
  CircleCheck,
  ChevronRight,
  Phone,
  Calendar,
  Building2,
  ThermometerSun
} from 'lucide-react-taro'

// 服务项目数据
const SERVICES = [
  {
    id: 'formaldehyde',
    name: '除甲醛治理',
    desc: '新房/二手房专业除醛',
    icon: Wind,
    color: '#0D9488'
  },
  {
    id: 'disinfection',
    name: '全屋消杀消毒',
    desc: '深度杀菌·安全无害',
    icon: Droplets,
    color: '#0EA5E9'
  },
  {
    id: 'comprehensive',
    name: '环境综合治理',
    desc: 'TVOC/苯系物/异味全面治理',
    icon: Sparkles,
    color: '#8B5CF6'
  },
  {
    id: 'detection',
    name: '环境检测服务',
    desc: 'CMA标准专业检测',
    icon: ThermometerSun,
    color: '#F59E0B'
  }
]

// 服务优势
const ADVANTAGES = [
  { icon: Shield, title: '安全无害', desc: '母婴级安全药剂' },
  { icon: Award, title: '专业资质', desc: 'CMA认证检测' },
  { icon: Users, title: '专业团队', desc: '持证上岗工程师' },
  { icon: CircleCheck, title: '质保无忧', desc: '治理后达标质保' }
]

// 服务流程
const PROCESS_STEPS = [
  { step: '01', title: '在线预约', desc: '填写信息提交预约' },
  { step: '02', title: '上门检测', desc: '专业仪器精准检测' },
  { step: '03', title: '方案定制', desc: '根据数据定制方案' },
  { step: '04', title: '专业施工', desc: '标准化治理作业' },
  { step: '05', title: '复检验收', desc: '治理后复检达标' },
  { step: '06', title: '售后质保', desc: '长期质保跟踪服务' }
]

// 案例数据
const CASES = [
  {
    id: 1,
    title: '万科翡翠花园 3室2厅',
    area: '128m²',
    type: '家庭住宅',
    service: '除甲醛治理',
    result: '甲醛从0.21降至0.06',
    icon: Building2
  },
  {
    id: 2,
    title: '万达广场A座办公区',
    area: '560m²',
    type: '办公空间',
    service: '环境综合治理',
    result: 'TVOC达标·异味消除',
    icon: Building2
  },
  {
    id: 3,
    title: '融创御湖天下',
    area: '200m²',
    type: '别墅',
    service: '全屋消杀消毒',
    result: '全面杀菌·空气清新',
    icon: Building2
  }
]

const IndexPage = () => {
  const goToServiceDetail = (serviceId: string) => {
    Taro.navigateTo({ url: `/pages/service/detail?id=${serviceId}` })
  }

  const goToBooking = () => {
    Taro.switchTab({ url: '/pages/booking/create' })
  }

  const makePhoneCall = () => {
    Taro.makePhoneCall({ phoneNumber: '400-888-9999' })
  }

  return (
    <View className="min-h-full bg-slate-50">
      <ScrollView scrollY className="h-full" style={{ paddingBottom: '120px' }}>
        {/* 品牌头部 */}
        <View className="bg-white px-4 pt-6 pb-4">
          <View className="flex items-center gap-3">
            <View className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
              <Leaf size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="block text-xl font-bold text-slate-800">森易家</Text>
              <Text className="block text-xs text-slate-400 mt-1">
                专业环境治理 · 消杀除醛净化专家
              </Text>
            </View>
          </View>
        </View>

        {/* 轮播Banner */}
        <View className="px-4 mt-3">
          <View className="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-teal-600 to-teal-500 p-6">
            <View className="relative z-10">
              <Text className="block text-white text-lg font-bold">新房除醛 · 即刻守护</Text>
              <Text className="block text-teal-100 text-sm mt-2">
                专业团队上门治理，48小时达标入住
              </Text>
              <Button
                className="mt-4 bg-white text-teal-600 rounded-lg"
                size="sm"
                onClick={goToBooking}
              >
                立即预约
              </Button>
            </View>
            <View className="absolute right-4 top-4 opacity-20">
              <Wind size={80} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* 核心服务入口 */}
        <View className="px-4 mt-6">
          <View className="flex items-center justify-between mb-3">
            <Text className="block text-base font-bold text-slate-800">核心服务</Text>
            <Text className="block text-xs text-slate-400">专业治理 · 达标入住</Text>
          </View>
          <View className="grid grid-cols-2 gap-3">
            {SERVICES.map((service) => {
              const IconComp = service.icon
              return (
                <Card
                  key={service.id}
                  className="border-0 shadow-none bg-white"
                  onClick={() => goToServiceDetail(service.id)}
                >
                  <CardContent className="p-4">
                    <View
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      <IconComp size={20} color={service.color} />
                    </View>
                    <Text className="block text-sm font-semibold text-slate-800">
                      {service.name}
                    </Text>
                    <Text className="block text-xs text-slate-400 mt-1">{service.desc}</Text>
                    <View className="flex items-center mt-2">
                      <Text className="text-xs text-teal-600">了解详情</Text>
                      <ChevronRight size={12} color="#0D9488" />
                    </View>
                  </CardContent>
                </Card>
              )
            })}
          </View>
        </View>

        {/* 品牌信任板块 */}
        <View className="px-4 mt-6">
          <View className="flex items-center justify-between mb-3">
            <Text className="block text-base font-bold text-slate-800">为什么选择森易家</Text>
          </View>
          <View className="grid grid-cols-4 gap-2">
            {ADVANTAGES.map((item) => {
              const IconComp = item.icon
              return (
                <View key={item.title} className="bg-white rounded-xl p-3 flex flex-col items-center">
                  <View className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center mb-2">
                    <IconComp size={18} color="#0D9488" />
                  </View>
                  <Text className="block text-xs font-medium text-slate-800 text-center">
                    {item.title}
                  </Text>
                  <Text className="block text-xs text-slate-400 text-center mt-1">
                    {item.desc}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* 服务流程 */}
        <View className="px-4 mt-6">
          <View className="flex items-center justify-between mb-3">
            <Text className="block text-base font-bold text-slate-800">服务流程</Text>
            <Text className="block text-xs text-slate-400">标准化六步治理</Text>
          </View>
          <View className="bg-white rounded-xl p-4">
            <View className="flex flex-wrap">
              {PROCESS_STEPS.map((step, index) => (
                <View key={step.step} className="w-1/3 mb-4 flex items-start gap-2">
                  <View className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <Text className="text-xs text-white font-bold">{step.step}</Text>
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="block text-xs font-semibold text-slate-800">
                      {step.title}
                    </Text>
                    <Text className="block text-xs text-slate-400 mt-1">{step.desc}</Text>
                  </View>
                  {index < PROCESS_STEPS.length - 1 && index % 3 !== 2 && (
                    <ChevronRight size={12} color="#CBD5E1" className="mt-2 flex-shrink-0" />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 案例展示 */}
        <View className="px-4 mt-6">
          <View className="flex items-center justify-between mb-3">
            <Text className="block text-base font-bold text-slate-800">治理案例</Text>
            <Text className="block text-xs text-slate-400">真实效果 · 数据说话</Text>
          </View>
          <View className="flex flex-col gap-3">
            {CASES.map((caseItem) => {
              const CaseIcon = caseItem.icon
              return (
                <Card key={caseItem.id} className="border-0 shadow-none bg-white">
                  <CardContent className="p-4">
                    <View className="flex items-start gap-3">
                      <View className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <CaseIcon size={20} color="#64748B" />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="block text-sm font-semibold text-slate-800">
                          {caseItem.title}
                        </Text>
                        <View className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {caseItem.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-teal-600 border-teal-200">
                            {caseItem.area}
                          </Badge>
                        </View>
                        <Text className="block text-xs text-slate-500 mt-2">
                          服务项目：{caseItem.service}
                        </Text>
                        <View className="flex items-center gap-1 mt-2">
                          <CircleCheck size={12} color="#10B981" />
                          <Text className="text-xs text-emerald-600 font-medium">
                            {caseItem.result}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )
            })}
          </View>
        </View>

        {/* 服务保障 */}
        <View className="px-4 mt-6 mb-4">
          <Card className="border-0 shadow-none bg-teal-50">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-3">
                <Shield size={18} color="#0D9488" />
                <Text className="block text-sm font-bold text-slate-800">服务保障承诺</Text>
              </View>
              <View className="flex flex-col gap-2">
                {[
                  '治理后空气质量达到国家标准 GB/T 18883',
                  '使用药剂通过SGS安全认证，母婴安全',
                  '治理不达标免费返工，直至达标为止',
                  '提供长期质保，定期回访跟踪'
                ].map((text, idx) => (
                  <View key={idx} className="flex items-center gap-2">
                    <CircleCheck size={14} color="#0D9488" />
                    <Text className="text-xs text-slate-600">{text}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* 底部固定操作栏 */}
      <View
        style={{
          position: 'fixed',
          bottom: 50,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #F1F5F9',
          zIndex: 100,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Button
          className="flex-1 bg-slate-100 text-slate-700 rounded-xl"
          variant="secondary"
          onClick={makePhoneCall}
        >
          <Phone size={16} color="#475569" className="mr-2" />
          <Text className="text-sm">电话咨询</Text>
        </Button>
        <Button
          className="flex-1 bg-teal-600 text-white rounded-xl"
          onClick={goToBooking}
        >
          <Calendar size={16} color="#FFFFFF" className="mr-2" />
          <Text className="text-sm">立即预约</Text>
        </Button>
      </View>
    </View>
  )
}

export default IndexPage
