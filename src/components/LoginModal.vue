<template>
  <div v-if="show" class="modal" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ modalTitle }}</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
  <div class="modal-body">
    <!-- 错误消息显示 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div class="auth-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'user-login' }"
        @click="switchTab('user-login')"
      >
        用户登录
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'merchant-login' }"
        @click="switchTab('merchant-login')"
      >
        商家登录
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'register' }"
        @click="switchTab('register')"
      >
        注册
      </button>
    </div>
        
        <!-- 用户登录表单 -->
        <div class="tab-content" :class="{ active: activeTab === 'user-login' }">
          <form class="auth-form" @submit.prevent="handleUserLogin">
            <div class="form-group">
              <label for="username">用户名</label>
              <input 
                type="text" 
                id="username" 
                v-model="userLoginForm.username"
                placeholder="请输入用户名" 
                required
              >
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input 
                type="password" 
                id="password" 
                v-model="userLoginForm.password"
                placeholder="请输入密码" 
                required
              >
            </div>
            <div class="form-group">
              <label for="captcha">验证码</label>
              <div class="captcha-container">
                <input 
                  type="text" 
                  id="captcha" 
                  v-model="userLoginForm.captcha"
                  placeholder="请输入验证码" 
                  required
                >
                <span class="captcha-code">{{ userCaptchaCode }}</span>
              </div>
            </div>
            <button type="submit" class="auth-btn">登录</button>
            <div class="auth-links">
              <a href="#">找回密码</a>
              <a href="#">使用统一身份认证登录</a>
            </div>
          </form>
        </div>
        
        <!-- 商家登录表单 -->
        <div class="tab-content" :class="{ active: activeTab === 'merchant-login' }">
          <form class="auth-form" @submit.prevent="handleMerchantLogin">
            <div class="form-group">
              <label for="merchant-username">商家账号</label>
              <input 
                type="text" 
                id="merchant-username" 
                v-model="merchantLoginForm.username"
                placeholder="请输入商家账号" 
                required
              >
            </div>
            <div class="form-group">
              <label for="merchant-password">密码</label>
              <input 
                type="password" 
                id="merchant-password" 
                v-model="merchantLoginForm.password"
                placeholder="请输入密码" 
                required
              >
            </div>
            <div class="form-group">
              <label for="merchant-captcha">验证码</label>
              <div class="captcha-container">
                <input 
                  type="text" 
                  id="merchant-captcha" 
                  v-model="merchantLoginForm.captcha"
                  placeholder="请输入验证码" 
                  required
                >
                <span class="captcha-code">{{ merchantCaptchaCode }}</span>
              </div>
            </div>
            <button type="submit" class="auth-btn">商家登录</button>
          </form>
        </div>
        
        <!-- 注册表单 -->
        <div class="tab-content" :class="{ active: activeTab === 'register' }">
          <form class="auth-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="register-type">注册类型</label>
              <select 
                id="register-type" 
                v-model="registerForm.type"
                required
              >
                <option value="">请选择注册类型</option>
                <option value="user">用户账号</option>
                <option value="merchant">商家账号</option>
              </select>
            </div>
            <div class="form-group">
              <label for="register-username">用户名</label>
              <input 
                type="text" 
                id="register-username" 
                v-model="registerForm.username"
                placeholder="请输入用户名" 
                required
              >
            </div>
            <div class="form-group">
              <label for="register-password">密码</label>
              <input 
                type="password" 
                id="register-password" 
                v-model="registerForm.password"
                placeholder="请输入密码" 
                required
              >
            </div>
            <div class="form-group">
              <label for="register-confirm-password">确认密码</label>
              <input 
                type="password" 
                id="register-confirm-password" 
                v-model="registerForm.confirmPassword"
                placeholder="请再次输入密码" 
                required
              >
            </div>
            <div class="form-group">
              <label for="register-email">邮箱</label>
              <input 
                type="email" 
                id="register-email" 
                v-model="registerForm.email"
                placeholder="请输入邮箱" 
                required
              >
            </div>
            <button type="submit" class="auth-btn">注册</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/services/api'

