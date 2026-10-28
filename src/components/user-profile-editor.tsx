import { View, Image, Button as TaroButton, Input } from '@tarojs/components'
import { useState } from 'react'
import { User } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'

interface Props {
  isMiniApp: boolean
  initialNickname?: string
  initialAvatar?: string
  onSave: (nickname: string, avatar: string) => void
  onCancel: () => void
}

/**
 * 个人中心 - 编辑资料（微信头像昵称填写能力）
 * - 微信小程序：头像用 open-type="chooseAvatar"，昵称用 type="nickname"（微信官方规范）
 * - H5：仅支持昵称编辑，头像直接展示
 * 注意：该组件必须放在 src/components 下，openType/nickname 需要原生组件，
 * 页面级 ESLint 不允许直接使用原生 Button/Input，故独立封装。
 */
const UserProfileEditor = ({
  isMiniApp,
  initialNickname = '',
  initialAvatar = '',
  onSave,
  onCancel,
}: Props) => {
  const [nickname, setNickname] = useState(initialNickname)
  const [avatar, setAvatar] = useState(initialAvatar)

  return (
    <>
      <View className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden">
        {isMiniApp ? (
          <TaroButton
            openType="chooseAvatar"
            onChooseAvatar={(e: any) => {
              const url = e?.detail?.avatarUrl
              if (url) setAvatar(url)
            }}
            className="w-full h-full m-0 p-0 bg-transparent rounded-full overflow-hidden flex items-center justify-center"
          >
            {avatar ? (
              <Image src={avatar} className="w-full h-full" mode="aspectFill" />
            ) : (
              <User size={28} color="#0D9488" />
            )}
          </TaroButton>
        ) : avatar ? (
          <Image src={avatar} className="w-full h-full" mode="aspectFill" />
        ) : (
          <User size={28} color="#0D9488" />
        )}
      </View>
      <View className="flex-1">
        <View className="bg-slate-50 rounded-lg px-3 py-2">
          <Input
            type={isMiniApp ? 'nickname' : 'text'}
            className="w-full bg-transparent text-sm"
            placeholder="请输入昵称"
            value={nickname}
            onInput={(e) => setNickname(e.detail.value)}
          />
        </View>
        <View className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="bg-teal-600 text-white rounded-lg"
            onClick={() => onSave(nickname, avatar)}
          >
            保存
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg" onClick={onCancel}>
            取消
          </Button>
        </View>
      </View>
    </>
  )
}

export default UserProfileEditor