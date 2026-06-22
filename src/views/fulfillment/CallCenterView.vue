<template>
  <div class="call-center-page">
    <div class="filter-card call-filter">
      <el-form :model="query" label-width="96px">
        <div class="filter-grid">
          <el-form-item label="主叫电话">
            <el-input v-model="query.caller" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="被叫电话">
            <el-input v-model="query.callee" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="呼叫时间">
            <el-date-picker
              v-model="query.callTime"
              end-placeholder="请选择"
              range-separator="→"
              start-placeholder="请选择"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <div class="filter-actions">
            <el-button @click="resetQuery">重置</el-button>
            <el-button :loading="queryLoading" type="primary" @click="loadCalls">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>

    <YxCard class="call-table-card">
      <div class="page-actions">
        <el-button :icon="Phone" type="primary" @click="openCallDialog">拨打外呼电话</el-button>
      </div>

      <el-table v-loading="queryLoading" :data="rows" border class="call-table" empty-text="暂无数据">
        <el-table-column align="center" label="序号" width="64">
          <template #default="{ $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="110" prop="status" />
        <el-table-column align="center" label="呼叫时长" width="110" prop="duration" />
        <el-table-column align="center" label="主叫电话" min-width="130" prop="caller" />
        <el-table-column align="center" label="被叫电话" min-width="130" prop="callee" />
        <el-table-column align="center" label="呼叫回放" min-width="320" prop="playback" />
        <el-table-column align="center" label="呼叫费用" width="110" prop="cost" />
        <el-table-column align="center" label="呼叫人" width="110" prop="operator" />
        <el-table-column align="center" label="呼叫时间" min-width="180" prop="calledAt" />
      </el-table>
    </YxCard>

    <el-dialog v-model="callDialogVisible" title="拨打外呼电话" width="480px">
      <el-form ref="callFormRef" :model="callForm" :rules="callRules" label-width="96px">
        <el-form-item label="主叫电话" prop="caller">
          <el-input v-model="callForm.caller" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="被叫电话" prop="callee">
          <el-input v-model="callForm.callee" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="callDialogVisible = false">取消</el-button>
        <el-button :loading="callLoading" type="primary" @click="submitCall">确认拨打</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Phone } from '@element-plus/icons-vue'
import YxCard from '@/components/base/YxCard.vue'

type CallRecord = {
  status: string
  duration: string
  caller: string
  callee: string
  playback: string
  cost: string
  operator: string
  calledAt: string
}

type CallForm = {
  caller: string
  callee: string
}

const queryLoading = ref(false)
const callLoading = ref(false)
const callDialogVisible = ref(false)
const callFormRef = ref<FormInstance>()

const query = reactive({
  caller: '',
  callee: '',
  callTime: [],
})

const callForm = reactive<CallForm>({
  caller: '',
  callee: '',
})

const callRules = reactive<FormRules<CallForm>>({
  caller: [{ required: true, message: '请输入主叫电话', trigger: 'blur' }],
  callee: [{ required: true, message: '请输入被叫电话', trigger: 'blur' }],
})

const rows = ref<CallRecord[]>([])

function resetQuery() {
  query.caller = ''
  query.callee = ''
  query.callTime = []
}

function loadCalls() {
  queryLoading.value = true
  window.setTimeout(() => {
    queryLoading.value = false
    ElMessage.success('查询完成')
  }, 300)
}

function openCallDialog() {
  callDialogVisible.value = true
}

async function submitCall() {
  if (!(await callFormRef.value?.validate())) return
  callLoading.value = true
  window.setTimeout(() => {
    callLoading.value = false
    callDialogVisible.value = false
    ElMessage.success('外呼已发起')
  }, 300)
}
</script>

<style scoped>
.call-center-page {
  min-height: calc(100vh - 170px);
  color: var(--yx-text-primary);
}

.call-filter {
  padding: 16px 24px 0;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr auto;
  gap: 0 36px;
  align-items: start;
}

.filter-grid :deep(.el-form-item) {
  margin-right: 0;
}

.filter-grid :deep(.el-date-editor),
.filter-grid :deep(.el-input) {
  width: 100%;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-bottom: 18px;
}

.call-table-card {
  margin-top: 14px;
}

.page-actions {
  display: flex;
  margin-bottom: 16px;
}

.call-table {
  width: 100%;
}

.call-table :deep(.el-table__cell) {
  padding: 12px 0;
}

.call-table :deep(.el-table__empty-block) {
  min-height: 166px;
}

.call-table :deep(.el-table__empty-text) {
  color: var(--yx-text-secondary);
}

@media (max-width: 1280px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
