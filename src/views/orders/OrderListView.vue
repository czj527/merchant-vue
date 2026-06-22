<template>
  <div>
    <PageHeader title="订单列表" description="按渠道、状态、工厂和时间快速检索订单，支持门店寄洗和机器人消息。">
      <template #extra>
        <el-button :loading="exportLoading" @click="handleExport">导出订单</el-button>
        <el-button type="primary" @click="router.push('/orders/create')">新建订单</el-button>
        <el-button type="primary" plain @click="batchVisible = true">门店寄洗</el-button>
        <el-button plain @click="openRobotMessage">机器人消息</el-button>
      </template>
    </PageHeader>

    <div class="filter-card order-filter">
      <el-form :model="query" label-width="76px">
        <el-row :gutter="18">
          <el-col :span="6"><el-form-item label="订单号"><el-input v-model="query.keyword" clearable placeholder="订单号或第三方订单号" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="品牌"><el-select v-model="query.brand" clearable placeholder="请选择"><el-option label="优洗生活" value="优洗生活" /><el-option label="此在" value="此在" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="商户"><el-select v-model="query.merchant" clearable placeholder="请选择"><el-option label="麻雀奢活清洗服务" value="麻雀奢活清洗服务" /><el-option label="优洗生活城西店" value="优洗生活城西店" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="工厂状态"><el-select v-model="query.factoryStatus" clearable placeholder="请选择"><el-option label="已分配" value="assigned" /><el-option label="已出厂" value="out" /></el-select></el-form-item></el-col>
        </el-row>
        <el-row v-if="expanded" :gutter="18">
          <el-col :span="6"><el-form-item label="套餐名"><el-input v-model="query.packageName" clearable placeholder="模糊查询" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="洗护工厂"><el-select v-model="query.factory" clearable placeholder="请选择"><el-option label="河北(廊坊/三河市)-洗衣工厂" value="0459" /><el-option label="浙江(台州/仙居县)-洗衣工厂" value="0289" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="用户名"><el-input v-model="query.userName" clearable placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="手机号"><el-input v-model="query.phone" clearable placeholder="下单/取件手机号" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="是否反洗"><el-select v-model="query.rewash" clearable placeholder="请选择"><el-option label="是" value="yes" /><el-option label="否" value="no" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="创建时间"><el-date-picker v-model="query.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="抖音核销"><el-select v-model="query.dyVerify" clearable placeholder="请选择"><el-option label="已核销" value="yes" /><el-option label="未核销" value="no" /></el-select></el-form-item></el-col>
        </el-row>
        <div class="filter-actions">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" :loading="loading" @click="loadOrders">查询</el-button>
          <el-button text type="primary" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</el-button>
        </div>
      </el-form>
    </div>

    <YxCard>
      <el-tabs v-model="activeChannel" class="compact-tabs">
        <el-tab-pane v-for="channel in channels" :key="channel" :label="channel" :name="channel" />
      </el-tabs>
      <el-tabs v-model="activeStatus" class="status-tabs">
        <el-tab-pane v-for="status in statusTabs" :key="status.name" :label="`${status.label}(${status.count})`" :name="status.name" />
      </el-tabs>

      <el-table v-loading="loading" :data="orders" row-key="id" @row-click="handleRowClick">
        <el-table-column prop="orderNo" label="订单号" min-width="170" />
        <el-table-column prop="merchantName" label="商户" min-width="150" />
        <el-table-column prop="createdAt" label="下单时间" width="150" />
        <el-table-column prop="expectedAt" label="预约时间" width="150" />
        <el-table-column label="用户名" width="120"><template #default="{ row }"><span class="linkish" @click.stop="openMemberInfo(row.customerName)">{{ row.customerName }}</span></template></el-table-column>
        <el-table-column label="手机号" width="130"><template #default="{ row }"><span class="linkish">{{ row.customerPhone }}</span></template></el-table-column>
        <el-table-column label="订单状态" width="110"><template #default="{ row }"><StatusTag :label="getOrderStatusMeta(row.status).label" :type="getOrderStatusMeta(row.status).type" /></template></el-table-column>
        <el-table-column label="工厂状态" width="100"><template #default="{ row }"><StatusTag :label="row.factoryStatus" :type="row.factoryStatus === '已出厂' ? 'success' : 'info'" /></template></el-table-column>
        <el-table-column label="物流信息" min-width="170"><template #default="{ row }"><span class="linkish" @click.stop="openLogistics(row.orderNo)">收取: SF{{ row.orderNo.slice(-8) }}</span><br />配送: -</template></el-table-column>
        <el-table-column label="操作" width="170" fixed="right"><template #default="{ row }"><el-button text type="primary" @click.stop="router.push('/orders/' + row.id)">修改</el-button><el-button text type="primary" @click.stop="openLogistics(row.orderNo)">物流</el-button><el-button text type="primary" @click.stop="finishOrder">完成</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="memberVisible" title="会员/取寄信息" width="620px"><el-descriptions :column="1" border><el-descriptions-item label="会员">{{ currentMember }}</el-descriptions-item><el-descriptions-item label="联系电话">138****0001</el-descriptions-item><el-descriptions-item label="取件地址">浙江省杭州市拱墅区</el-descriptions-item></el-descriptions><template #footer><el-button type="primary" @click="memberVisible=false">知道了</el-button></template></el-dialog>
    <el-dialog v-model="logisticsVisible" title="物流详情" width="720px"><el-descriptions :column="2" border><el-descriptions-item label="收取单号">SF1234567890</el-descriptions-item><el-descriptions-item label="配送单号">-</el-descriptions-item></el-descriptions><template #footer><el-button type="primary" @click="logisticsVisible=false">知道了</el-button></template></el-dialog>
    <el-dialog v-model="batchVisible" title="门店寄洗" width="640px"><el-alert title="门店寄洗支持快速生成寄洗单。" type="info" show-icon :closable="false" style="margin-bottom:16px" /><el-form label-width="90px"><el-form-item label="门店"><el-select style="width:100%"><el-option label="麻雀奢活清洗服务" value="1" /><el-option label="优洗生活城西店" value="2" /></el-select></el-form-item><el-form-item label="备注"><el-input type="textarea" :rows="4" placeholder="请输入" /></el-form-item></el-form><template #footer><el-button @click="batchVisible=false">取消</el-button><el-button type="primary" @click="batchVisible=false">确认</el-button></template></el-dialog>
    <el-dialog v-model="robotVisible" title="机器人消息" width="560px"><el-form label-width="90px"><el-form-item label="消息内容"><el-input type="textarea" :rows="5" placeholder="请输入" /></el-form-item></el-form><template #footer><el-button @click="robotVisible=false">取消</el-button><el-button type="primary" @click="robotVisible=false">发送</el-button></template></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { getOrders } from '@/services'
