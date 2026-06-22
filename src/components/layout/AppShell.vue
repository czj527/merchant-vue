<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <RouterLink class="brand" to="/workbench/merchant">
        <span class="brand__mark">{{ brandConfig.logoText }}</span>
        <span>
          <strong>{{ brandConfig.name }}</strong>
          <small>商家端</small>
        </span>
      </RouterLink>

      <nav class="main-menu">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          class="main-menu__item"
          :class="{ 'is-active': activeModule?.title === item.title }"
          :to="item.path"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.title }}</span>
        </RouterLink>
      </nav>
    </aside>

    <section class="app-main">
      <header class="topbar">
        <div>
          <div class="topbar__module">{{ activeModule?.title || route.meta.module || '工作台' }}</div>
          <div class="topbar__title">{{ route.meta.title }}</div>
        </div>
        <div class="topbar__right">
          <span class="hotline">服务热线：{{ brandConfig.serviceHotline }}</span>
          <el-button text>操作指南</el-button>
          <el-dropdown @command="handleUserCommand">
            <button class="user-chip">{{ userStore.userName }}<span>{{ userStore.roleName }}</span></button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <div v-if="activeModule?.children?.length" class="module-tabs">
        <RouterLink
          v-for="child in activeModule.children"
          :key="child.path"
          class="module-tabs__item"
          :to="child.path"
        >
          {{ child.title }}
        </RouterLink>
      </div>

      <main class="page-content">
        <RouterView />
      </main>

      <footer class="app-footer">
        {{ brandConfig.copyright }} · {{ brandConfig.recordNo }}
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { brandConfig } from '@/config/brand'
import { menuItems } from '@/config/menu'
import { useUserStore } from '@/app/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

function handleUserCommand(command: string) {
  if (command === 'profile') {
    router.push('/settings/profile')
    return
  }

  if (command === 'logout') {
    userStore.logout()
    router.replace('/login')
  }
}

const activeModule = computed(() => {
  return menuItems.find((item) => route.path === item.path || route.path.startsWith(`${item.path.split('/').slice(0, 2).join('/')}/`))
})
</script>
