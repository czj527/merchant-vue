<template>
  <div>
    <PageHeader title="商户管理" description="管理租户下商户、授权状态、物流要求和工厂绑定关系。">
      <template #extra><el-button type="primary" @click="openMerchantDialog()">+ 新建商户</el-button></template>
    </PageHeader>

    <div class="filter-card merchant-filter">
      <el-form :model="query" label-width="78px">
        <el-row :gutter="28">
          <el-col :span="8"><el-form-item label="租户名"><el-select v-model="query.tenant" clearable placeholder="请选择"><el-option label="D0138-深圳净贝贝网络科技有限公司" value="D0138" /><el-option label="D0174-北京盛峰雅洁清洗服务有限公司" value="D0174" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="品牌名"><el-select v-model="query.brand" clearable placeholder="请选择"><el-option label="京果洗护" value="京果洗护" /><el-option label="净贝贝" value="净贝贝" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="商户名"><el-input v-model="query.keyword" clearable placeholder="请输入" /></el-form-item></el-col>
        </el-row>
        <div class="filter-actions">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" :loading="loading" @click="loadMerchants">查询</el-button>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="table-actions"><el-button type="primary" @click="openMerchantDialog()">+ 新建商户</el-button></div>
      <el-table :data="merchantRows" border v-loading="loading">
        <el-table-column type="index" label="排序" width="60" />
        <el-table-column prop="code" label="商户ID" width="150" />
        <el-table-column prop="tenant" label="租户名" min-width="180" />
        <el-table-column prop="brand" label="品牌名" width="120" />
        <el-table-column prop="name" label="商户名" width="160" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="authorize" label="授权状态" width="100" />
        <el-table-column prop="needLogistics" label="需要物流" width="100" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><StatusTag :label="row.status === 'enabled' ? '启用' : '禁用'" :type="row.status === 'enabled' ? 'success' : 'info'" /></template></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
        <el-table-column prop="updatedAt" label="更新时间" width="160" sortable />
        <el-table-column prop="remark" label="备注" min-width="120" />
        <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button text type="primary" @click="openMerchantDialog(row)">修改</el-button><el-button text type="primary" @click="openBindFactory(row)">绑定工厂</el-button><el-button text type="danger">删除</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="merchantDialogVisible" :title="merchantDialogMode === 'create' ? '新建商户' : '修改商户'" width="760px" top="5vh" class="merchant-dialog">
      <el-form ref="merchantFormRef" :model="merchantForm" :rules="merchantRules" label-position="top" :disabled="merchantSubmitting">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="租户" prop="tenant" required><el-select v-model="merchantForm.tenant" placeholder="请选择"><el-option label="D0138-深圳净贝贝网络科技有限公司" value="D0138" /><el-option label="D0174-北京盛峰雅洁清洗服务有限公司" value="D0174" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="品牌" prop="brand" required><el-select v-model="merchantForm.brand" placeholder="请选择"><el-option label="京果洗护" value="京果洗护" /><el-option label="净贝贝" value="净贝贝" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="类型" prop="type" required><el-select v-model="merchantForm.type" placeholder="请选择"><el-option label="抖音(国家)" value="抖音(国家)" /><el-option label="抖音核销小程序" value="抖音核销小程序" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="应用" prop="app" required><el-select v-model="merchantForm.app" placeholder="请选择"><el-option label="京果洗护-DY-LK" value="京果洗护-DY-LK" /><el-option label="京果洗护-小程序" value="京果洗护-小程序" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="商户名" prop="name" required><el-input v-model="merchantForm.name" placeholder="品牌名-地区" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="服务省市" prop="serviceArea" required><el-select v-model="merchantForm.serviceArea" multiple style="width:100%"><el-option label="甘肃省" value="甘肃省" /><el-option label="河南省" value="河南省" /><el-option label="安徽省" value="安徽省" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="物流配送" prop="needLogistics" required><el-select v-model="merchantForm.needLogistics" placeholder="请选择"><el-option label="需要" value="需要" /><el-option label="不需要" value="不需要" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="备注"><el-input v-model="merchantForm.remark" type="textarea" :rows="4" placeholder="请输入" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="merchantDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="merchantSubmitting" @click="submitMerchant">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="bindFactoryVisible" title="绑定工厂" width="1520px" top="4vh" class="bind-factory-dialog">
      <div class="bind-warning">绑定工厂前需确认衣物全部出厂，删除绑定关系会导致衣物无法出厂。如需停止派单，设置比例为0即可。</div>
      <div class="bind-head"><span class="bind-label">派单模式：</span><el-select v-model="bindForm.mode" style="width:120px"><el-option label="比例" value="比例" /><el-option label="权重" value="权重" /></el-select></div>
      <el-table :data="bindRows" border height="210">
        <el-table-column label="排序" width="60"><template #default="{ $index }"><span class="sort-badge">{{ $index + 1 }}</span></template></el-table-column>
        <el-table-column label="商户" width="240"><template #default><el-select v-model="bindForm.merchant" style="width:100%"><el-option label="京果---甘肃" value="京果---甘肃" /><el-option label="京果---陕西" value="京果---陕西" /></el-select></template></el-table-column>
        <el-table-column label="工厂" min-width="280"><template #default><el-select v-model="bindForm.factory" filterable placeholder="可输入工厂名称、电话、地址模糊搜索" style="width:100%"><el-option label="可输入工厂名称、电话、地址模糊搜索" value="search" /></el-select></template></el-table-column>
        <el-table-column label="工厂类型" width="140"><template #default><el-select v-model="bindForm.factoryType" style="width:100%"><el-option label="请选择" value="" /><el-option label="抖音核销小程序" value="抖音核销小程序" /></el-select></template></el-table-column>
        <el-table-column label="比例(%)" width="110"><template #default><el-input v-model="bindForm.rate" /></template></el-table-column>
        <el-table-column label="取件快递" width="120"><template #default><el-select v-model="bindForm.express" style="width:100%"><el-option label="京东" value="京东" /><el-option label="顺丰" value="顺丰" /></el-select></template></el-table-column>
        <el-table-column label="取件快递编码" min-width="160"><template #default><el-select v-model="bindForm.expressCode" style="width:100%"><el-option label="请输入取件快递编码" value="" /></el-select></template></el-table-column>
        <el-table-column label="取件快递折扣(%)" width="150"><template #default><span>60</span></template></el-table-column>
        <el-table-column label="操作" width="120"><template #default><el-button text type="danger">删除</el-button></template></el-table-column>
      </el-table>
      <div class="bind-add">+添加一行数据</div>
      <template #footer>
        <el-button @click="bindFactoryVisible = false">取消</el-button>
        <el-button type="primary" @click="bindFactoryVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { merchants as merchantRowsSource } from '@/mock/modules/module-data'

