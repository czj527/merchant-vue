<template>
  <div>
    <PageHeader title="会员列表" description="维护消费者会员资料，支持搜索、编辑、详情和启停。">
      <template #extra><el-button type="primary" @click="router.push('/members/create')">新增会员</el-button></template>
    </PageHeader>
    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="关键词"><el-input v-model="query.keyword" placeholder="姓名/手机号/会员编号" /></el-form-item>
        <el-form-item label="会员等级"><el-select v-model="query.level" clearable placeholder="请选择"><el-option label="黄金" value="gold" /><el-option label="白银" value="silver" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select v-model="query.status" clearable placeholder="请选择"><el-option label="启用" value="enabled" /><el-option label="停用" value="disabled" /></el-select></el-form-item>
        <el-form-item><el-button @click="resetQuery">重置</el-button><el-button type="primary" :loading="loading" @click="loadMembers">查询</el-button></el-form-item>
      </el-form>
      <el-table :data="members" border v-loading="loading">
        <el-table-column prop="memberNo" label="会员编号" width="140" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="level" label="等级" width="90" />
        <el-table-column prop="remark" label="备注" min-width="160" />
        <el-table-column prop="createdAt" label="注册时间" width="140" />
        <el-table-column label="状态" width="100"><template #default="{ row }"><StatusTag :label="row.status === 'enabled' ? '启用' : '停用'" :type="row.status === 'enabled' ? 'success' : 'info'" /></template></el-table-column>
        <el-table-column label="操作" width="180"><template #default><el-button text type="primary" @click="detailVisible = true">详情</el-button><el-button text type="primary" @click="router.push('/members/create')">编辑</el-button><el-button text type="danger">禁用</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="detailVisible" title="会员详情" width="560px"><el-descriptions :column="2" border><el-descriptions-item label="姓名">王小明</el-descriptions-item><el-descriptions-item label="手机号">138****0001</el-descriptions-item><el-descriptions-item label="等级">黄金</el-descriptions-item><el-descriptions-item label="状态">启用</el-descriptions-item></el-descriptions><template #footer><el-button type="primary" @click="detailVisible = false">知道了</el-button></template></el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { getMembers } from '@/services'
import type { Member } from '@/types/member'
const router = useRouter(); const loading = ref(false); const detailVisible = ref(false); const members = ref<Member[]>([]); const query = reactive({ keyword: '', level: '', status: '' })
async function loadMembers(){ loading.value=true; try{ members.value=(await getMembers({ keyword: query.keyword, page:1, pageSize:20 })).list } finally{ loading.value=false } }
function resetQuery(){ query.keyword=''; query.level=''; query.status=''; void loadMembers() }
onMounted(loadMembers)
</script>
