<template>
  <div>
    <PageHeader title="外呼中心" description="管理外呼任务、结果记录和批量处理。">
      <template #extra>
        <el-button @click="taskDialogVisible = true">新建外呼</el-button>
        <el-button type="primary" @click="recordDialogVisible = true">记录结果</el-button>
      </template>
    </PageHeader>

    <div class="metric-grid">
      <MetricCard label="待外呼" value="18" hint="今日待处理" />
      <MetricCard label="已接通" value="42" hint="接通率 78%" />
      <MetricCard label="未接通" value="12" hint="待重拨" />
      <MetricCard label="异常关闭" value="3" hint="需复核" />
    </div>

    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="任务编号"><el-input v-model="query.taskNo" placeholder="请输入" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="query.phone" placeholder="请输入" /></el-form-item>
        <el-form-item label="场景"><el-select v-model="query.scene" placeholder="请选择" clearable><el-option label="取件确认" value="取件确认" /><el-option label="售后回访" value="售后回访" /></el-select></el-form-item>
      </el-form>
      <el-table :data="rows" border>
        <el-table-column prop="taskNo" label="任务编号" min-width="140" />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="scene" label="外呼场景" width="130" />
        <el-table-column prop="result" label="结果" width="110" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="140"><template #default><el-button text type="primary" @click="recordDialogVisible = true">记录结果</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="taskDialogVisible" title="新建外呼" width="560px">
      <el-form label-width="90px">
        <el-form-item label="客户"><el-input placeholder="请输入客户名称" /></el-form-item>
        <el-form-item label="外呼场景"><el-select style="width:100%"><el-option label="取件确认" value="取件确认" /><el-option label="售后回访" value="售后回访" /></el-select></el-form-item>
        <el-form-item label="任务备注"><el-input type="textarea" :rows="4" placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="taskDialogVisible = false">取消</el-button><el-button type="primary" @click="taskDialogVisible = false">确定</el-button></template>
    </el-dialog>

    <el-dialog v-model="recordDialogVisible" title="记录结果" width="520px">
      <el-form label-width="90px">
        <el-form-item label="结果"><el-radio-group><el-radio value="已接通">已接通</el-radio><el-radio value="未接通">未接通</el-radio><el-radio value="待重拨">待重拨</el-radio></el-radio-group></el-form-item>
        <el-form-item label="备注"><el-input type="textarea" :rows="4" placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="recordDialogVisible = false">取消</el-button><el-button type="primary" @click="recordDialogVisible = false">保存</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageHeader from '@/components/business/PageHeader.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import YxCard from '@/components/base/YxCard.vue'
const taskDialogVisible = ref(false)
const recordDialogVisible = ref(false)
const query = reactive({ taskNo: '', phone: '', scene: '' })
const rows = [
  { taskNo: 'C20260622001', customer: '王小明', phone: '138****0001', scene: '取件确认', result: '已接通', status: '进行中' },
  { taskNo: 'C20260622002', customer: '李小红', phone: '139****0002', scene: '售后回访', result: '未接通', status: '待重拨' },
]
</script>
