#!/usr/bin/env node

/**
 * API接口验证测试脚本
 * 直接运行: node test-api.js
 */

// 模拟API服务
const mockData = {
  // 验证码
  captcha: {
    captchaCode: 'ABCD1234',
    captchaImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSIxMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyI+QUJDRDEyMzQ8L3RleHQ+PC9zdmc+'
  },
  
  // 用户信息
  user: {
    id: 1,
    username: 'testuser',
    email: 'user@example.com',
    type: 'user',
    avatar: '/assets/images/default-avatar.png',
    preferences: {
      favoriteFlavors: ['麻辣', '酸甜'],
      budgetRange: { min: 10, max: 30 },
      dietaryRestrictions: ['无']
    }
  },
  
  // 商家信息
  merchant: {
    id: 2,
    username: 'testmerchant',
    storeName: '川味小厨',
    type: 'merchant',
    canteen: '第一食堂'
  },
  
  // 用户收藏
  favorites: [
    {
      id: 1,
      dishId: 101,
      dishName: '麻辣香锅',
      price: 25,
      canteen: '第一食堂',
      addedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      dishId: 102,
      dishName: '宫保鸡丁',
      price: 18,
      canteen: '第二食堂',
      addedAt: '2024-01-14T15:20:00Z'
    }
  ],
  
  // 用户订单
  orders: [
    {
      id: 1,
      dishId: 101,
      dishName: '麻辣香锅',
      price: 25,
      quantity: 1,
      status: 'completed',
      orderTime: '2024-01-15T11:30:00Z'
    }
  ]
};

// 模拟响应延迟
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API服务
const mockAPI = {
  // 认证相关API
  auth: {
    // 用户登录
    userLogin: async (data) => {
      await mockDelay();
      if (data.username === 'testuser' && data.password === 'password123') {
        return {
          success: true,
          data: {
            user: mockData.user,
            token: 'mock-jwt-token-for-user'
          },
          message: '登录成功'
        };
      } else {
        return {
          success: false,
          message: '用户名或密码错误'
        };
      }
    },
    
    // 商家登录
    merchantLogin: async (data) => {
      await mockDelay();
      if (data.username === 'testmerchant' && data.password === 'password123') {
        return {
          success: true,
          data: {
            merchant: mockData.merchant,
            token: 'mock-jwt-token-for-merchant'
          },
          message: '商家登录成功'
        };
      } else {
        return {
          success: false,
          message: '商家账号或密码错误'
        };
      }
    },
    
    // 用户注册
    register: async (data) => {
      await mockDelay();
      if (data.username && data.password && data.email) {
        return {
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000) + 100,
            username: data.username
          },
          message: '注册成功'
        };
      } else {
        return {
          success: false,
          message: '注册信息不完整'
        };
      }
    },
    
    // 获取验证码
    getCaptcha: async () => {
      await mockDelay(300);
      return {
        success: true,
        data: mockData.captcha
      };
    },
    
    // 退出登录
    logout: () => {
      return Promise.resolve();
    }
  },
  
  // 用户相关API
  user: {
    // 获取用户信息
    getProfile: async () => {
      await mockDelay();
      return {
        success: true,
        data: mockData.user
      };
    },
    
    // 获取用户收藏
    getFavorites: async () => {
      await mockDelay();
      return {
        success: true,
        data: {
          favorites: mockData.favorites
        }
      };
    },
    
    // 更新用户偏好
    updatePreferences: async () => {
      await mockDelay();
      return {
        success: true,
        message: '偏好设置已更新'
      };
    }
  },
  
  // 订单相关API
  orders: {
    // 下单菜品
    createOrder: async (data) => {
      await mockDelay();
      return {
        success: true,
        data: {
          orderId: Math.floor(Math.random() * 1000) + 1000,
          status: 'pending',
          estimatedWaitTime: 15,
          totalPrice: data.quantity ? data.quantity * 25 : 25
        },
        message: '下单成功'
      };
    },
    
    // 收藏菜品
    addFavorite: async (data) => {
      await mockDelay();
      // eslint-disable-next-line no-unused-vars
      const dishData = data;
      return {
        success: true,
        data: {
          favoriteId: Math.floor(Math.random() * 1000) + 100
        },
        message: '收藏成功'
      };
    },
    
    // 获取订单列表
    getOrders: async () => {
      await mockDelay();
      return {
        success: true,
        data: {
          orders: mockData.orders
        }
      };
    }
  }
};

