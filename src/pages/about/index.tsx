import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Leaf,
  Shield,
  Award,
  Users,
  CircleCheck,
  Phone,
  MapPin,
  Clock,
  Heart
} from 'lucide-react-taro'

const AboutPage = () => {
  const makePhoneCall = () => {
    Taro.makePhoneCall({ phoneNumber: '400-888-9999' })
  }

  return (
    <View className="min-h-full bg-slate-50">
      <ScrollView scrollY className="h-full">
        {/* 品牌头部 */}
        <View className="bg-white px-4 pt-8 pb-6 flex flex-col items-center">
          <View className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mb-3">
            <Leaf size={32} color="#FFFFFF" />
          </View>
          <Text className="block text-xl font-bold text-slate-800">森易家</Text>
          <Text className="block text-sm text-slate-400 mt-1">
            专业室内环境治理 · 消杀除醛净化专家
          </Text>
        </View>

        {/* 公司简介 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">关于我们</Text>
              <Text className="text-sm text-slate-600 leading-relaxed">
                森易家环境科技有限公司是一家专注于室内空气质量治理的专业服务企业，
                致力于为家庭和企业提供科学、安全、高效的室内环境治理解决方案。
                公司拥有CMA认证检测资质，采用国际先进的治理技术和环保药剂，
                服务覆盖除甲醛、全屋消杀、环境综合治理、空气检测等多个领域。
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* 服务范围 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">服务范围</Text>
              <View className="flex flex-col gap-2">
                {[
                  '新房/二手房除甲醛治理',
                  '办公室/写字楼空气治理',
                  '商铺/门店环境处理',
                  '学校/幼儿园空气净化',
                  '医院/诊所消毒杀菌',
                  '全屋消杀消毒服务',
                  '室内空气质量检测',
                  '异味治理与清除'
                ].map((item) => (
                  <View key={item} className="flex items-center gap-2">
                    <CircleCheck size={14} color="#0D9488" />
                    <Text className="text-sm text-slate-600">{item}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 资质与优势 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">专业资质</Text>
              <View className="grid grid-cols-2 gap-3">
                {[
                  { icon: Award, title: 'CMA认证', desc: '检测资质齐全' },
                  { icon: Shield, title: 'SGS认证', desc: '药剂安全认证' },
                  { icon: Users, title: '专业团队', desc: '持证上岗工程师' },
                  { icon: CircleCheck, title: '达标保障', desc: '治理不达标返工' }
                ].map((item) => {
                  const IconComp = item.icon
                  return (
                    <View key={item.title} className="bg-slate-50 rounded-xl p-3 flex flex-col items-center">
                      <IconComp size={22} color="#0D9488" />
                      <Text className="text-sm font-semibold text-slate-800 mt-2">{item.title}</Text>
                      <Text className="text-xs text-slate-400 mt-1">{item.desc}</Text>
                    </View>
                  )
                })}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 售后质保 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-teal-50">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">售后质保承诺</Text>
              <View className="flex flex-col gap-2">
                {[
                  '治理后空气质量达到国家标准 GB/T 18883-2002',
                  '使用药剂通过SGS安全认证，母婴安全无害',
                  '治理不达标免费返工，直至达标为止',
                  '除甲醛治理提供5年质保期',
                  '定期回访跟踪，确保长期效果',
                  '24小时客服响应，随时解答疑问'
                ].map((text, idx) => (
                  <View key={idx} className="flex items-start gap-2">
                    <CircleCheck size={14} color="#0D9488" className="mt-1 flex-shrink-0" />
                    <Text className="text-sm text-slate-600">{text}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 安全承诺 */}
        <View className="px-4 mt-3">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">安全承诺</Text>
              <View className="flex flex-col gap-3">
                <View className="flex items-start gap-3">
                  <Heart size={18} color="#0D9488" className="mt-1 flex-shrink-0" />
                  <View>
                    <Text className="block text-sm font-semibold text-slate-800">母婴安全</Text>
                    <Text className="text-xs text-slate-500 mt-1">
                      所有药剂均通过安全认证，对孕妇、婴幼儿无任何伤害
                    </Text>
                  </View>
                </View>
                <Separator />
                <View className="flex items-start gap-3">
                  <Shield size={18} color="#0D9488" className="mt-1 flex-shrink-0" />
                  <View>
                    <Text className="block text-sm font-semibold text-slate-800">无二次污染</Text>
                    <Text className="text-xs text-slate-500 mt-1">
                      治理过程不产生二次污染，不损伤家具和装修
                    </Text>
                  </View>
                </View>
                <Separator />
                <View className="flex items-start gap-3">
                  <Leaf size={18} color="#0D9488" className="mt-1 flex-shrink-0" />
                  <View>
                    <Text className="block text-sm font-semibold text-slate-800">环保配方</Text>
                    <Text className="text-xs text-slate-500 mt-1">
                      采用植物提取和生物酶技术，绿色环保无残留
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 联系方式 */}
        <View className="px-4 mt-3 mb-6">
          <Card className="border-0 shadow-none bg-white">
            <CardContent className="p-4">
              <Text className="block text-base font-bold text-slate-800 mb-3">联系我们</Text>
              <View className="flex flex-col gap-3">
                <View className="flex items-center gap-3">
                  <Phone size={16} color="#0D9488" />
                  <View>
                    <Text className="block text-sm text-slate-700">400-888-9999</Text>
                    <Text className="text-xs text-slate-400">24小时服务热线</Text>
                  </View>
                </View>
                <Separator />
                <View className="flex items-center gap-3">
                  <Clock size={16} color="#0D9488" />
                  <View>
                    <Text className="block text-sm text-slate-700">周一至周日 8:00-22:00</Text>
                    <Text className="text-xs text-slate-400">全年无休</Text>
                  </View>
                </View>
                <Separator />
                <View className="flex items-center gap-3">
                  <MapPin size={16} color="#0D9488" />
                  <View>
                    <Text className="block text-sm text-slate-700">全城上门服务</Text>
                    <Text className="text-xs text-slate-400">覆盖市区及周边区域</Text>
                  </View>
                </View>
              </View>
              <Button
                className="w-full bg-teal-600 text-white rounded-xl mt-4 h-11"
                onClick={makePhoneCall}
              >
                <Phone size={16} color="#FFFFFF" className="mr-2" />
                一键拨号
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}

export default AboutPage
