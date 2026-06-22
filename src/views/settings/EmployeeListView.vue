<template>
  <div class="employee-page">
    <div class="filter-card employee-filter">
      <el-form :model="query" label-width="92px">
        <div class="filter-grid">
          <el-form-item label="用户名"><el-input v-model="query.userName" clearable placeholder="请输入" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="query.phone" clearable placeholder="请输入" /></el-form-item>
          <el-form-item label="账号类型"><el-select v-model="query.type" clearable placeholder="请选择"><el-option v-for="type in accountTypes" :key="type" :label="type" :value="type" /></el-select></el-form-item>
          <div class="filter-actions"><el-button @click="reset">重置</el-button><el-button :loading="loading" type="primary" @click="loadEmployees">查询</el-button></div>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="page-actions"><el-button :icon="Plus" type="primary" @click="dialogVisible = true">新增员工</el-button></div>
      <el-table :data="employees" border class="employee-table">
        <el-table-column label="用户ID" min-width="230"><template #default="{ row }">{{ row.id }} <el-icon class="copy-icon"><CopyDocument /></el-icon></template></el-table-column>
        <el-table-column label="用户名" min-width="180" prop="name" />
        <el-table-column label="手机号" min-width="160" prop="phone" />
        <el-table-column label="账号类型" min-width="160" prop="type" />
        <el-table-column label="状态" width="120"><template #default><el-tag type="success" effect="light">启用</el-tag></template></el-table-column>
        <el-table-column label="创建时间" min-width="180" prop="createdAt" sortable />
        <el-table-column label="备注" min-width="150" prop="remark" />
        <el-table-column fixed="right" label="操作" width="150"><template #default><el-button link type="primary">修改</el-button><el-button link type="danger">禁用</el-button></template></el-table-column>
      </el-table>
      <div class="pagination-text">第 1-2 条/总共 2 条 <el-pagination layout="prev, pager, next" :total="2" :page-size="10" /></div>
    </YxCard>

    <el-dialog v-model="dialogVisible" title="新建员工账号" width="600px">
      <el-form :model="form" :rules="rules" label-position="top">
        <el-form-item label="员工类型" prop="type"><el-select v-model="form.type" placeholder="请选择"><el-option v-for="type in accountTypes" :key="type" :label="type" :value="type" /></el-select></el-form-item>
        <el-form-item label="用户名" prop="userName"><el-input v-model="form.userName" placeholder="请输入" /></el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="form.password" show-password placeholder="请输入" /></el-form-item>
        <el-form-item label="外呼手机号"><el-select v-model="form.callPhone" clearable placeholder="请选择"><el-option label="15257167060" value="15257167060" /></el-select></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="dialogVisible = false">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { CopyDocument, Plus } from '@element-plus/icons-vue'
import YxCard from '@/components/base/YxCard.vue'

type EmployeeForm = { type: string; userName: string; password: string; callPhone: string; remark: string }
const loading = ref(false)
const dialogVisible = ref(false)
const accountTypes = ['租户管理员', '商户员工', '工厂员工', '门店员工']
const query = reactive({ userName: '', phone: '', type: '' })
const form = reactive<EmployeeForm>({ type: '', userName: '', password: '', callPhone: '', remark: '' })
const rules = reactive<FormRules<EmployeeForm>>({ type: [{ required: true, message: '请选择员工类型', trigger: 'change' }], userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }], password: [{ required: true, message: '请输入密码', trigger: 'blur' }] })
const employees = [{ id: 'cmkp2mbew2em3prf41tm81qdu', name: '比在河北123', phone: '-', type: '商户员工', createdAt: '2026-01-22 14:28:31', remark: '-' }, { id: 'cmkqgr33e26fe1q8fhxnuvhqi', name: '盛峰雅洁清洗服务', phone: '-', type: '租户管理员', createdAt: '2026-01-16 18:34:09', remark: '-' }]
function reset() { query.userName = ''; query.phone = ''; query.type = '' }
function loadEmployees() { loading.value = true; window.setTimeout(() => { loading.value = false }, 300) }
</script>

<style scoped>
.employee-filter{padding:16px 24px 4px}.filter-grid{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:0 34px}.filter-grid :deep(.el-form-item){margin-right:0}.filter-grid :deep(.el-select){width:100%}.filter-actions{display:flex;gap:10px;padding-bottom:18px}.page-actions{display:flex;justify-content:flex-end;margin-bottom:16px}.employee-table :deep(.el-table__cell){padding:13px 0}.copy-icon{color:var(--yx-primary)}.pagination-text{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:14px}
</style>
