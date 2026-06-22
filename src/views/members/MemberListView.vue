<template>
  <div>
    <PageHeader title="会员管理" description="查询会员资料、维护账号状态，并支持在列表页弹窗新增用户。" />

    <div class="filter-card member-filter">
      <el-form :model="query" label-width="78px">
        <el-row :gutter="28">
          <el-col :span="6"><el-form-item label="所属品牌"><el-select v-model="query.brand" clearable placeholder="请选择"><el-option label="此在" value="此在" /><el-option label="优洗生活" value="优洗生活" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="用户来源"><el-select v-model="query.source" clearable placeholder="请选择"><el-option label="抖音上门" value="抖音上门" /><el-option label="小程序" value="小程序" /><el-option label="门店录入" value="门店录入" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="用户名"><el-input v-model="query.userName" clearable placeholder="请输入" /></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="手机号"><el-input v-model="query.phone" clearable placeholder="请输入" /></el-form-item></el-col>
        </el-row>
        <div class="filter-actions">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" :loading="loading" @click="loadMembers">查询</el-button>
          <el-button text type="primary" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</el-button>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="table-actions">
        <el-button type="primary" @click="openCreate">+ 新建用户</el-button>
      </div>
      <el-table :data="members" border v-loading="loading">
        <el-table-column prop="memberNo" label="用户ID" min-width="170"><template #default="{ row }"><span class="ellipsis-id">{{ row.memberNo }}</span><span class="copy-mark">▣</span></template></el-table-column>
        <el-table-column prop="brand" label="所属品牌" width="130" />
        <el-table-column prop="source" label="用户来源" width="130" />
        <el-table-column prop="name" label="用户名" width="130" />
        <el-table-column prop="phone" label="手机号" width="150"><template #default="{ row }">{{ row.phone }} <span class="copy-mark">▣</span></template></el-table-column>
        <el-table-column prop="balance" label="账户余额" width="130"><template #default="{ row }">¥{{ row.balance }}</template></el-table-column>
        <el-table-column label="状态" width="120"><template #default="{ row }"><StatusTag :label="row.status === 'enabled' ? '启用' : '停用'" :type="row.status === 'enabled' ? 'success' : 'info'" /></template></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" sortable />
        <el-table-column prop="remark" label="备注" min-width="140" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openRecharge(row)">充值</el-button>
            <el-button text type="primary" @click="openRecord(row)">记录</el-button>
            <el-button text type="primary" @click="openEdit(row)">修改</el-button>
            <el-button text disabled>推广</el-button>
          </template>
        </el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="userDialogVisible" :title="editingMember ? '修改用户' : '新建用户'" width="640px" class="member-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" :disabled="submitLoading">
        <el-row :gutter="12">
          <el-col :span="12"><el-form-item label="品牌" prop="brand" required><el-select v-model="form.brand" placeholder="请选择"><el-option label="此在" value="此在" /><el-option label="优洗生活" value="优洗生活" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="店铺" prop="store" required><el-select v-model="form.store" placeholder="请选择"><el-option label="此在-河北工厂" value="此在-河北工厂" /><el-option label="此在-辽宁" value="此在-辽宁" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="用户名"><el-input v-model="form.name" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号" prop="phone" required><el-input v-model="form.phone" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="性别"><el-radio-group v-model="form.gender"><el-radio value="男">男</el-radio><el-radio value="女">女</el-radio></el-radio-group></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="生日"><el-date-picker v-model="form.birthday" type="date" placeholder="请选择" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitUser">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rechargeVisible" title="充值" width="460px"><el-form label-width="90px"><el-form-item label="用户">{{ currentMember?.name }}</el-form-item><el-form-item label="金额"><el-input placeholder="请输入充值金额" /></el-form-item></el-form><template #footer><el-button @click="rechargeVisible = false">取消</el-button><el-button type="primary" @click="rechargeVisible = false">确定</el-button></template></el-dialog>
    <el-dialog v-model="recordVisible" title="账户记录" width="620px"><el-table :data="recordRows" border><el-table-column prop="time" label="时间" /><el-table-column prop="type" label="类型" /><el-table-column prop="amount" label="金额" /></el-table></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { getMembers } from '@/services'
import type { Member } from '@/types/member'

type MemberRow = Member & { brand: string; source: string; balance: string; remark: string }

const loading = ref(false)
const expanded = ref(true)
const submitLoading = ref(false)
const userDialogVisible = ref(false)
const rechargeVisible = ref(false)
const recordVisible = ref(false)
const editingMember = ref<MemberRow | null>(null)
const currentMember = ref<MemberRow | null>(null)
const formRef = ref<FormInstance>()
const query = reactive({ brand: '此在', source: '', userName: '', phone: '' })
const members = ref<MemberRow[]>([])
const form = reactive({ brand: '', store: '', name: '', phone: '', gender: '', birthday: '', remark: '' })
const rules: FormRules = { brand: [{ required: true, message: '请选择品牌', trigger: 'change' }], store: [{ required: true, message: '请选择店铺', trigger: 'change' }], phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }] }
const recordRows = [{ time: '2026-03-10 18:14:55', type: '充值', amount: '+¥100.00' }, { time: '2026-03-09 14:36:39', type: '消费', amount: '-¥59.90' }]

async function loadMembers() {
  loading.value = true
  try {
    const sourceRows = (await getMembers({ keyword: query.userName || query.phone, page: 1, pageSize: 20 })).list
    members.value = sourceRows.map((item, index) => ({ ...item, brand: '此在', source: '抖音上门', balance: '0.00', remark: index % 8 === 0 ? '月度洗可以吗' : '-' }))
      .filter((item) => (!query.brand || item.brand === query.brand) && (!query.source || item.source === query.source) && (!query.userName || item.name.includes(query.userName)) && (!query.phone || item.phone.includes(query.phone)))
  } finally {
    loading.value = false
  }
}
function resetQuery() { Object.assign(query, { brand: '此在', source: '', userName: '', phone: '' }); void loadMembers() }
function openCreate() { editingMember.value = null; Object.assign(form, { brand: '', store: '', name: '', phone: '', gender: '', birthday: '', remark: '' }); userDialogVisible.value = true }
function openEdit(row: MemberRow) { editingMember.value = row; Object.assign(form, { brand: row.brand, store: '此在-河北工厂', name: row.name, phone: row.phone, gender: '', birthday: '', remark: row.remark === '-' ? '' : row.remark }); userDialogVisible.value = true }
function openRecharge(row: MemberRow) { currentMember.value = row; rechargeVisible.value = true }
function openRecord(row: MemberRow) { currentMember.value = row; recordVisible.value = true }
async function submitUser() { if (submitLoading.value) return; await formRef.value?.validate(); submitLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success(editingMember.value ? '用户修改成功' : '用户新增成功'); userDialogVisible.value = false; void loadMembers() } finally { submitLoading.value = false } }
onMounted(loadMembers)
</script>

<style scoped>
.member-filter { margin-bottom: 16px; }
.filter-actions { display: flex; justify-content: flex-end; gap: 8px; }
.table-actions { display: flex; justify-content: flex-end; margin-bottom: 14px; }
.ellipsis-id { display: inline-block; max-width: 132px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
.copy-mark { margin-left: 4px; color: var(--yx-primary); font-size: 12px; }
:deep(.member-dialog .el-dialog__body) { padding-top: 4px; }
</style>
