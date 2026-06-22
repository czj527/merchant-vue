<template>
  <div>
    <PageHeader title="商户管理" description="管理租户下商户、品牌、类型、状态和绑定工厂关系。">
      <template #extra><el-button type="primary" @click="router.push('/customers/merchants/create')">新增商户</el-button></template>
    </PageHeader>
    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="关键词"><el-input v-model="query.keyword" placeholder="商户名/联系人/手机号" /></el-form-item>
        <el-form-item label="品牌"><el-select v-model="query.brand" clearable placeholder="请选择"><el-option label="优洗生活" value="优洗生活" /><el-option label="此在" value="此在" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select v-model="query.status" clearable placeholder="请选择"><el-option label="启用" value="enabled" /><el-option label="禁用" value="disabled" /></el-select></el-form-item>
        <el-form-item><el-button @click="resetQuery">重置</el-button><el-button type="primary" :loading="loading" @click="loadMerchants">查询</el-button></el-form-item>
      </el-form>
      <el-table :data="merchants" border v-loading="loading">
        <el-table-column prop="code" label="商户ID" width="130" />
        <el-table-column prop="name" label="商户名称" min-width="180" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="city" label="地区" width="120" />
        <el-table-column label="状态" width="100"><template #default="{ row }"><StatusTag :label="row.status === 'enabled' ? '启用' : '禁用'" :type="row.status === 'enabled' ? 'success' : 'info'" /></template></el-table-column>
        <el-table-column label="操作" width="160"><template #default><el-button text type="primary" @click="detailVisible = true">详情</el-button><el-button text type="primary" @click="router.push('/customers/merchants/create')">修改</el-button></template></el-table-column>
      </el-table>
    </YxCard>
    <el-dialog v-model="detailVisible" title="商户详情" width="600px"><el-descriptions :column="2" border><el-descriptions-item label="商户名">麻雀奢活清洗服务</el-descriptions-item><el-descriptions-item label="品牌">优洗生活</el-descriptions-item><el-descriptions-item label="联系人">王五</el-descriptions-item><el-descriptions-item label="状态">启用</el-descriptions-item></el-descriptions><template #footer><el-button type="primary" @click="detailVisible = false">知道了</el-button></template></el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { merchants as merchantRows } from '@/mock/modules/module-data'
const router = useRouter(); const loading = ref(false); const detailVisible = ref(false); const merchants = ref<any[]>([]); const query = reactive({ keyword: '', brand: '', status: '' })
async function loadMerchants(){ loading.value=true; try{ const keyword = query.keyword.trim(); merchants.value = merchantRows.filter((row) => (!keyword || [row.code, row.name, row.contact, row.phone].some((item) => String(item).includes(keyword))) && (!query.brand || row.brand === query.brand) && (!query.status || row.status === query.status)) } finally{ loading.value=false } }
function resetQuery(){ query.keyword=''; query.brand=''; query.status=''; void loadMerchants() }
onMounted(loadMerchants)
</script>