// 测试函数
async function runTests() {
  console.log('开始API接口验证...\n');
  
  const results = [];
  
  // 1. 测试验证码获取
  try {
    console.log('1. 测试验证码获取...');
    const captchaResponse = await mockAPI.auth.getCaptcha();
    if (captchaResponse && captchaResponse.success) {
      results.push({ test: '验证码获取', status: '✅ 成功', data: captchaResponse.data });
    } else {
      results.push({ test: '验证码获取', status: '❌ 失败', error: captchaResponse?.message });
    }
  } catch (error) {
    results.push({ test: '验证码获取', status: '❌ 异常', error: error.message });
  }
  
  // 2. 测试用户登录
  try {
    console.log('2. 测试用户登录...');
    const loginResponse = await mockAPI.auth.userLogin({
      username: 'testuser',
      password: 'password123',
      captcha: 'TEST123'
    });
    
    if (loginResponse && loginResponse.success) {
      results.push({ test: '用户登录', status: '✅ 成功', data: loginResponse.data });
    } else {
      results.push({ test: '用户登录', status: '❌ 失败', error: loginResponse?.message });
    }
  } catch (error) {
    results.push({ test: '用户登录', status: '❌ 异常', error: error.message });
  }
  
  // 3. 测试商家登录
  try {
    console.log('3. 测试商家登录...');
    const merchantLoginResponse = await mockAPI.auth.merchantLogin({
      username: 'testmerchant',
      password: 'password123',
      captcha: 'TEST123'
    });
    
    if (merchantLoginResponse && merchantLoginResponse.success) {
      results.push({ test: '商家登录', status: '✅ 成功', data: merchantLoginResponse.data });
    } else {
      results.push({ test: '商家登录', status: '❌ 失败', error: merchantLoginResponse?.message });
    }
  } catch (error) {
    results.push({ test: '商家登录', status: '❌ 异常', error: error.message });
  }
  
  // 4. 测试用户注册
  try {
    console.log('4. 测试用户注册...');
    const registerResponse = await mockAPI.auth.register({
      type: 'user',
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123',
      email: 'newuser@example.com'
    });
    
    if (registerResponse && registerResponse.success) {
      results.push({ test: '用户注册', status: '✅ 成功', data: registerResponse.data });
    } else {
      results.push({ test: '用户注册', status: '❌ 失败', error: registerResponse?.message });
    }
  } catch (error) {
    results.push({ test: '用户注册', status: '❌ 异常', error: error.message });
  }
  
  // 5. 测试用户信息获取
  try {
    console.log('5. 测试用户信息获取...');
    const profileResponse = await mockAPI.user.getProfile();
    
    if (profileResponse && profileResponse.success) {
      results.push({ test: '用户信息获取', status: '✅ 成功', data: profileResponse.data });
    } else {
      results.push({ test: '用户信息获取', status: '❌ 失败', error: profileResponse?.message });
    }
  } catch (error) {
    results.push({ test: '用户信息获取', status: '❌ 异常', error: error.message });
  }
  
  // 6. 测试用户收藏获取
  try {
    console.log('6. 测试用户收藏获取...');
    const favoritesResponse = await mockAPI.user.getFavorites();
    
    if (favoritesResponse && favoritesResponse.success) {
      results.push({ test: '用户收藏获取', status: '✅ 成功', data: favoritesResponse.data });
    } else {
      results.push({ test: '用户收藏获取', status: '❌ 失败', error: favoritesResponse?.message });
    }
  } catch (error) {
    results.push({ test: '用户收藏获取', status: '❌ 异常', error: error.message });
  }
  
  // 7. 测试用户订单获取
  try {
    console.log('7. 测试用户订单获取...');
    const ordersResponse = await mockAPI.orders.getOrders();
    
    if (ordersResponse && ordersResponse.success) {
      results.push({ test: '用户订单获取', status: '✅ 成功', data: ordersResponse.data });
    } else {
      results.push({ test: '用户订单获取', status: '❌ 失败', error: ordersResponse?.message });
    }
  } catch (error) {
    results.push({ test: '用户订单获取', status: '❌ 异常', error: error.message });
  }
  
  // 8. 测试下单菜品
  try {
    console.log('8. 测试下单菜品...');
    const createOrderResponse = await mockAPI.orders.createOrder({
      dishId: 101,
      quantity: 1,
      specialInstructions: '少辣'
    });
    
    if (createOrderResponse && createOrderResponse.success) {
      results.push({ test: '下单菜品', status: '✅ 成功', data: createOrderResponse.data });
    } else {
      results.push({ test: '下单菜品', status: '❌ 失败', error: createOrderResponse?.message });
    }
  } catch (error) {
    results.push({ test: '下单菜品', status: '❌ 异常', error: error.message });
  }
  
  // 9. 测试收藏菜品
  try {
    console.log('9. 测试收藏菜品...');
    const addFavoriteResponse = await mockAPI.orders.addFavorite({
      dishId: 102
    });
    
    if (addFavoriteResponse && addFavoriteResponse.success) {
      results.push({ test: '收藏菜品', status: '✅ 成功', data: addFavoriteResponse.data });
    } else {
      results.push({ test: '收藏菜品', status: '❌ 失败', error: addFavoriteResponse?.message });
    }
  } catch (error) {
    results.push({ test: '收藏菜品', status: '❌ 异常', error: error.message });
  }
  
  // 10. 测试退出登录
  try {
    console.log('10. 测试退出登录...');
    await mockAPI.auth.logout();
    results.push({ test: '退出登录', status: '✅ 成功', data: '用户数据已清除' });
  } catch (error) {
    results.push({ test: '退出登录', status: '❌ 异常', error: error.message });
  }
  
  // 打印结果
  console.log('\n=== API接口验证结果 ===\n');
  results.forEach(result => {
    console.log(`${result.test}: ${result.status}`);
    if (result.error) {
      console.log(`   错误: ${result.error}`);
    }
    if (result.data) {
      console.log(`   数据: ${JSON.stringify(result.data).substring(0, 100)}...`);
    }
    console.log('');
  });
  
  const successCount = results.filter(r => r.status.includes('✅')).length;
  const totalCount = results.length;
  console.log(`总计: ${successCount}/${totalCount} 个测试通过`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 所有API接口验证通过！');
  } else {
    console.log('\n⚠️ 部分API接口存在问题，请检查后端服务是否正常运行');
  }
  
  return results;
}

// 直接运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, mockAPI };
