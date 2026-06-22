import { defineStore } from 'pinia'

const TOKEN_KEY = 'yx_merchant_token'
const USER_NAME_KEY = 'yx_merchant_user_name'
const ROLE_NAME_KEY = 'yx_merchant_role_name'

export const testAccount = {
  username: 'admin',
  password: '123456',
  userName: '麻雀奢活清洗服务',
  roleName: '商家管理员',
} as const

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    userName: localStorage.getItem(USER_NAME_KEY) || testAccount.userName,
    roleName: localStorage.getItem(ROLE_NAME_KEY) || testAccount.roleName,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
  },
  actions: {
    login() {
      this.token = 'mock-token'
      this.userName = testAccount.userName
      this.roleName = testAccount.roleName
      localStorage.setItem(TOKEN_KEY, this.token)
      localStorage.setItem(USER_NAME_KEY, this.userName)
      localStorage.setItem(ROLE_NAME_KEY, this.roleName)
    },
    logout() {
      this.token = ''
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_NAME_KEY)
      localStorage.removeItem(ROLE_NAME_KEY)
    },
  },
})
