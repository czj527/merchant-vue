<template>
  <span class="status-tag" :class="`status-tag--${type}`">{{ label }}</span>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  type?: 'info' | 'primary' | 'success' | 'warning' | 'danger'
}>()
</script>
