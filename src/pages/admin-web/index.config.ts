export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '森易家商户管理后台'
    })
  : { navigationBarTitleText: '森易家商户管理后台' }
