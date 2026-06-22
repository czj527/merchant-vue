<template>
  <RouterView v-if="isLoginPage" />
  <AppShell v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>
