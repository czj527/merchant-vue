<template>
  <div>
    <PageHeader title="订单查询" description="按订单号、手机号、工厂、状态等维度查看订单。">
      <template #extra><el-button :loading="exportLoading" @click="exportData">导出订单</el-button></template>
    </PageHeader>
    <YxCard>
      <el-form inline :model="query"><el-form-item label="订单号"><el-input v-model="query.keyword" placeholder="请输入" /></el-form-item><el-form-item label="工厂"><el-select v-model="query.factory" clearable placeholder="请选择"><el-option label="河北(廊坊/三河市)-洗衣工厂" value="0459" /><el-option label="浙江(台州/仙居县)-洗衣工厂" value="0289" /></el-select></el-form-item><el-form-item label="状态"><el-select v-model="query.status" clearable placeholder="请选择"><el-option label="全部" value="" /><el-option label="已完成" value="done" /><el-option label="洗护中" value="washing" /></el-select></el-form-item><el-form-item><el-button @click="reset">重置</el-button><el-button type="primary" :loading="loading" @click="queryData">查询</el-button></el-form-item></el-form>
      <el-table :data="rows" border>
        <el-table-column prop="orderNo" label="订单号" min-width="160" />
        <el-table-column prop="merchant" label="商户" min-width="150" />
        <el-table-column prop="factory" label="工厂" min-width="150" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
      </el-table>
    </YxCard>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const exportLoading = ref(false)
const loading = ref(false)
const query = reactive({ keyword: '', factory: '', status: '' })
const rows = [{ orderNo: 'YX202606220001', merchant: '麻雀奢活清洗服务', factory: '河北(廊坊/三河市)-洗衣工厂', status: '洗护中', createdAt: '2026-06-22 10:11' }, { orderNo: 'YX202606220002', merchant: '优洗生活城西店', factory: '浙江(台州/仙居县)-洗衣工厂', status: '已完成', createdAt: '2026-06-22 09:45' }]
async function queryData() { loading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 350)) } finally { loading.value = false } }
function reset(){ query.keyword=''; query.factory=''; query.status='' }
async function exportData(){ if(exportLoading.value) return; exportLoading.value=true; try{ await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('导出任务已创建') } finally{ exportLoading.value=false } }
</script>
