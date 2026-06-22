<template>
  <div>
    <PageHeader :title="title" :description="description">
      <template #extra>
        <el-button v-if="secondaryActionText" :loading="secondaryLoading" @click="handleSecondaryAction">{{ secondaryActionText }}</el-button>
        <el-button v-if="primaryActionText" type="primary" :loading="primaryLoading" @click="handlePrimaryAction">{{ primaryActionText }}</el-button>
      </template>
    </PageHeader>

    <div class="filter-card">
      <el-form :model="query" inline>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" clearable :placeholder="keywordPlaceholder" style="width: 260px" @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <YxCard>
      <el-table v-loading="loading" :data="filteredRows" row-key="id">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
        >
          <template #default="{ row }">
            <StatusTag
              v-if="column.type === 'status' && column.statusMap"
              :label="column.statusMap[String(row[column.prop])]?.label || String(row[column.prop])"
              :type="column.statusMap[String(row[column.prop])]?.type || 'info'"
            />
            <span v-else-if="column.type === 'money'">¥{{ Number(row[column.prop] || 0).toFixed(2) }}</span>
            <span v-else>{{ row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" :loading="rowActionLoading === row.id" @click="handleRowAction(row)">{{ rowActionText }}</el-button>
            <el-button v-if="dangerActionText" text type="danger" :loading="dangerLoading === row.id" @click="handleDangerAction(row)">{{ dangerActionText }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && filteredRows.length === 0" :description="emptyText" />
    </YxCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import type { TableColumnConfig } from '@/types/module'

type RowData = Record<string, unknown> & { id: string }

const props = withDefaults(defineProps<{
  title: string
  description: string
  columns: TableColumnConfig[]
  rows: RowData[]
  keywordFields?: string[]
  keywordPlaceholder?: string
  emptyText?: string
  primaryActionText?: string
  secondaryActionText?: string
  rowActionText?: string
  dangerActionText?: string
}>(), {
  keywordPlaceholder: '请输入关键词',
  emptyText: '暂无数据',
  rowActionText: '编辑',
})

const query = reactive({ keyword: '' })
const loading = ref(false)
const primaryLoading = ref(false)
const secondaryLoading = ref(false)
const rowActionLoading = ref('')
const dangerLoading = ref('')

const filteredRows = computed(() => {
  const keyword = query.keyword.trim()
  if (!keyword) return props.rows
  const fields = props.keywordFields?.length ? props.keywordFields : props.columns.map((column) => column.prop)
  return props.rows.filter((row) => fields.some((field) => String(row[field] ?? '').includes(keyword)))
})

async function loadData() {
  loading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 360))
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  query.keyword = ''
  void loadData()
}

async function handlePrimaryAction() {
  if (primaryLoading.value) return
  primaryLoading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 520))
    ElMessage.success(`${props.primaryActionText}成功`)
  } finally {
    primaryLoading.value = false
  }
}

async function handleSecondaryAction() {
  if (secondaryLoading.value) return
  secondaryLoading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 520))
    ElMessage.success(`${props.secondaryActionText}任务已创建`)
  } finally {
    secondaryLoading.value = false
  }
}

async function handleRowAction(row: RowData) {
  if (rowActionLoading.value) return
  rowActionLoading.value = row.id
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 420))
    ElMessage.success(`${props.rowActionText}已保存`)
  } finally {
    rowActionLoading.value = ''
  }
}

async function handleDangerAction(row: RowData) {
  await ElMessageBox.confirm(`确认执行“${props.dangerActionText}”操作吗？`, '操作确认', { type: 'warning' })
  dangerLoading.value = row.id
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    ElMessage.success('操作成功')
  } finally {
    dangerLoading.value = ''
  }
}

onMounted(loadData)
</script>
