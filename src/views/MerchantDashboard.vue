<template>
  <div class="merchant-dashboard merchant-page">
    <!-- 商家专用头部 - 直接集成在页面中 -->
    <header class="header merchant-header">
      <div class="container">
        <div class="merchant-header-content">
          <div class="merchant-logo">
            <i class="fas fa-store"></i>
            <span>商家管理中心</span>
          </div>
          <div class="merchant-actions">
            <div class="merchant-info">
              <span class="merchant-name" v-if="currentUser">{{ currentUser.username }}</span>
            </div>
            <button class="logout-btn" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <main class="main merchant-main">
      <div class="container">
        <h1 class="page-title">商家管理中心</h1>
        
        <!-- 菜品管理区域 -->
        <section class="merchant-section">
          <h2><i class="fas fa-utensils"></i> 菜品管理</h2>
          <form class="dish-form" @submit.prevent="addDish">
            <div class="form-row">
              <div class="form-group">
                <label for="dishName">菜品名称</label>
                <input 
                  type="text" 
                  id="dishName" 
                  v-model="dishForm.name"
                  required
                >
              </div>
              <div class="form-group">
                <label for="dishPrice">价格 (元)</label>
                <input 
                  type="number" 
                  id="dishPrice" 
                  v-model="dishForm.price"
                  min="0" 
                  step="0.01" 
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="dishCategory">品类</label>
                <select 
                  id="dishCategory" 
                  v-model="dishForm.category"
                  required
                >
                  <option value="">请选择品类</option>
                  <option value="rice">米饭</option>
                  <option value="noodle">面食</option>
                  <option value="dumpling">饺子</option>
                  <option value="snack">小吃</option>
                </select>
              </div>
              <div class="form-group">
                <label for="dishTaste">口味</label>
                <select 
                  id="dishTaste" 
                  v-model="dishForm.taste"
                  required
                >
                  <option value="">请选择口味</option>
                  <option value="spicy">辣</option>
                  <option value="salty">咸</option>
                  <option value="light">淡</option>
                  <option value="sweet">甜</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="dishDescription">菜品描述</label>
              <textarea 
                id="dishDescription" 
                v-model="dishForm.description"
                rows="3"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus"></i> 添加菜品
            </button>
          </form>
          
          <div class="dish-list">
            <h3>我的菜品列表</h3>
            <div class="dishes-container">
              <div 
                v-for="dish in dishes" 
                :key="dish.id" 
                class="dish-item"
              >
                <div class="dish-info">
                  <h3 class="dish-name">{{ dish.name }}</h3>
                  <p class="dish-price">¥{{ dish.price }}</p>
                  <div class="dish-meta">
                    <span class="dish-category">{{ getCategoryName(dish.category) }}</span>
                    <span class="dish-taste">{{ getTasteName(dish.taste) }}</span>
                  </div>
                  <p class="dish-description" v-if="dish.description">{{ dish.description }}</p>
                </div>
                <div class="dish-actions">
                  <button 
                    class="btn btn-secondary"
                    @click="editDish(dish)"
                  >
                    <i class="fas fa-edit"></i> 编辑
                  </button>
                  <button 
                    class="btn btn-danger"
                    @click="deleteDish(dish.id)"
                  >
                    <i class="fas fa-trash"></i> 删除
                  </button>
                </div>
              </div>
              <div v-if="dishes.length === 0" class="empty-state">
                <i class="fas fa-utensils"></i>
                <p>暂无菜品，请添加您的第一个菜品</p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 客流量上报区域 -->
        <section class="merchant-section">
          <h2><i class="fas fa-users"></i> 客流量管理</h2>
          <form class="traffic-form" @submit.prevent="updateTraffic">
            <div class="form-group">
              <label for="trafficCount">当前客流量</label>
              <input 
                type="number" 
                id="trafficCount" 
                v-model="trafficForm.count"
                min="0" 
                required
              >
            </div>
            <div class="form-group">
              <label for="waitingTime">平均等待时间 (分钟)</label>
              <input 
                type="number" 
                id="waitingTime" 
                v-model="trafficForm.waitingTime"
                min="0" 
                step="0.5" 
                required
              >
            </div>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-sync-alt"></i> 更新客流量
            </button>
          </form>
          
          <div class="traffic-stats">
            <div class="stat-card">
              <div class="stat-value">{{ currentTraffic }}</div>
              <div class="stat-label">当前客流量</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ avgWaitTime }}</div>
              <div class="stat-label">平均等待时间(分钟)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ lastUpdate }}</div>
              <div class="stat-label">最后更新时间</div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '@/components/Footer.vue'
import { merchantAPI } from '@/services/api'

