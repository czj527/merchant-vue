<template>
  <main class="login-page">
    <section class="login-hero">
      <RouterLink class="login-brand" to="/login">
        <span class="login-brand__mark">{{ brandConfig.logoText }}</span>
        <span>
          <strong>{{ brandConfig.appName }}</strong>
          <small>{{ brandConfig.slogan }}</small>
        </span>
      </RouterLink>

      <div class="login-hero__content">
        <p class="eyebrow">Merchant console</p>
        <h1>把订单、会员和履约进度放在一个清晰的工作台里。</h1>
        <p>当前阶段使用 Mock 数据，先打磨前端流程和交互。登录后可进入工作台、订单和会员模块。</p>
      </div>

      <div class="login-hero__panel">
        <div class="flow-node is-active">下单</div>
        <div class="flow-node is-active">取件</div>
        <div class="flow-node">洗护</div>
        <div class="flow-node">质检</div>
        <div class="flow-node">发货</div>
      </div>
    </section>

    <section class="login-card">
      <div class="login-card__head">
        <h2>登录商家端</h2>
        <p>测试阶段暂不校验账号密码，点击登录即可进入系统。</p>
      </div>

      <el-alert class="account-tip" type="info" :closable="false" show-icon>
        <template #title>测试账号：{{ testAccount.username }} / {{ testAccount.password }}</template>
      </el-alert>

      <el-form :model="form" label-position="top" :disabled="loginLoading" @keyup.enter="handleLogin">
        <el-form-item label="账号">
          <el-input v-model="form.username" size="large" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" size="large" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <div class="login-options">
          <el-checkbox v-model="form.remember">记住登录状态</el-checkbox>
          <span>忘记密码请联系管理员</span>
        </div>
        <el-button class="login-submit" type="primary" size="large" :loading="loginLoading" @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { brandConfig } from '@/config/brand'
import { testAccount, useUserStore } from '@/app/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loginLoading = ref(false)
const form = reactive({
  username: testAccount.username,
  password: testAccount.password,
  remember: true,
})

async function handleLogin() {
  if (loginLoading.value) return
  loginLoading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    userStore.login()
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/workbench/merchant'
    await router.replace(redirect)
  } finally {
    loginLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) 460px;
  gap: 48px;
  padding: 48px;
  background:
    radial-gradient(circle at 20% 12%, rgba(24, 184, 166, 0.16), transparent 28%),
    linear-gradient(135deg, #f4f9fd 0%, #eef7fb 48%, #f8fbfd 100%);
}

.login-hero,
.login-card {
  border: 1px solid rgba(229, 234, 240, 0.9);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 24px 70px rgba(31, 41, 55, 0.08);
  backdrop-filter: blur(16px);
}

.login-hero {
  position: relative;
  overflow: hidden;
  padding: 34px;
}

.login-hero::after {
  position: absolute;
  right: -120px;
  bottom: -120px;
  width: 360px;
  height: 360px;
  content: '';
  border: 54px solid rgba(18, 136, 232, 0.08);
  border-radius: 50%;
}

.login-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.login-brand__mark {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: #fff;
  font-weight: 750;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--yx-primary), var(--yx-accent));
}

.login-brand strong,
.login-brand small {
  display: block;
}

.login-brand strong {
  font-size: 19px;
}

.login-brand small {
  margin-top: 3px;
  color: var(--yx-text-secondary);
}

.login-hero__content {
  max-width: 640px;
  margin-top: 128px;
}

.eyebrow {
  margin: 0 0 14px;
  color: var(--yx-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.login-hero h1 {
  margin: 0;
  color: var(--yx-text-primary);
  font-size: 44px;
  line-height: 1.16;
  letter-spacing: -0.04em;
}

.login-hero__content > p:last-child {
  max-width: 560px;
  margin: 22px 0 0;
  color: var(--yx-text-regular);
  font-size: 16px;
  line-height: 1.8;
}

.login-hero__panel {
  position: absolute;
  right: 34px;
  bottom: 34px;
  z-index: 1;
  display: flex;
  gap: 10px;
  padding: 14px;
  background: #fff;
  border: 1px solid var(--yx-border);
  border-radius: 999px;
}

.flow-node {
  padding: 8px 14px;
  color: var(--yx-text-secondary);
  background: #f7f9fb;
  border-radius: 999px;
}

.flow-node.is-active {
  color: var(--yx-primary);
  background: var(--yx-primary-soft);
}

.login-card {
  align-self: center;
  padding: 34px;
}

.login-card__head h2 {
  margin: 0;
  font-size: 26px;
}

.login-card__head p {
  margin: 10px 0 0;
  color: var(--yx-text-secondary);
  line-height: 1.7;
}

.account-tip {
  margin: 24px 0;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
  color: var(--yx-text-secondary);
  font-size: 13px;
}

.login-submit {
  width: 100%;
}

@media (max-width: 1080px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .login-hero__content {
    margin-top: 60px;
  }
}
</style>
