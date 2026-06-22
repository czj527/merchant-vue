<template>
  <div>
    <PageHeader title="代工价配置" description="维护不同工厂、类目和生效时间的代工价格规则。">
      <template #extra>
        <el-button @click="dialogVisible = true">新增规则</el-button>
        <el-button type="primary" :loading="exportLoading" @click="handleExport">导出列表</el-button>
      </template>
    </PageHeader>

    <div class="metric-grid">
      <MetricCard label="启用规则" value="18" hint="当前生效" />
      <MetricCard label="待生效" value="4" hint="未来规则" />
      <MetricCard label="已停用" value="2" hint="历史规则" />
      <MetricCard label="平均单价" value="¥12.6" hint="Mock 统计" />
    </div>

    <YxCard>
      <el-table :data="rows" border>
        <el-table-column prop="name" label="规则名称" min-width="180" />
        <el-table-column prop="factory" label="工厂" min-width="150" />
        <el-table-column prop="category" label="类目" width="120" />
        <el-table-column prop="price" label="代工价" width="110" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="effectiveAt" label="生效时间" width="140" />
        <el-table-column label="操作" width="150"><template #default><el-button text type="primary" @click="dialogVisible = true">编辑</el-button><el-button text type="danger">停用</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="dialogVisible" title="代工价规则" width="560px">
      <el-form label-width="90px">
        <el-form-item label="规则名称"><el-input placeholder="请输入" /></el-form-item>
        <el-form-item label="工厂"><el-select style="width:100%" placeholder="请选择"><el-option label="浙江(台州)洗衣工厂" value="浙江(台州)洗衣工厂" /><el-option label="浙江(宁波)洗衣工厂" value="浙江(宁波)洗衣工厂" /></el-select></el-form-item>
        <el-form-item label="类目"><el-select style="width:100%" placeholder="请选择"><el-option label="鞋靴" value="鞋靴" /><el-option label="服装" value="服装" /></el-select></el-form-item>
        <el-form-item label="代工价"><el-input placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="dialogVisible = false">保存</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import YxCard from '@/components/base/YxCard.vue'
const dialogVisible = ref(false)
const exportLoading = ref(false)
const rows = [
  { name: '鞋类基础价', factory: '浙江(台州)洗衣工厂', category: '鞋靴', price: '¥12.00', status: '启用', effectiveAt: '2026-01-01' },
  { name: '羽绒服加价', factory: '浙江(宁波)洗衣工厂', category: '服装', price: '¥18.00', status: '启用', effectiveAt: '2026-03-01' },
]
async function handleExport(){ if(exportLoading.value) return; exportLoading.value=true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('列表导出已创建') } finally { exportLoading.value=false } }
</script>
