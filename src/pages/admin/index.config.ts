export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '商户管理' })
  : { navigationBarTitleText: '商户管理' }
