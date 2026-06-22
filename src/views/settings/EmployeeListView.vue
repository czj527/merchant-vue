<template>
  <div>
    <PageHeader title="员工管理" description="管理员工账号、角色和所属门店。">
      <template #extra><el-button type="primary" @click="dialogVisible = true">新增员工</el-button></template>
    </PageHeader>
    <YxCard>
      <el-form inline :model="query"><el-form-item label="关键词"><el-input v-model="query.keyword" placeholder="姓名/手机号" /></el-form-item><el-form-item><el-button type="primary" :loading="loading" @click="loadEmployees">查询</el-button></el-form-item></el-form>
      <el-table :data="employees" border>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column prop="dept" label="部门" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="140"><template #default><el-button text type="primary" @click="dialogVisible = true">编辑</el-button><el-button text type="danger">禁用</el-button></template></el-table-column>
      </el-table>
    </YxCard>
    <el-dialog v-model="dialogVisible" title="新增员工" width="620px"><el-form label-width="90px"><el-form-item label="姓名"><el-input /></el-form-item><el-form-item label="手机号"><el-input /></el-form-item><el-form-item label="员工类型"><el-select style="width:100%"><el-option label="管理员" value="admin" /><el-option label="运营" value="ops" /></el-select></el-form-item></el-form><template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="dialogVisible = false">保存</el-button></template></el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const dialogVisible = ref(false)
const loading = ref(false)
const query = reactive({ keyword: '' })
const employees = [{ name: '张三', phone: '138****0001', role: '管理员', dept: '总部', status: '启用' }, { name: '李四', phone: '139****0002', role: '运营', dept: '门店', status: '启用' }]
async function loadEmployees() { loading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 350)) } finally { loading.value = false } }
</script>