import { getOrderStatusMeta, type Order } from '@/types/order'

const router = useRouter()
const loading = ref(false)
const exportLoading = ref(false)
const expanded = ref(false)
const orders = ref<Order[]>([])
const activeChannel = ref('全部')
const activeStatus = ref('全部')
const memberVisible = ref(false)
const logisticsVisible = ref(false)
const batchVisible = ref(false)
const robotVisible = ref(false)
const currentMember = ref('王小明')
const query = reactive({ keyword: '', brand: '', merchant: '', factoryStatus: '', packageName: '', factory: '', userName: '', phone: '', rewash: '', dyVerify: '', dateRange: [] as string[] })
const channels = ['全部', '门店', '抖音', '小程序']
const statusTabs = [
  { name: '全部', label: '全部', count: 28 },
  { name: '已接单', label: '已接单', count: 8 },
  { name: '收取中', label: '收取中', count: 6 },
  { name: '洗护中', label: '洗护中', count: 9 },
  { name: '已取消', label: '已取消', count: 2 },
]

function handleRowClick(row: Order) { router.push('/orders/' + row.id) }
async function loadOrders() { loading.value = true; try { orders.value = (await getOrders({ keyword: query.keyword, page: 1, pageSize: 20 })).list } finally { loading.value = false } }
function resetQuery() { Object.assign(query, { keyword: '', brand: '', merchant: '', factoryStatus: '', packageName: '', factory: '', userName: '', phone: '', rewash: '', dyVerify: '', dateRange: [] }); void loadOrders() }
function openLogistics(orderNo: string) { void orderNo; logisticsVisible.value = true }
function openMemberInfo(name: string) { currentMember.value = name; memberVisible.value = true }
function openRobotMessage() { robotVisible.value = true }
function finishOrder() { ElMessage.success('订单已完成') }
async function handleExport() { if (exportLoading.value) return; exportLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('导出任务已创建') } finally { exportLoading.value = false } }
onMounted(loadOrders)
</script>

