#!/usr/bin/env node

/**
 * 模拟后端服务器
 * 运行: node mock-server.js
 * 服务器将在 http://localhost:3000 启动
 */

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())

// 模拟数据
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
  
  // 菜品数据
  dishes: [
    {
      id: 101,
      name: '麻辣香锅',
      price: 25,
      rating: 4.8,
      description: '香辣可口的麻辣香锅，配菜丰富',
      canteen: '第一食堂',
      waitTime: '15-20分钟',
      tags: ['麻辣', '香锅', '热销'],
      image: '/assets/images/food1.png',
      category: '主食',
      taste: '麻辣',
      isFavorite: true
    },
    {
      id: 102,
      name: '宫保鸡丁',
      price: 18,
      rating: 4.5,
      description: '经典川菜，酸甜微辣',
      canteen: '第二食堂',
      waitTime: '10-15分钟',
      tags: ['川菜', '经典', '鸡肉'],
      image: '/assets/images/food1.png',
      category: '主食',
      taste: '酸甜',
      isFavorite: true
    },
    {
      id: 103,
      name: '红烧肉',
      price: 22,
      rating: 4.7,
      description: '肥而不腻，入口即化',
      canteen: '第一食堂',
      waitTime: '20-25分钟',
      tags: ['红烧', '猪肉', '经典'],
      image: '/assets/images/food1.png',
      category: '主食',
      taste: '咸香',
      isFavorite: false
    },
    {
      id: 104,
      name: '酸菜鱼',
      price: 28,
      rating: 4.9,
      description: '酸辣开胃，鱼肉鲜嫩',
      canteen: '第三食堂',
      waitTime: '15-20分钟',
      tags: ['酸菜', '鱼', '川菜'],
      image: '/assets/images/food1.png',
      category: '主食',
      taste: '酸辣',
      isFavorite: false
    }
  ],
  
  // 商家菜品
  merchantDishes: [
    {
      id: 201,
      name: '麻辣香锅',
      price: 25,
      category: '主食',
      taste: '麻辣',
      description: '香辣可口的麻辣香锅，配菜丰富',
      status: 'active',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 202,
      name: '宫保鸡丁',
      price: 18,
      category: '主食',
      taste: '酸甜',
      description: '经典川菜，酸甜微辣',
      status: 'active',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ],
  
  // 客流量数据
  trafficData: [
    {
      canteen: '第一食堂',
      currentTraffic: 45,
      avgWaitTime: 12,
      level: 'medium',
      lastUpdated: new Date().toISOString()
    },
    {
      canteen: '第二食堂',
      currentTraffic: 28,
      avgWaitTime: 8,
      level: 'low',
      lastUpdated: new Date().toISOString()
    },
    {
      canteen: '第三食堂',
      currentTraffic: 65,
      avgWaitTime: 18,
      level: 'high',
      lastUpdated: new Date().toISOString()
    }
  ]
}

// 模拟响应延迟
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// API路由

// 获取验证码
app.get('/api/captcha', async (req, res) => {
  await mockDelay(300)
  res.json({
    success: true,
    data: mockData.captcha
  })
})

// 用户登录
app.post('/api/auth/user-login', async (req, res) => {
  await mockDelay()
  const { username, password, captcha } = req.body
  
  console.log('用户登录请求:', { username, password: '***', captcha })
  
  if (username === 'testuser' && password === 'password123') {
    res.json({
      success: true,
      data: {
        user: mockData.user,
        token: 'mock-jwt-token-for-user-' + Date.now()
      },
      message: '登录成功'
    })
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    })
  }
})