export default {
  name: 'LoginModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    initialTab: {
      type: String,
      default: 'user-login'
    }
  },
  data() {
    return {
      activeTab: this.initialTab,
      userLoginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      merchantLoginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      registerForm: {
        type: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        storeName: '',
        canteen: ''
      },
      userCaptchaCode: '',
      merchantCaptchaCode: '',
      loading: false,
      errorMessage: ''
    }
  },
  computed: {
    modalTitle() {
      switch (this.activeTab) {
        case 'user-login':
          return '用户登录'
        case 'merchant-login':
          return '商家登录'
        case 'register':
          return '注册账号'
        default:
          return '登录/注册'
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    switchTab(tab) {
      this.activeTab = tab
      // 切换标签页时清空错误消息
      this.errorMessage = ''
      // 切换标签页时重新生成验证码
      this.generateCaptcha()
    },
    async handleUserLogin() {
      if (this.loading) return
      
      console.log('=== 用户登录调试信息 ===')
      console.log('输入的用户名:', this.userLoginForm.username)
      console.log('输入的验证码:', this.userLoginForm.captcha)
      console.log('当前验证码:', this.userCaptchaCode)
      
      // 前端验证码验证
      if (this.userLoginForm.captcha.toUpperCase() !== this.userCaptchaCode) {
        console.log('验证码验证失败')
        this.errorMessage = '验证码错误，请重新输入'
        // 重新生成验证码
        this.generateCaptcha()
        return
      }
      
      console.log('验证码验证通过，开始API请求')
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        const loginData = {
          username: this.userLoginForm.username,
          password: this.userLoginForm.password,
          captcha: this.userLoginForm.captcha
        }
        
        console.log('发送登录请求数据:', { ...loginData, password: '***' })
        
        const response = await authAPI.userLogin(loginData)
        
        console.log('收到登录响应:', response)
        
        if (response.success) {
          const { user, token } = response.data
          
          console.log('登录成功，用户信息:', user)
          
          // 保存token和用户信息
          localStorage.setItem('token', token)
          localStorage.setItem('currentUser', JSON.stringify(user))
          
          // 触发登录成功事件
          this.$emit('login-success', user)
          
          // 跳转到用户仪表板
          this.$router.push('/user/dashboard')
          this.$emit('close')
        } else {
          console.log('登录失败，错误信息:', response.message)
          this.errorMessage = response.message || '登录失败'
          // 登录失败时重新生成验证码
          this.generateCaptcha()
        }
      } catch (error) {
        console.error('用户登录失败:', error)
        console.log('错误详情:', error.response ? error.response.data : error.message)
        this.errorMessage = '登录失败，请检查用户名、密码和验证码'
        // 登录失败时重新生成验证码
        this.generateCaptcha()
      } finally {
        this.loading = false
      }
    },
    
    async handleMerchantLogin() {
      if (this.loading) return
      
      // 前端验证码验证
      if (this.merchantLoginForm.captcha.toUpperCase() !== this.merchantCaptchaCode) {
        this.errorMessage = '验证码错误，请重新输入'
        // 重新生成验证码
        this.generateCaptcha()
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await authAPI.merchantLogin({
          username: this.merchantLoginForm.username,
          password: this.merchantLoginForm.password,
          captcha: this.merchantLoginForm.captcha
        })
        
        if (response.success) {
          const { merchant, token } = response.data
          
          // 保存token和商家信息
          localStorage.setItem('token', token)
          localStorage.setItem('currentUser', JSON.stringify(merchant))
          
          // 触发登录成功事件
          this.$emit('login-success', merchant)
          
          // 跳转到商家仪表板
          this.$router.push('/merchant/dashboard')
          this.$emit('close')
        } else {
          this.errorMessage = response.message || '商家登录失败'
          // 登录失败时重新生成验证码
          this.generateCaptcha()
        }
      } catch (error) {
        console.error('商家登录失败:', error)
        this.errorMessage = '商家登录失败，请检查账号、密码和验证码'
        // 登录失败时重新生成验证码
        this.generateCaptcha()
      } finally {
        this.loading = false
      }
    },
    
    async handleRegister() {
      if (this.loading) return
      
      // 验证密码一致性
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致'
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        const registerData = {
          type: this.registerForm.type,
          username: this.registerForm.username,
          password: this.registerForm.password,
          confirmPassword: this.registerForm.confirmPassword,
          email: this.registerForm.email
        }
        
        // 如果是商家注册，添加额外字段
        if (this.registerForm.type === 'merchant') {
          if (!this.registerForm.storeName || !this.registerForm.canteen) {
            this.errorMessage = '商家注册需要填写店铺名称和所属食堂'
            this.loading = false
            return
          }
          registerData.storeName = this.registerForm.storeName
          registerData.canteen = this.registerForm.canteen
        }
        
        const response = await authAPI.register(registerData)
        
        if (response.success) {
          alert('注册成功！请登录')
          // 切换到登录标签页
          this.activeTab = this.registerForm.type === 'merchant' ? 'merchant-login' : 'user-login'
          // 清空注册表单
          this.registerForm = {
            type: '',
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            storeName: '',
            canteen: ''
          }
        } else {
          this.errorMessage = response.message || '注册失败'
        }
      } catch (error) {
        console.error('注册失败:', error)
        this.errorMessage = '注册失败，请检查输入信息'
      } finally {
        this.loading = false
      }
    },
    
    async generateCaptcha() {
      try {
        const response = await authAPI.getCaptcha()
        if (response.success) {
          this.userCaptchaCode = response.data.captchaCode
          this.merchantCaptchaCode = response.data.captchaCode
        } else {
          // 如果API失败，使用本地生成
          this.userCaptchaCode = Math.random().toString(36).substring(2, 8).toUpperCase()
          this.merchantCaptchaCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        }
      } catch (error) {
        console.error('获取验证码失败:', error)
        // 使用本地生成作为fallback
        this.userCaptchaCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        this.merchantCaptchaCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      }
    }
  },
  watch: {
    initialTab(newTab) {
      this.activeTab = newTab
    }
  },
  mounted() {
    this.generateCaptcha()
  }
}
</script>

<style>
/* LoginModal组件使用全局样式，无需重复定义 */
/* 全局样式已在auth.css中定义 */
</style>