type MerchantRow = {
  code: string
  tenant: string
  brand: string
  name: string
  type: string
  authorize: string
  needLogistics: string
  status: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
  remark: string
}

const loading = ref(false)
const merchantDialogVisible = ref(false)
const bindFactoryVisible = ref(false)
const merchantSubmitting = ref(false)
const merchantDialogMode = ref<'create' | 'edit'>('create')
const merchantFormRef = ref<FormInstance>()
const query = reactive({ tenant: 'D0138', brand: '', keyword: '' })
const merchantRows = ref<MerchantRow[]>([])
const currentRow = ref<MerchantRow | null>(null)
const merchantForm = reactive({ tenant: '', brand: '', type: '', app: '', name: '', serviceArea: [] as string[], needLogistics: '需要', remark: '' })
const bindForm = reactive({ mode: '比例', merchant: '京果---甘肃', factory: '', factoryType: '', rate: '100', express: '京东', expressCode: '' })
const merchantRules: FormRules = { tenant: [{ required: true, message: '请选择租户', trigger: 'change' }], brand: [{ required: true, message: '请选择品牌', trigger: 'change' }], type: [{ required: true, message: '请选择类型', trigger: 'change' }], app: [{ required: true, message: '请选择应用', trigger: 'change' }], name: [{ required: true, message: '请输入商户名', trigger: 'blur' }], serviceArea: [{ required: true, message: '请选择服务省市', trigger: 'change' }], needLogistics: [{ required: true, message: '请选择物流配送', trigger: 'change' }] }
const bindRows = computed(() => currentRow.value ? [currentRow.value] : [])

function normalizeRow(row: any): MerchantRow {
  return { code: row.code, tenant: row.code.startsWith('D0138') ? 'D0138-深圳净贝贝网络科技有限公司' : 'D0174-北京盛峰雅洁清洗服务有限公司', brand: row.brand, name: row.name, type: row.type ?? '抖音核销小程序', authorize: row.authorize ?? '-', needLogistics: row.needLogistics ?? '是', status: row.status, createdAt: row.createdAt, updatedAt: row.updatedAt, remark: row.remark ?? '-' }
}

async function loadMerchants() {
  loading.value = true
  try {
    const keyword = query.keyword.trim()
    merchantRows.value = merchantRowsSource.map(normalizeRow).filter((row) => (!query.tenant || row.tenant.includes(query.tenant)) && (!query.brand || row.brand === query.brand) && (!keyword || [row.code, row.name, row.tenant].some((item) => item.includes(keyword))))
  } finally {
    loading.value = false
  }
}
function resetQuery() { Object.assign(query, { tenant: 'D0138', brand: '', keyword: '' }); void loadMerchants() }
function openMerchantDialog(row: MerchantRow | null = null) { merchantDialogMode.value = row ? 'edit' : 'create'; currentRow.value = row; Object.assign(merchantForm, { tenant: row?.tenant ?? 'D0174', brand: row?.brand ?? '', type: row?.type ?? '', app: row ? '京果洗护-DY-LK' : '', name: row?.name ?? '', serviceArea: row ? ['甘肃省'] : [], needLogistics: row?.needLogistics ?? '需要', remark: row?.remark ?? '' }); merchantDialogVisible.value = true }
function openBindFactory(row: MerchantRow) { currentRow.value = row; bindFactoryVisible.value = true }
async function submitMerchant() { if (merchantSubmitting.value) return; await merchantFormRef.value?.validate(); merchantSubmitting.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success(merchantDialogMode.value === 'create' ? '商户新增成功' : '商户修改成功'); merchantDialogVisible.value = false; void loadMerchants() } finally { merchantSubmitting.value = false } }
onMounted(loadMerchants)
</script>

<style scoped>
.merchant-filter { margin-bottom: 14px; }
.filter-actions { display: flex; justify-content: flex-end; gap: 8px; }
.table-actions { display: flex; justify-content: flex-end; margin-bottom: 14px; }
.bind-warning { margin-bottom: 14px; color: var(--yx-danger); font-weight: 600; }
.bind-head { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 10px; }
.bind-label { font-weight: 600; }
.sort-badge { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 50%; background: #34475d; color: #fff; }
.bind-add { margin-top: 10px; text-align: center; padding: 10px 0; border: 1px dashed var(--yx-border); border-radius: var(--yx-radius-md); color: var(--yx-text-regular); }
:deep(.merchant-dialog .el-dialog__body), :deep(.bind-factory-dialog .el-dialog__body) { padding-top: 10px; }
</style>
