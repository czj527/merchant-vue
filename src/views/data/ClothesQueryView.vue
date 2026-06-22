<template>
  <div>
    <PageHeader title="衣物查询" description="按衣物编码、订单号、工厂和状态查询单件衣物。">
      <template #extra>
        <el-button :loading="exportLoading" @click="handleExport">导出衣物</el-button>
      </template>
    </PageHeader>

    <div class="metric-grid">
      <MetricCard label="总衣物" value="12,428" hint="累计查询" />
      <MetricCard label="待预检" value="286" hint="等待预检" />
      <MetricCard label="已质检" value="8,913" hint="完成质检" />
      <MetricCard label="已出厂" value="3,229" hint="进入配送" />
    </div>

    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="衣物编码"><el-input v-model="query.clothNo" placeholder="请输入" /></el-form-item>
        <el-form-item label="订单号"><el-input v-model="query.orderNo" placeholder="请输入" /></el-form-item>
        <el-form-item label="工厂"><el-select v-model="query.factory" placeholder="请选择" clearable><el-option label="浙江(台州)洗衣工厂" value="浙江(台州)洗衣工厂" /><el-option label="浙江(宁波)洗衣工厂" value="浙江(宁波)洗衣工厂" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select v-model="query.status" placeholder="请选择" clearable><el-option label="待预检" value="待预检" /><el-option label="质检中" value="质检中" /><el-option label="已出厂" value="已出厂" /></el-select></el-form-item>
      </el-form>
      <el-table :data="rows" border>
        <el-table-column prop="clothNo" label="衣物编码" min-width="160" />
        <el-table-column prop="orderNo" label="订单号" min-width="160" />
        <el-table-column prop="category" label="衣物类型" width="100" />
        <el-table-column prop="status" label="当前状态" width="100" />
        <el-table-column prop="factory" label="处理工厂" min-width="160" />
        <el-table-column prop="updatedAt" label="更新时间" width="160" />
        <el-table-column label="操作" width="120"><template #default><el-button text type="primary" @click="detailVisible = true">查看详情</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="detailVisible" title="衣物详情" width="560px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="衣物编码">YX-CL-20260622</el-descriptions-item>
        <el-descriptions-item label="当前状态">已出厂</el-descriptions-item>
        <el-descriptions-item label="工厂">浙江(台州)洗衣工厂</el-descriptions-item>
        <el-descriptions-item label="更新时间">2026-06-22 10:36</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button type="primary" @click="detailVisible = false">知道了</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import YxCard from '@/components/base/YxCard.vue'

const exportLoading = ref(false)
const detailVisible = ref(false)
const query = reactive({ clothNo: '', orderNo: '', factory: '', status: '' })
const rows = [
  { clothNo: 'YX-CL-20260622-001', orderNo: 'YX202606220001', category: '运动鞋', status: '待预检', factory: '浙江(台州)洗衣工厂', updatedAt: '2026-06-22 10:11' },
  { clothNo: 'YX-CL-20260622-002', orderNo: 'YX202606220002', category: '羽绒服', status: '已出厂', factory: '浙江(宁波)洗衣工厂', updatedAt: '2026-06-22 09:45' },
]
async function handleExport() { if (exportLoading.value) return; exportLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('衣物导出任务已创建') } finally { exportLoading.value = false } }
</script>