// 商家登录
app.post('/api/auth/merchant-login', async (req, res) => {
  await mockDelay()
  const { username, password, captcha } = req.body
  
  console.log('商家登录请求:', { username, password: '***', captcha })
  
  if (username === 'testmerchant' && password === 'password123') {
    res.json({
      success: true,
      data: {
        merchant: mockData.merchant,
        token: 'mock-jwt-token-for-merchant-' + Date.now()
      },
      message: '商家登录成功'
    })
  } else {
    res.status(401).json({
      success: false,
      message: '商家账号或密码错误'
    })
  }
})

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  await mockDelay()
  const { type, username, password, confirmPassword, email } = req.body
  
  console.log('用户注册请求:', { type, username, password: '***', confirmPassword: '***', email })
  
  if (username && password && email) {
    res.json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        username: username
      },
      message: '注册成功'
    })
  } else {
    res.status(400).json({
      success: false,
      message: '注册信息不完整'
    })
  }
})

// 获取用户信息
app.get('/api/user/profile', async (req, res) => {
  await mockDelay()
  const token = req.headers.authorization
  
  console.log('获取用户信息请求:', { token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    res.json({
      success: true,
      data: mockData.user
    })
  } else {
    res.status(401).json({
      success: false,
      message: '用户未登录'
    })
  }
})

// 获取用户收藏
app.get('/api/user/favorites', async (req, res) => {
  await mockDelay()
  const token = req.headers.authorization
  
  console.log('获取用户收藏请求:', { token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    res.json({
      success: true,
      data: {
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
        ]
      }
    })
  } else {
    res.status(401).json({
      success: false,
      message: '用户未登录'
    })
  }
})

// 获取用户订单
app.get('/api/user/orders', async (req, res) => {
  await mockDelay()
  const token = req.headers.authorization
  
  console.log('获取用户订单请求:', { token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    res.json({
      success: true,
      data: {
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
      }
    })
  } else {
    res.status(401).json({
      success: false,
      message: '用户未登录'
    })
  }
})

// 菜品搜索
app.get('/api/dishes/search', async (req, res) => {
  await mockDelay()
  const { q, page = 1, limit = 10 } = req.query
  
  console.log('菜品搜索请求:', { q, page, limit })
  
  // 模拟搜索逻辑
  let filteredDishes = mockData.dishes
  
  if (q) {
    filteredDishes = mockData.dishes.filter(dish => 
      dish.name.includes(q) || 
      dish.description.includes(q) ||
      dish.tags.some(tag => tag.includes(q))
    )
  }
  
  // 模拟分页
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + parseInt(limit)
  const paginatedDishes = filteredDishes.slice(startIndex, endIndex)
  
  res.json({
    success: true,
    data: {
      dishes: paginatedDishes
    },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredDishes.length,
      pages: Math.ceil(filteredDishes.length / limit)
    }
  })
})

// 菜品筛选
app.get('/api/dishes/filter', async (req, res) => {
  await mockDelay()
  const { category, flavors, priceMin, priceMax, crowd } = req.query
  
  console.log('菜品筛选请求:', { category, flavors, priceMin, priceMax, crowd })
  
  let filteredDishes = mockData.dishes
  
  // 品类筛选
  if (category) {
    filteredDishes = filteredDishes.filter(dish => dish.category === category)
  }
  
  // 口味筛选
  if (flavors) {
    const flavorList = flavors.split(',')
    filteredDishes = filteredDishes.filter(dish => 
      flavorList.some(flavor => dish.taste.includes(flavor))
    )
  }
  
  // 价格筛选
  if (priceMin) {
    filteredDishes = filteredDishes.filter(dish => dish.price >= parseFloat(priceMin))
  }
  if (priceMax) {
    filteredDishes = filteredDishes.filter(dish => dish.price <= parseFloat(priceMax))
  }
  
  res.json({
    success: true,
    data: {
      dishes: filteredDishes,
      filters: {
        category: category || '',
        flavors: flavors ? flavors.split(',') : [],
        priceRange: {
          min: priceMin ? parseFloat(priceMin) : 0,
          max: priceMax ? parseFloat(priceMax) : 50
        },
        crowd: crowd || 'any'
      }
    }
  })
})

// AI智能推荐
app.post('/api/dishes/ai-recommend', async (req, res) => {
  await mockDelay()
  const { query, preferences } = req.body
  
  console.log('AI推荐请求:', { query, preferences })
  
  // 模拟AI推荐逻辑
  const recommendations = mockData.dishes.slice(0, 3).map((dish, index) => ({
    dish: dish,
    reason: `根据您的需求"${query}"，这个菜品符合您的口味偏好`,
    matchScore: 0.8 + (index * 0.1)
  }))
  
  res.json({
    success: true,
    data: {
      recommendations: recommendations,
      queryAnalysis: {
        intent: '菜品推荐',
        extractedPreferences: {
          flavors: ['麻辣', '酸甜'],
          budget: {
            min: 10,
            max: 30
          },
          category: '主食'
        }
      }
    }
  })
})

// 热门推荐
app.get('/api/dishes/popular', async (req, res) => {
  await mockDelay()
  
  console.log('热门推荐请求')
  
  res.json({
    success: true,
    data: {
      dishes: mockData.dishes.slice(0, 4)
    }
  })
})

// 下单菜品
app.post('/api/orders/create', async (req, res) => {
  await mockDelay()
  const { dishId, quantity = 1 } = req.body
  const token = req.headers.authorization
  
  console.log('下单菜品请求:', { dishId, quantity, token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    const dish = mockData.dishes.find(d => d.id === parseInt(dishId))
    if (dish) {
      res.json({
        success: true,
        data: {
          orderId: Math.floor(Math.random() * 1000) + 1000,
          status: 'pending',
          estimatedWaitTime: 15,
          totalPrice: dish.price * quantity
        },
        message: '下单成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: '菜品不存在'
      })
    }
  } else {
    res.status(401).json({
      success: false,
      message: '用户未登录'
    })
  }
})

// 收藏菜品
app.post('/api/favorites/add', async (req, res) => {
  await mockDelay()
  const { dishId } = req.body
  const token = req.headers.authorization
  
  console.log('收藏菜品请求:', { dishId, token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    const dish = mockData.dishes.find(d => d.id === parseInt(dishId))
    if (dish) {
      res.json({
        success: true,
        data: {
          favoriteId: Math.floor(Math.random() * 1000) + 100
        },
        message: '收藏成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: '菜品不存在'
      })
    }
  } else {
    res.status(401).json({
      success: false,
      message: '用户未登录'
    })
  }
})

// 商家菜品管理
app.get('/api/merchant/dishes', async (req, res) => {
  await mockDelay()
  const token = req.headers.authorization
  
  console.log('获取商家菜品列表请求:', { token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    res.json({
      success: true,
      data: {
        dishes: mockData.merchantDishes
      }
    })
  } else {
    res.status(401).json({
      success: false,
      message: '商家未登录'
    })
  }
})

// 添加菜品
app.post('/api/merchant/dishes', async (req, res) => {
  await mockDelay()
  const { name, price, category, taste, description } = req.body
  const token = req.headers.authorization
  
  console.log('添加菜品请求:', { name, price, category, taste, description, token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    const newDish = {
      id: Math.floor(Math.random() * 1000) + 200,
      name,
      price: parseFloat(price),
      category,
      taste,
      description,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockData.merchantDishes.push(newDish)
    
    res.json({
      success: true,
      data: {
        dish: newDish
      },
      message: '菜品添加成功'
    })
  } else {
    res.status(401).json({
      success: false,
      message: '商家未登录'
    })
  }
})

// 删除菜品
app.delete('/api/merchant/dishes/:id', async (req, res) => {
  await mockDelay()
  const { id } = req.params
  const token = req.headers.authorization
  
  console.log('删除菜品请求:', { id, token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    const dishIndex = mockData.merchantDishes.findIndex(dish => dish.id === parseInt(id))
    if (dishIndex > -1) {
      mockData.merchantDishes.splice(dishIndex, 1)
      res.json({
        success: true,
        message: '菜品删除成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: '菜品不存在'
      })
    }
  } else {
    res.status(401).json({
      success: false,
      message: '商家未登录'
    })
  }
})

// 更新客流量
app.post('/api/merchant/traffic', async (req, res) => {
  await mockDelay()
  const { count, waitingTime } = req.body
  const token = req.headers.authorization
  
  console.log('更新客流量请求:', { count, waitingTime, token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    // 更新客流量数据
    const trafficData = mockData.trafficData.find(t => t.canteen === '第一食堂')
    if (trafficData) {
      trafficData.currentTraffic = parseInt(count)
      trafficData.avgWaitTime = parseFloat(waitingTime)
      trafficData.lastUpdated = new Date().toISOString()
    }
    
    res.json({
      success: true,
      data: {
        currentTraffic: parseInt(count),
        avgWaitTime: parseFloat(waitingTime),
        lastUpdate: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      },
      message: '客流量更新成功'
    })
  } else {
    res.status(401).json({
      success: false,
      message: '商家未登录'
    })
  }
})

// 获取商家统计
app.get('/api/merchant/stats', async (req, res) => {
  await mockDelay()
  const token = req.headers.authorization
  
  console.log('获取商家统计请求:', { token: token ? '有token' : '无token' })
  
  if (token && token.startsWith('Bearer ')) {
    const trafficData = mockData.trafficData.find(t => t.canteen === '第一食堂')
    
    res.json({
      success: true,
      data: {
        currentTraffic: trafficData?.currentTraffic || 0,
        avgWaitTime: trafficData?.avgWaitTime || 0,
        lastUpdate: trafficData?.lastUpdated ? 
          new Date(trafficData.lastUpdated).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : '--:--',
        totalDishes: mockData.merchantDishes.length,
        activeDishes: mockData.merchantDishes.filter(d => d.status === 'active').length
      }
    })
  } else {
    res.status(401).json({
      success: false,
      message: '商家未登录'
    })
  }
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '服务器运行正常',
    timestamp: new Date().toISOString()
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('=========================================')
  console.log('🚀 模拟后端服务器已启动')
  console.log(`📍 服务器地址: http://localhost:${PORT}`)
  console.log('=========================================')
  console.log('')
  console.log('📡 可用API端点:')
  console.log('  GET  /api/captcha                    - 获取验证码')
  console.log('  POST /api/auth/user-login            - 用户登录')
  console.log('  POST /api/auth/merchant-login        - 商家登录')
  console.log('  POST /api/auth/register              - 用户注册')
  console.log('  GET  /api/user/profile               - 获取用户信息')
  console.log('  GET  /api/user/favorites             - 获取用户收藏')
  console.log('  GET  /api/user/orders                - 获取用户订单')
  console.log('  GET  /api/dishes/search              - 菜品搜索')
  console.log('  GET  /api/dishes/filter              - 菜品筛选')
  console.log('  POST /api/dishes/ai-recommend        - AI智能推荐')
  console.log('  GET  /api/dishes/popular             - 热门推荐')
  console.log('  POST /api/orders/create              - 下单菜品')
  console.log('  POST /api/favorites/add              - 收藏菜品')
  console.log('  GET  /api/merchant/dishes            - 获取商家菜品')
  console.log('  POST /api/merchant/dishes            - 添加菜品')
  console.log('  DELETE /api/merchant/dishes/:id      - 删除菜品')
  console.log('  POST /api/merchant/traffic           - 更新客流量')
  console.log('  GET  /api/merchant/stats             - 获取商家统计')
  console.log('  GET  /api/health                     - 健康检查')
  console.log('')
  console.log('🔑 测试账号:')
  console.log('  用户账号: testuser / password123')
  console.log('  商家账号: testmerchant / password123')
  console.log('')
  console.log('=========================================')
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...')
  process.exit(0)
})

module.exports = app