export default {
  name: 'MerchantDashboard',
  components: {
    AppFooter
  },
  data() {
    return {
      currentUser: null,
      dishForm: {
        name: '',
        price: '',
        category: '',
        taste: '',
        description: ''
      },
      trafficForm: {
        count: '',
        waitingTime: ''
      },
      dishes: [],
      currentTraffic: 0,
      avgWaitTime: 0,
      lastUpdate: '--:--',
      nextDishId: 1
    }
  },
  computed: {
    getCategoryName() {
      return (category) => {
        const categories = {
          'rice': '米饭',
          'noodle': '面食',
          'dumpling': '饺子',
          'snack': '小吃'
        }
        return categories[category] || category
      }
    },
    getTasteName() {
      return (taste) => {
        const tastes = {
          'spicy': '辣',
          'salty': '咸',
          'light': '淡',
          'sweet': '甜'
        }
        return tastes[taste] || taste
      }
    }
  },
  methods: {
    checkLoginStatus() {
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        this.currentUser = JSON.parse(userData)
      }
    },
    logout() {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
      this.currentUser = null
      alert('已退出登录')
      // 跳转到首页
      this.$router.push('/')
    },
    
    // 加载商家菜品列表
    async loadDishes() {
      try {
        console.log('加载商家菜品列表...')
        const response = await merchantAPI.getDishes()
        console.log('商家菜品列表响应:', response)
        
        if (response.success) {
          this.dishes = response.data.dishes
        } else {
          console.error('加载菜品列表失败:', response.message)
          alert('加载菜品列表失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('加载菜品列表异常:', error)
        alert('加载菜品列表失败，请检查网络连接')
      }
    },
    
    // 添加菜品
    async addDish() {
      try {
        console.log('添加菜品请求:', this.dishForm)
        const response = await merchantAPI.addDish(this.dishForm)
        console.log('添加菜品响应:', response)
        
        if (response.success) {
          alert('菜品添加成功！')
          // 重置表单
          this.dishForm = {
            name: '',
            price: '',
            category: '',
            taste: '',
            description: ''
          }
          // 重新加载菜品列表
          this.loadDishes()
        } else {
          alert('菜品添加失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('添加菜品异常:', error)
        alert('添加菜品失败，请检查网络连接')
      }
    },
    
    // 编辑菜品
    editDish(dish) {
      // 将菜品数据填充到表单进行编辑
      this.dishForm = { ...dish }
    },
    
    // 删除菜品
    async deleteDish(dishId) {
      if (!confirm('确定要删除这个菜品吗？')) {
        return
      }
      
      try {
        console.log('删除菜品请求:', dishId)
        const response = await merchantAPI.deleteDish(dishId)
        console.log('删除菜品响应:', response)
        
        if (response.success) {
          alert('菜品删除成功！')
          // 重新加载菜品列表
          this.loadDishes()
        } else {
          alert('菜品删除失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('删除菜品异常:', error)
        alert('删除菜品失败，请检查网络连接')
      }
    },
    
    // 更新客流量
    async updateTraffic() {
      try {
        console.log('更新客流量请求:', this.trafficForm)
        const response = await merchantAPI.updateTraffic(this.trafficForm)
        console.log('更新客流量响应:', response)
        
        if (response.success) {
          alert('客流量信息更新成功！')
          // 更新统计数据
          this.currentTraffic = response.data.currentTraffic
          this.avgWaitTime = response.data.avgWaitTime
          this.lastUpdate = new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
          // 重置表单
          this.trafficForm = {
            count: '',
            waitingTime: ''
          }
        } else {
          alert('客流量更新失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('更新客流量异常:', error)
        alert('更新客流量失败，请检查网络连接')
      }
    },
    
    // 加载商家统计
    async loadStats() {
      try {
        console.log('加载商家统计...')
        const response = await merchantAPI.getStats()
        console.log('商家统计响应:', response)
        
        if (response.success) {
          // 这里可以根据实际API响应结构更新统计数据
          // 暂时使用默认值
          this.currentTraffic = response.data.currentTraffic || 0
          this.avgWaitTime = response.data.avgWaitTime || 0
          this.lastUpdate = response.data.lastUpdate || '--:--'
        } else {
          console.error('加载商家统计失败:', response.message)
        }
      } catch (error) {
        console.error('加载商家统计异常:', error)
      }
    }
  },
  mounted() {
    this.checkLoginStatus()
    
    // 检查登录状态和权限
    const userData = localStorage.getItem('currentUser')
    if (!userData) {
      this.$router.push('/')
      return
    }
    
    const currentUser = JSON.parse(userData)
    // 这里可以添加商家权限检查
    if (currentUser.type && currentUser.type !== 'merchant') {
      this.$router.push('/')
      return
    }
    
    // 加载商家数据
    this.loadDishes()
    this.loadStats()
  }
}
</script>

<style scoped>
/* 只定义必要的组件特定样式，大部分样式复用merchant.css */
.merchant-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #adb5bd;
}

.dishes-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 商家头部样式 */
.merchant-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.merchant-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.merchant-logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.merchant-logo i {
  margin-right: 10px;
  font-size: 1.8rem;
}

.merchant-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.merchant-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.merchant-name {
  font-weight: 500;
  color: #ecf0f1;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .merchant-header-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .merchant-logo {
    font-size: 1.3rem;
  }
}
</style>
