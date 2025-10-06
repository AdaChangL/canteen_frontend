// API接口验证脚本
import { authAPI, userAPI, ordersAPI } from '@/services/api'

class ApiTest {
  constructor() {
    this.results = []
  }

  async runTests() {
    console.log('开始API接口验证...')
    
    try {
      // 1. 测试验证码获取
      await this.testCaptcha()
      
      // 2. 测试用户登录
      await this.testUserLogin()
      
      // 3. 测试商家登录
      await this.testMerchantLogin()
      
      // 4. 测试用户注册
      await this.testUserRegister()
      
      // 5. 测试用户信息获取
      await this.testUserProfile()
      
      // 6. 测试用户收藏
      await this.testUserFavorites()
      
      // 7. 测试用户订单
      await this.testUserOrders()
      
      // 8. 测试退出登录
      await this.testLogout()
      
    } catch (error) {
      console.error('测试过程中发生错误:', error)
    }
    
    this.printResults()
  }

  async testCaptcha() {
    try {
      console.log('测试验证码获取...')
      const response = await authAPI.getCaptcha()
      if (response && response.success) {
        this.results.push({ test: '验证码获取', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '验证码获取', status: '❌ 失败', error: response?.message || '未知错误' })
      }
    } catch (error) {
      this.results.push({ test: '验证码获取', status: '❌ 异常', error: error.message })
    }
  }

  async testUserLogin() {
    try {
      console.log('测试用户登录...')
      const response = await authAPI.userLogin({
        username: 'testuser',
        password: 'password123',
        captcha: 'TEST123'
      })
      
      if (response && response.success) {
        this.results.push({ test: '用户登录', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '用户登录', status: '❌ 失败', error: response?.message || '登录失败' })
      }
    } catch (error) {
      this.results.push({ test: '用户登录', status: '❌ 异常', error: error.message })
    }
  }

  async testMerchantLogin() {
    try {
      console.log('测试商家登录...')
      const response = await authAPI.merchantLogin({
        username: 'testmerchant',
        password: 'password123',
        captcha: 'TEST123'
      })
      
      if (response && response.success) {
        this.results.push({ test: '商家登录', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '商家登录', status: '❌ 失败', error: response?.message || '登录失败' })
      }
    } catch (error) {
      this.results.push({ test: '商家登录', status: '❌ 异常', error: error.message })
    }
  }

  async testUserRegister() {
    try {
      console.log('测试用户注册...')
      const response = await authAPI.register({
        type: 'user',
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'newuser@example.com'
      })
      
      if (response && response.success) {
        this.results.push({ test: '用户注册', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '用户注册', status: '❌ 失败', error: response?.message || '注册失败' })
      }
    } catch (error) {
      this.results.push({ test: '用户注册', status: '❌ 异常', error: error.message })
    }
  }

  async testUserProfile() {
    try {
      console.log('测试用户信息获取...')
      const response = await userAPI.getProfile()
      
      if (response && response.success) {
        this.results.push({ test: '用户信息获取', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '用户信息获取', status: '❌ 失败', error: response?.message || '获取失败' })
      }
    } catch (error) {
      this.results.push({ test: '用户信息获取', status: '❌ 异常', error: error.message })
    }
  }

  async testUserFavorites() {
    try {
      console.log('测试用户收藏获取...')
      const response = await userAPI.getFavorites()
      
      if (response && response.success) {
        this.results.push({ test: '用户收藏获取', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '用户收藏获取', status: '❌ 失败', error: response?.message || '获取失败' })
      }
    } catch (error) {
      this.results.push({ test: '用户收藏获取', status: '❌ 异常', error: error.message })
    }
  }

  async testUserOrders() {
    try {
      console.log('测试用户订单获取...')
      const response = await ordersAPI.getOrders()
      
      if (response && response.success) {
        this.results.push({ test: '用户订单获取', status: '✅ 成功', data: response.data })
      } else {
        this.results.push({ test: '用户订单获取', status: '❌ 失败', error: response?.message || '获取失败' })
      }
    } catch (error) {
      this.results.push({ test: '用户订单获取', status: '❌ 异常', error: error.message })
    }
  }

  async testLogout() {
    try {
      console.log('测试退出登录...')
      await authAPI.logout()
      this.results.push({ test: '退出登录', status: '✅ 成功', data: '用户数据已清除' })
    } catch (error) {
      this.results.push({ test: '退出登录', status: '❌ 异常', error: error.message })
    }
  }

  printResults() {
    console.log('\n=== API接口验证结果 ===')
    this.results.forEach(result => {
      console.log(`${result.test}: ${result.status}`)
      if (result.error) {
        console.log(`   错误: ${result.error}`)
      }
      if (result.data) {
        console.log(`   数据: ${JSON.stringify(result.data).substring(0, 100)}...`)
      }
    })
    
    const successCount = this.results.filter(r => r.status.includes('✅')).length
    const totalCount = this.results.length
    console.log(`\n总计: ${successCount}/${totalCount} 个测试通过`)
    
    if (successCount === totalCount) {
      console.log('🎉 所有API接口验证通过！')
    } else {
      console.log('⚠️ 部分API接口存在问题，请检查后端服务是否正常运行')
    }
  }
}

// 导出测试类
export default ApiTest

// 如果直接运行此文件，则执行测试
if (typeof window !== 'undefined' && window.location.pathname.includes('test')) {
  const apiTest = new ApiTest()
  apiTest.runTests()
}
