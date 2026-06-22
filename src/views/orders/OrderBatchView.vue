<template>
  <div>
    <PageHeader title="批量寄洗" description="支持单独寄洗与批量寄洗，可快速生成批次并下发到物流流程。">
      <template #extra>
        <el-button @click="activeMode='single'">单独寄洗</el-button>
        <el-button type="primary" @click="activeMode='batch'">批量寄洗</el-button>
      </template>
    </PageHeader>

    <div class="metric-grid">
      <MetricCard label="待寄洗" value="24" hint="可直接创建批次" />
      <MetricCard label="已选订单" value="6" hint="支持多选合并" />
      <MetricCard label="已生成快递" value="3" hint="Mock 流程" />
      <MetricCard label="待确认" value="2" hint="需要用户确认" />
      <MetricCard label="已下发" value="18" hint="进入物流中心" />
      <MetricCard label="失败条目" value="1" hint="可导出明细" />
    </div>

    <YxCard>
      <div class="mode-tabs">
        <button :class="['mode-tab', { active: activeMode === 'single' }]" @click="activeMode='single'">单独寄洗</button>
        <button :class="['mode-tab', { active: activeMode === 'batch' }]" @click="activeMode='batch'">批量寄洗</button>
      </div>

      <el-alert v-if="activeMode === 'single'" title="门店单独寄洗，一个订单下发一个快递。" type="info" show-icon :closable="false" />
      <el-alert v-else title="批量寄洗支持勾选多个订单统一处理。" type="warning" show-icon :closable="false" />

      <el-form :model="form" label-width="110px" class="batch-form">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="上门时间"><el-date-picker v-model="form.pickupTime" type="datetime" style="width:100%" placeholder="请选择上门时间" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="快递公司"><el-select v-model="form.company" style="width:100%" placeholder="请选择"><el-option label="顺丰速运" value="顺丰速运" /><el-option label="京东物流" value="京东物流" /><el-option label="申通快递" value="申通快递" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="取寄类型"><el-radio-group v-model="form.type"><el-radio value="上门取件">上门取件</el-radio><el-radio value="商户寄件">商户寄件</el-radio></el-radio-group></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="商品类型"><el-select v-model="form.productType" style="width:100%" placeholder="请选择"><el-option label="衣物" value="衣物" /><el-option label="鞋靴" value="鞋靴" /><el-option label="家纺" value="家纺" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="收件备注"><el-input v-model="form.remark" placeholder="请输入寄洗备注" /></el-form-item></el-col>
        </el-row>
      </el-form>

      <el-table :data="orders" border>
        <el-table-column type="selection" width="48" />
        <el-table-column prop="orderNo" label="订单号" min-width="160" />
        <el-table-column prop="member" label="会员" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="address" label="取件地址" min-width="220" />
        <el-table-column prop="status" label="状态" width="100" />
      </el-table>

      <div class="actions">
        <el-button :loading="previewLoading" @click="handlePreview">预览快递单</el-button>
        <el-button :loading="saveLoading" type="primary" @click="handleCreate">确认寄洗</el-button>
      </div>
    </YxCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import YxCard from '@/components/base/YxCard.vue'

const activeMode = ref<'single' | 'batch'>('single')
const previewLoading = ref(false)
const saveLoading = ref(false)
const form = reactive({ pickupTime: '', company: '顺丰速运', type: '上门取件', productType: '衣物', remark: '' })
const orders = [
  { orderNo: 'YX202606220001', member: '王小明', phone: '138****0001', address: '浙江省杭州市拱墅区', status: '待寄洗' },
  { orderNo: 'YX202606220002', member: '李小红', phone: '139****0002', address: '浙江省杭州市西湖区', status: '待寄洗' },
  { orderNo: 'YX202606220003', member: '张三', phone: '137****0003', address: '浙江省宁波市海曙区', status: '待寄洗' },
]
async function runAction(loading: { value: boolean }, message: string) { if (loading.value) return; loading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success(message) } finally { loading.value = false } }
function handlePreview() { void runAction(previewLoading, '快递单预览已生成') }
function handleCreate() { void runAction(saveLoading, activeMode.value === 'single' ? '单独寄洗已创建' : '批量寄洗已创建') }
</script>

<style scoped>
.mode-tabs { display: flex; gap: 10px; margin-bottom: 14px; }
.mode-tab { border: 1px solid var(--yx-border); background: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
.mode-tab.active { color: var(--yx-primary); border-color: var(--yx-primary); background: var(--yx-primary-light); }
.batch-form { margin: 18px 0; }
.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
</style>
