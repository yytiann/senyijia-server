export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '商户登录',
      navigationBarBackgroundColor: '#0D9488',
      navigationBarTextStyle: 'white'
    })
  : {
      navigationBarTitleText: '商户登录',
      navigationBarBackgroundColor: '#0D9488',
      navigationBarTextStyle: 'white'
    }
