<template>
  <div class="data-query-page">
    <div class="filter-card query-filter">
      <el-form :model="query" label-width="92px">
        <div class="filter-grid">
          <el-form-item label="订单号">
            <el-input v-model="query.orderNo" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="洗护工厂">
            <el-select v-model="query.factory" clearable placeholder="请选择">
              <el-option v-for="factory in factoryOptions" :key="factory" :label="factory" :value="factory" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="query.userName" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="query.phone" clearable placeholder="请输入" />
          </el-form-item>
          <template v-if="expanded">
            <el-form-item label="品牌">
              <el-select v-model="query.brand" clearable placeholder="请选择">
                <el-option label="比在" value="比在" />
              </el-select>
            </el-form-item>
            <el-form-item label="商户">
              <el-select v-model="query.merchant" clearable placeholder="请选择">
                <el-option v-for="merchant in merchantOptions" :key="merchant" :label="merchant" :value="merchant" />
              </el-select>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="query.orderStatus" clearable placeholder="请选择">
                <el-option label="待取件" value="待取件" />
                <el-option label="运输中" value="运输中" />
              </el-select>
            </el-form-item>
            <el-form-item label="工厂状态">
              <el-select v-model="query.factoryStatus" clearable placeholder="请选择">
                <el-option label="已分配" value="已分配" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker v-model="query.createdAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="入场时间">
              <el-date-picker v-model="query.enteredAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="预检时间">
              <el-date-picker v-model="query.precheckAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="质检时间">
              <el-date-picker v-model="query.qualityAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="出厂时间">
              <el-date-picker v-model="query.shippedAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="完成时间">
              <el-date-picker v-model="query.completedAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </template>
          <div class="filter-actions">
            <el-button @click="reset">重置</el-button>
            <el-button :loading="loading" type="primary" @click="queryData">查询</el-button>
            <el-button link type="primary" @click="expanded = !expanded">
              {{ expanded ? '收起' : '展开' }}
              <el-icon class="toggle-icon"><ArrowUp v-if="expanded" /><ArrowDown v-else /></el-icon>
            </el-button>
          </div>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="result-toolbar">
        <div>
          共<span class="danger">3198</span>条订单
          <span class="toolbar-label">是否出场:</span>
          <el-checkbox v-model="filters.notShipped">未出场</el-checkbox>
          <span class="toolbar-label">超时出场:</span>
          <el-checkbox v-for="day in timeoutDays" :key="day" v-model="filters.timeout" :label="day" />
        </div>
        <el-button :icon="Download" :loading="exportLoading" type="primary" @click="exportData">下载Excel</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" border class="query-table">
        <el-table-column fixed label="订单号" min-width="230">
          <template #default="{ row }">
            <button class="copy-link" type="button" @click="copyText(row.orderNo)">{{ row.orderNo }}<el-icon><CopyDocument /></el-icon></button>
          </template>
        </el-table-column>
        <el-table-column label="在厂时间" width="90" prop="factoryDays" />
        <el-table-column label="洗护工厂" min-width="170">
          <template #default="{ row }">
            {{ row.factory }} <el-tag size="small">{{ row.factoryCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="110">
          <template #default="{ row }"><span class="linkish">{{ row.userName }}</span></template>
        </el-table-column>
        <el-table-column label="手机号" width="150">
          <template #default="{ row }">
            {{ row.phone }} <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="下单渠道" width="110" prop="channel" />
        <el-table-column label="品牌" width="90" prop="brand" />
        <el-table-column label="商户" min-width="130" prop="merchant" />
        <el-table-column label="套餐名" min-width="190" prop="packageName" />
        <el-table-column align="center" label="衣服件数" width="95" prop="count" />
        <el-table-column align="center" label="支付金额" width="110" prop="amount" />
        <el-table-column align="center" label="支付方式" width="110" prop="payMethod" />
        <el-table-column align="center" label="订单状态" width="110">
          <template #default="{ row }"><el-tag effect="light" type="warning">{{ row.orderStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column align="center" label="工厂状态" width="110" prop="factoryStatus" />
        <el-table-column align="center" label="补差金额" width="110" prop="extraAmount" />
        <el-table-column align="center" label="客户备注" min-width="150" prop="customerRemark" />
        <el-table-column align="center" label="商户备注" min-width="150" prop="merchantRemark" />
        <el-table-column align="center" label="工厂备注" min-width="150" prop="factoryRemark" />
        <el-table-column align="center" label="取消原因" min-width="150" prop="cancelReason" />
        <el-table-column align="center" label="创建时间" width="150" prop="createdAt" />
        <el-table-column align="center" label="更新时间" width="150" prop="updatedAt" />
      </el-table>
    </YxCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp, CopyDocument, Download } from '@element-plus/icons-vue'
import YxCard from '@/components/base/YxCard.vue'

type OrderRow = {
  orderNo: string
  factoryDays: string
  factory: string
  factoryCode: string
  userName: string
  phone: string
  channel: string
  brand: string
  merchant: string
  packageName: string
  count: number
  amount: string
  payMethod: string
  orderStatus: string
  factoryStatus: string
  extraAmount: string
  customerRemark: string
  merchantRemark: string
  factoryRemark: string
  cancelReason: string
  createdAt: string
  updatedAt: string
}

const loading = ref(false)
const exportLoading = ref(false)
const expanded = ref(true)
const timeoutDays = ['3天', '5天', '6天', '7天', '10天', '15天']
const factoryOptions = ['辽宁(沈阳市)-洗衣工厂', '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺', '河北(廊坊/三河市)-洗衣工厂']
const merchantOptions = ['比在-辽宁', '比在-江浙沪皖', '比在-河北工厂']

const query = reactive({
  orderNo: '',
  factory: '',
  userName: '',
  phone: '',
  brand: '',
  merchant: '',
  orderStatus: '',
  factoryStatus: '',
  createdAt: ['2026-03-09 00:00:00', '2026-03-24 23:59:59'],
  enteredAt: [],
  precheckAt: [],
  qualityAt: [],
  shippedAt: [],
  completedAt: [],
})

const filters = reactive({
  notShipped: false,
  timeout: [],
})

const rows = ref<OrderRow[]>([
  createOrderRow('260324140856329316583', '-', '辽宁(沈阳市)-洗衣工厂', '0153', '圈子', '18714519895', '比在-辽宁', 3, '¥48.90', '待取件', '17:20后取送', '2026-03-24 14:08:56', '2026-03-24 14:09:07'),
  createOrderRow('260324140004305548343', '-', '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺', '0289', '胡', '15058591079', '比在-江浙沪皖', 5, '¥59.90', '待取件', '-', '2026-03-24 14:00:04', '2026-03-24 14:00:12'),
  createOrderRow('260324135242591128837', '-', '河北(廊坊/三河市)-洗衣工厂', '0459', '葛', '13611025175', '比在-河北工厂', 5, '¥59.90', '运输中', '-', '2026-03-24 13:52:42', '2026-03-24 14:18:03'),
  createOrderRow('260324134246359721037', '-', '河北(廊坊/三河市)-洗衣工厂', '0459', '刘', '19931333086', '比在-河北工厂', 5, '¥59.90', '待取件', '-', '2026-03-24 13:44:36', '2026-03-24 13:58:51'),
])

function createOrderRow(orderNo: string, factoryDays: string, factory: string, factoryCode: string, userName: string, phone: string, merchant: string, count: number, amount: string, orderStatus: string, customerRemark: string, createdAt: string, updatedAt: string): OrderRow {
  return {
    orderNo,
    factoryDays,
    factory,
    factoryCode,
    userName,
    phone,
    channel: '抖音(上门)',
    brand: '比在',
    merchant,
    packageName: '【亏本引流/全国免费取送】衣鞋任选洗3件/羽绒服/大衣/棉服/运动鞋/板鞋/附近干洗店团购',
    count,
    amount,
    payMethod: '线上',
    orderStatus,
    factoryStatus: '已分配',
    extraAmount: '-',
    customerRemark,
    merchantRemark: '-',
    factoryRemark: '-',
    cancelReason: '-',
    createdAt,
    updatedAt,
  }
}

function reset() {
  query.orderNo = ''
  query.factory = ''
  query.userName = ''
  query.phone = ''
  query.brand = ''
  query.merchant = ''
  query.orderStatus = ''
  query.factoryStatus = ''
  query.createdAt = ['2026-03-09 00:00:00', '2026-03-24 23:59:59']
  query.enteredAt = []
  query.precheckAt = []
  query.qualityAt = []
  query.shippedAt = []
  query.completedAt = []
}

function queryData() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 300)
}

function exportData() {
  exportLoading.value = true
  window.setTimeout(() => {
    exportLoading.value = false
    ElMessage.success('订单数据已开始导出')
  }, 300)
}

function copyText(text: string) {
  void navigator.clipboard?.writeText(text)
  ElMessage.success('已复制')
}
</script>

<style scoped>
.data-query-page {
  color: var(--yx-text-primary);
}

.query-filter {
  padding: 16px 24px 4px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 34px;
}

.filter-grid :deep(.el-form-item) {
  margin-right: 0;
}

.filter-grid :deep(.el-select),
.filter-grid :deep(.el-date-editor) {
  width: 100%;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-bottom: 18px;
}

.toggle-icon {
  margin-left: 4px;
}

.result-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  font-weight: 700;
}

.danger {
  color: var(--yx-danger);
}

.toolbar-label {
  margin-left: 14px;
}

.query-table {
  width: 100%;
}

.query-table :deep(.el-table__cell) {
  padding: 13px 0;
  vertical-align: middle;
}

.copy-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: var(--yx-primary);
  font: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.copy-icon {
  color: var(--yx-primary);
}
</style>
