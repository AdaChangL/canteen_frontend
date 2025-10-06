<template>
  <div class="user-dashboard">
    <!-- 复用现有Header -->
    <AppHeader />
    
    <!-- 主内容区 -->
    <main class="main">
      <!-- 英雄区域 -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">发现校园美食，享受智能推荐</h1>
            <p class="hero-subtitle">AI智能分析您的口味偏好，为您推荐最合适的美食</p>
            <div class="search-box">
              <input 
                type="text" 
                placeholder="例如：我想吃辣的面食，价格在15元以内" 
                class="search-input"
                v-model="searchQuery"
              >
              <button class="search-btn" @click="handleSearch">
                <i class="fas fa-search"></i>
                智能推荐
              </button>
            </div>
          </div>
          <div class="filter-panel">
            <h3>精确筛选</h3>
            
            <!-- 品类筛选 -->
            <div class="filter-group">
              <label for="category">品类</label>
              <select id="category" class="filter-select" v-model="filters.category">
                <option value="">所有品类</option>
                <option value="rice">米饭类</option>
                <option value="noodle">面食类</option>
                <option value="snack">小吃类</option>
                <option value="drink">饮品类</option>
                <option value="breakfast">早餐类</option>
                <option value="hotpot">火锅类</option>
              </select>
            </div>
            
            <!-- 口味筛选 -->
            <div class="filter-group">
              <label for="flavor">口味偏好</label>
              <div class="flavor-tags">
                <span 
                  v-for="flavor in flavorOptions" 
                  :key="flavor.value"
                  class="flavor-tag" 
                  :class="{ active: filters.flavors.includes(flavor.value) }"
                  @click="toggleFlavor(flavor.value)"
                >
                  {{ flavor.label }}
                </span>
              </div>
            </div>
            
            <!-- 价格范围 -->
            <div class="filter-group">
              <label for="price">价格范围 (元)</label>
              <div class="range-inputs">
                <input 
                  type="number" 
                  id="price-min" 
                  placeholder="最低价" 
                  min="0" 
                  max="100"
                  v-model.number="filters.priceMin"
                >
                <span class="range-separator">-</span>
                <input 
                  type="number" 
                  id="price-max" 
                  placeholder="最高价" 
                  min="0" 
                  max="100"
                  v-model.number="filters.priceMax"
                >
              </div>
              <div class="price-slider">
                <input 
                  type="range" 
                  id="price-range-min" 
                  min="0" 
                  max="50" 
                  v-model.number="filters.priceMin"
                >
                <input 
                  type="range" 
                  id="price-range-max" 
                  min="0" 
                  max="50" 
                  v-model.number="filters.priceMax"
                >
              </div>
              <div class="price-display">¥{{ filters.priceMin }} - ¥{{ filters.priceMax }}</div>
            </div>
            
            <!-- 人流量 -->
            <div class="filter-group">
              <label for="crowd">人流量</label>
              <div class="crowd-level">
                <div class="crowd-option" v-for="option in crowdOptions" :key="option.value">
                  <input 
                    type="radio" 
                    :id="'crowd-' + option.value" 
                    name="crowd" 
                    :value="option.value"
                    v-model="filters.crowd"
                  >
                  <label :for="'crowd-' + option.value">{{ option.label }}</label>
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="filter-actions">
              <button class="btn-filter-apply" @click="applyFilters">应用筛选</button>
              <button class="btn-filter-reset" @click="resetFilters">重置</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能区域 -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">核心功能</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="feature in features" :key="feature.id">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门推荐和AI助手区域 -->
      <section class="recommendation-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">AI美食助手</h2>
            <h2 class="section-title">今日热门推荐</h2>
          </div>
          <div class="red-line"></div>
          
          <div class="content-container">
            <!-- 左侧：AI助手 -->
            <div class="ai-assistant-side">
              <div class="ai-header">
                <div class="ai-avatar">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="ai-intro">
                  <h3>您好！我是您的AI美食助手</h3>
                  <p>告诉我您的口味偏好和预算，我可以为您推荐合适的美食！</p>
                </div>
              </div>
              
              <div class="ai-chat-container">
                <div class="chat-messages" ref="chatMessages">
                  <div class="message ai-message">
                    <div class="message-content">
                      <p>您好！请告诉我您想吃什么类型的美食？比如口味偏好、预算范围等。</p>
                    </div>
                  </div>
                </div>
                
                <div class="chat-input-container">
                  <div class="input-example">
                    <span>例如：我想吃辣的面食，预</span>
                  </div>
                  <div class="input-group">
                    <input 
                      type="text" 
                      ref="foodInput"
                      placeholder="输入您想吃的美食..." 
                      class="chat-input"
                      v-model="aiInput"
                      @keypress.enter="handleAIMessage"
                    >
                    <button class="send-btn" @click="handleAIMessage">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                  </div>
                  <div class="examples">
                    <span>示例：</span>
                    <span 
                      class="example-text" 
                      v-for="example in exampleQuestions" 
                      :key="example"
                      @click="useExample(example)"
                    >
                      {{ example }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右侧：热门推荐 -->
            <div class="popular-dishes-side">
              <div class="dishes-grid">
                <div 
                  class="dish-card" 
                  v-for="dish in popularDishes" 
                  :key="dish.id"
                  @click="viewDishDetail(dish.id)"
                >
                  <div class="dish-image" :style="{ background: dish.color }">
                    <div class="dish-rating">
                      <i class="fas fa-star"></i> {{ dish.rating }}
                    </div>
                    <i :class="dish.icon"></i>
                  </div>
                  <div class="dish-info">
                    <div class="dish-header">
                      <h3 class="dish-name">{{ dish.name }}</h3>
                      <div class="dish-price">¥{{ dish.price }}</div>
                    </div>
                    <p class="dish-description">{{ dish.description }}</p>
                    <div class="dish-meta">
                      <span class="dish-canteen">{{ dish.canteen }}</span>
                      <span class="dish-wait-time">
                        <i class="fas fa-clock"></i> {{ dish.waitTime }}
                      </span>
                    </div>
                    <div class="dish-tags">
                      <span 
                        v-for="tag in dish.tags" 
                        :key="tag"
                        class="dish-tag"
                        :class="getTagClass(tag)"
                      >
                        {{ tag }}
                      </span>
                    </div>
                    <div class="dish-actions">
                      <button class="dish-btn primary" @click.stop="orderDish(dish.id)">
                        <i class="fas fa-utensils"></i> 立即下单
                      </button>
                      <button class="dish-btn secondary" @click.stop="addToFavorites(dish.id)">
                        <i class="fas fa-heart"></i> 收藏
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 复用现有Footer -->
    <AppFooter />
    
    <!-- 复用现有LoginModal -->
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'
import LoginModal from '@/components/LoginModal.vue'
import { dishesAPI, ordersAPI } from '@/services/api'

export default {
  name: 'UserDashboard',
  components: {
    AppHeader,
    AppFooter,
    LoginModal
  },
  data() {
    return {
      showLoginModal: false,
      searchQuery: '',
      filters: {
        category: '',
        flavors: [],
        priceMin: 0,
        priceMax: 50,
        crowd: 'any'
      },
      flavorOptions: [
        { value: 'spicy', label: '辣' },
        { value: 'sour', label: '酸' },
        { value: 'sweet', label: '甜' },
        { value: 'salty', label: '咸' },
        { value: 'light', label: '清淡' },
        { value: 'heavy', label: '重口味' }
      ],
      crowdOptions: [
        { value: 'low', label: '稀少' },
        { value: 'medium', label: '适中' },
        { value: 'high', label: '拥挤' },
        { value: 'any', label: '不限' }
      ],
      features: [
        {
          id: 1,
          icon: 'fas fa-utensils',
          title: '智能菜品推荐',
          description: '基于AI分析您的口味偏好，为您精准推荐合适的美食'
        },
        {
          id: 2,
          icon: 'fas fa-chart-line',
          title: '实时客流量',
          description: '查看各食堂窗口实时客流，避开排队高峰'
        },
        {
          id: 3,
          icon: 'fas fa-search',
          title: '精准筛选',
          description: '按品类、口味、价格等多维度筛选菜品'
        },
        {
          id: 4,
          icon: 'fas fa-store',
          title: '商家管理',
          description: '商家可便捷管理菜品信息和更新客流数据'
        }
      ],
      aiInput: '',
      exampleQuestions: [
        '我想吃辣的面食，价格实惠的',
        '推荐清淡的粤菜，人均100-200元',
        '适合情侣约会的西餐厅'
      ],
      popularDishes: [
        {
          id: 1,
          name: "麻辣香锅",
          price: 28,
          rating: 4.8,
          description: "香辣可口，配料丰富，多种食材任你选择",
          canteen: "第一食堂",
          waitTime: "15-20分钟",
          tags: ["辣", "实惠", "推荐"],
          color: "linear-gradient(45deg, #ff9a9e, #fad0c4)",
          icon: "fas fa-utensils"
        },
        {
          id: 2,
          name: "番茄牛肉面",
          price: 22,
          rating: 4.6,
          description: "新鲜番茄熬制汤底，牛肉鲜嫩多汁",
          canteen: "第二食堂",
          waitTime: "10-15分钟",
          tags: ["不辣", "面食"],
          color: "linear-gradient(45deg, #a1c4fd, #c2e9fb)",
          icon: "fas fa-bowl-food"
        },
        {
          id: 3,
          name: "黄焖鸡米饭",
          price: 25,
          rating: 4.7,
          description: "鸡肉鲜嫩，汤汁浓郁，配米饭绝佳",
          canteen: "第三食堂",
          waitTime: "12-18分钟",
          tags: ["微辣", "米饭", "热门"],
          color: "linear-gradient(45deg, #ffecd2, #fcb69f)",
          icon: "fas fa-burger"
        },
        {
          id: 4,
          name: "扬州炒饭",
          price: 18,
          rating: 4.5,
          description: "粒粒分明，配料丰富，传统经典",
          canteen: "第四食堂",
          waitTime: "8-12分钟",
          tags: ["不辣", "实惠", "推荐"],
          color: "linear-gradient(45deg, #84fab0, #8fd3f4)",
          icon: "fas fa-pizza-slice"
        }
      ]
    }
  },
  methods: {
    // 菜品搜索
    async handleSearch() {
      if (!this.searchQuery.trim()) return
      
      console.log('开始菜品搜索:', this.searchQuery)
      
      try {
        const response = await dishesAPI.search({
          q: this.searchQuery,
          page: 1,
          limit: 10
        })
        
        console.log('菜品搜索结果:', response)
        
        if (response.success) {
          // 这里可以处理搜索结果，比如显示搜索结果页面
          alert(`搜索到 ${response.data.dishes.length} 个相关菜品`)
        } else {
          alert('搜索失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('菜品搜索失败:', error)
        alert('搜索失败，请检查网络连接')
      }
    },
    
    toggleFlavor(flavor) {
      const index = this.filters.flavors.indexOf(flavor)
      if (index > -1) {
        this.filters.flavors.splice(index, 1)
      } else {
        this.filters.flavors.push(flavor)
      }
    },
    
    // 菜品筛选
    async applyFilters() {
      console.log('应用筛选条件:', this.filters)
      
      try {
        const params = {
          category: this.filters.category,
          flavors: this.filters.flavors.join(','),
          priceMin: this.filters.priceMin,
          priceMax: this.filters.priceMax,
          crowd: this.filters.crowd
        }
        
        console.log('发送筛选请求参数:', params)
        
        const response = await dishesAPI.filter(params)
        
        console.log('菜品筛选结果:', response)
        
        if (response.success) {
          alert(`筛选到 ${response.data.dishes.length} 个符合条件的菜品`)
        } else {
          alert('筛选失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('菜品筛选失败:', error)
        alert('筛选失败，请检查网络连接')
      }
    },
    
    resetFilters() {
      this.filters = {
        category: '',
        flavors: [],
        priceMin: 0,
        priceMax: 50,
        crowd: 'any'
      }
    },
    
    // AI智能推荐
    async handleAIMessage() {
      if (!this.aiInput.trim()) return
      
      // 添加用户消息
      this.addMessage(this.aiInput, 'user')
      
      try {
        // 获取用户偏好
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        const preferences = currentUser?.preferences || {
          flavors: [],
          budget: { min: 0, max: 50 },
          dietary: []
        }
        
        console.log('发送AI推荐请求:', this.aiInput, preferences)
        
        const response = await dishesAPI.aiRecommend({
          query: this.aiInput,
          preferences: preferences
        })
        
        console.log('AI推荐结果:', response)
        
        if (response.success) {
          const aiResponse = this.formatAIResponse(response.data)
          this.addMessage(aiResponse, 'ai')
        } else {
          this.addMessage('抱歉，AI推荐服务暂时不可用，请稍后再试。', 'ai')
        }
      } catch (error) {
        console.error('AI推荐失败:', error)
        this.addMessage('抱歉，AI推荐服务暂时不可用，请稍后再试。', 'ai')
      }
      
      // 滚动到底部
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight
        }
      })
      
      // 清空输入框
      this.aiInput = ''
    },
    
    formatAIResponse(data) {
      let response = '根据您的需求，我为您推荐以下菜品：\n\n'
      
      if (data.recommendations && data.recommendations.length > 0) {
        data.recommendations.forEach((rec, index) => {
          response += `${index + 1}. ${rec.dish.name} (${rec.dish.canteen}) - ¥${rec.dish.price}\n`
          response += `   推荐理由: ${rec.reason}\n`
          response += `   匹配度: ${Math.round(rec.matchScore * 100)}%\n\n`
        })
      } else {
        response = '抱歉，没有找到符合您需求的菜品，请尝试调整您的搜索条件。'
      }
      
      return response
    },
    
    addMessage(text, type) {
      const chatMessages = this.$refs.chatMessages
      if (!chatMessages) return
      
      const messageDiv = document.createElement('div')
      messageDiv.className = `message ${type}-message`
      
      if (type === 'user') {
        messageDiv.innerHTML = `
          <div class="message-content">
            <p>${text}</p>
          </div>
        `
      } else {
        messageDiv.innerHTML = `
          <div class="message-content">
            <p>${text}</p>
          </div>
        `
      }
      
      chatMessages.appendChild(messageDiv)
    },
    
    useExample(example) {
      this.aiInput = example
      this.handleAIMessage()
    },
    
    getTagClass(tag) {
      if (tag === '辣' || tag === '麻辣' || tag === '酸辣') return 'spicy'
      if (tag === '实惠' || tag === '便宜') return 'cheap'
      return ''
    },
    
    viewDishDetail(dishId) {
      console.log('查看菜品详情:', dishId)
      // 这里可以跳转到菜品详情页面
    },
    
    // 下单菜品
    async orderDish(dishId) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (!currentUser) {
        this.showLoginModal = true
        return
      }
      
      try {
        console.log('下单菜品:', dishId)
        
        const response = await ordersAPI.createOrder({
          dishId: dishId,
          quantity: 1
        })
        
        console.log('下单结果:', response)
        
        if (response.success) {
          alert(`下单成功！订单号: ${response.data.orderId}\n预计等待时间: ${response.data.estimatedWaitTime}分钟`)
        } else {
          alert('下单失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('下单失败:', error)
        alert('下单失败，请检查网络连接')
      }
    },
    
    // 收藏菜品
    async addToFavorites(dishId) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (!currentUser) {
        this.showLoginModal = true
        return
      }
      
      try {
        console.log('收藏菜品:', dishId)
        
        const response = await ordersAPI.addFavorite({
          dishId: dishId
        })
        
        console.log('收藏结果:', response)
        
        if (response.success) {
          alert('收藏成功！')
        } else {
          alert('收藏失败: ' + (response.message || '未知错误'))
        }
      } catch (error) {
        console.error('收藏失败:', error)
        alert('收藏失败，请检查网络连接')
      }
    },
    
    // 加载热门推荐
    async loadPopularDishes() {
      try {
        console.log('加载热门推荐...')
        
        const response = await dishesAPI.getPopular()
        
        console.log('热门推荐结果:', response)
        
        if (response.success) {
          this.popularDishes = response.data.dishes.map(dish => ({
            ...dish,
            color: this.getRandomGradient(),
            icon: this.getDishIcon(dish.category)
          }))
        } else {
          console.log('加载热门推荐失败:', response.message)
        }
      } catch (error) {
        console.error('加载热门推荐失败:', error)
      }
    },
    
    getRandomGradient() {
      const gradients = [
        'linear-gradient(45deg, #ff9a9e, #fad0c4)',
        'linear-gradient(45deg, #a1c4fd, #c2e9fb)',
        'linear-gradient(45deg, #ffecd2, #fcb69f)',
        'linear-gradient(45deg, #84fab0, #8fd3f4)'
      ]
      return gradients[Math.floor(Math.random() * gradients.length)]
    },
    
    getDishIcon(category) {
      const icons = {
        '主食': 'fas fa-utensils',
        '面食': 'fas fa-bowl-food',
        '米饭': 'fas fa-burger',
        '小吃': 'fas fa-pizza-slice',
        '饮品': 'fas fa-coffee',
        '早餐': 'fas fa-egg'
      }
      return icons[category] || 'fas fa-utensils'
    }
  },
  mounted() {
    console.log('用户仪表板已加载')
    // 加载热门推荐数据
    this.loadPopularDishes()
  }
}
</script>

<style>
/* UserDashboard组件使用全局样式，无需重复定义 */
/* 全局样式已在user.css中定义 */
</style>
