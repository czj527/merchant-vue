<template>
  <div>
    <PageHeader title="商户看板" description="关注时效预警与工厂生产统计，优先处理高风险事项。">
      <template #extra>
        <el-button :loading="exportLoading" @click="handleExport">导出数据</el-button>
        <el-button type="primary" @click="router.push('/orders/create')">新建订单</el-button>
      </template>
    </PageHeader>

    <YxCard>
      <div class="section-title">时效预警</div>
      <div class="warning-grid">
        <div v-for="item in warningCards" :key="item.title" class="warning-card">
          <div class="warning-title"><span>{{ item.title }}</span><el-button text type="primary" @click="openDetail(item.title)">明细</el-button></div>
          <div class="warning-value">{{ item.value }}单</div>
        </div>
      </div>
    </YxCard>

    <YxCard class="section-card">
      <div class="section-title">工厂生产统计<span>（其中在场待拆包、在场洗护中、在场待发货订单超30%预警，50%警告；其中在场超15天、超10天、超7天订单超1单预警，5单警告）</span></div>
      <el-table :data="factoryRows" border>
        <el-table-column prop="factory" label="工厂" min-width="180" />
        <el-table-column prop="todayArrive" label="今日预计到场/件" width="130" />
        <el-table-column prop="yesterdayArrive" label="昨天到场量/件" width="130" />
        <el-table-column prop="yesterdayPreCheck" label="昨天预检量/件" width="130" />
        <el-table-column prop="yesterdayQc" label="昨天质检量/件" width="130" />
        <el-table-column prop="yesterdayOut" label="昨天出厂量/件" width="130" />
        <el-table-column prop="total" label="在场总订单" width="110" />
        <el-table-column prop="unpack" label="在场待拆包" width="120" />
        <el-table-column prop="washing" label="在场洗护中" width="120" />
        <el-table-column prop="waitingShip" label="在场待发货" width="120" />
        <el-table-column prop="over15" label="在场超15天" width="120" />
        <el-table-column prop="over10" label="在场超10天" width="120" />
        <el-table-column prop="over7" label="在场超7天" width="120" />
        <el-table-column prop="over5" label="在场超5天" width="120" />
        <el-table-column prop="over3" label="在场超3天" width="120" />
      </el-table>
    </YxCard>

    <el-dialog v-model="detailVisible" :title="`详情 - ${detailTitle}`" width="1400px" top="5vh">
      <div class="detail-filter">
        <el-form inline :model="detailQuery">
          <el-form-item label="订单号"><el-input v-model="detailQuery.orderNo" placeholder="请输入" /></el-form-item>
          <el-form-item label="预约时间"><el-date-picker v-model="detailQuery.reserveRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /></el-form-item>
          <el-form-item label="洗护工厂"><el-select v-model="detailQuery.factory" placeholder="请选择" clearable><el-option label="河北(廊坊/三河市)-洗衣工厂" value="0459" /><el-option label="辽宁(沈阳市)-洗衣工厂" value="0153" /></el-select></el-form-item>
        </el-form>
        <div class="detail-actions"><el-button @click="resetDetail">重置</el-button><el-button type="primary">查询</el-button><el-button text type="primary">展开</el-button></div>
      </div>
      <el-table :data="detailRows" border height="600">
        <el-table-column prop="orderNo" label="订单号" min-width="170" />
        <el-table-column prop="reserveAt" label="预约时间" width="150" />
        <el-table-column prop="inFactoryAt" label="在厂时间" width="100" />
        <el-table-column prop="packageName" label="套餐名" min-width="200" />
        <el-table-column prop="logistics" label="物流信息" min-width="180" />
        <el-table-column prop="factory" label="洗护工厂" min-width="180" />
        <el-table-column prop="brand" label="品牌" width="100" />
        <el-table-column prop="merchant" label="商户" min-width="160" />
        <el-table-column prop="channel" label="下单渠道" width="100" />
        <el-table-column prop="userName" label="用户名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
      </el-table>
      <div class="pager-row"><div>第 1-10 条/总共 10 条</div><el-pagination layout="prev, pager, next" :total="10" :page-size="10" /></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const router = useRouter()
const exportLoading = ref(false)
const detailVisible = ref(false)
const detailTitle = ref('')
const detailQuery = reactive({ orderNo: '', reserveRange: [], factory: '' })
const warningCards = [
  { title: '2天内取件超1小时未揽收', value: 13 },
  { title: '取件超24小时未妥投', value: 0 },
  { title: '出厂超24小时未揽收', value: 36 },
  { title: '出厂超24小时未妥投', value: 33 },
  { title: '待处理售后', value: 0 },
  { title: '在厂超3天', value: 29 },
  { title: '在厂超5天', value: 13 },
  { title: '在厂超7天', value: 5 },
  { title: '在厂超10天', value: 1 },
  { title: '在厂超15天', value: 0 },
]
const factoryRows = [
  { factory: '0459 河北(廊坊/三河市)-洗衣工厂', todayArrive: '29单 / 136件', yesterdayArrive: '108单 / 494件', yesterdayPreCheck: '109单 / 494件', yesterdayQc: '10单 / 272件', yesterdayOut: '6单 / 266件', total: '199单', unpack: '5单 / 2.51%', washing: '190单 / 95.48%', waitingShip: '4单 / 2.01%', over15: '0单 / 0.00%', over10: '0单 / 0.00%', over7: '0单 / 0.00%', over5: '1单 / 0.50%', over3: '3单 / 1.51%' },
  { factory: '0153 辽宁(沈阳市)-洗衣工厂', todayArrive: '48单 / 208件', yesterdayArrive: '67单 / 309件', yesterdayPreCheck: '63单 / 306件', yesterdayQc: '25单 / 169件', yesterdayOut: '14单 / 229件', total: '168单', unpack: '6单 / 3.57%', washing: '145单 / 86.31%', waitingShip: '17单 / 10.12%', over15: '0单 / 0.00%', over10: '0单 / 0.00%', over7: '3单 / 1.79%', over5: '6单 / 3.57%', over3: '16单 / 9.52%' },
  { factory: '0289 浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺', todayArrive: '77单 / 359件', yesterdayArrive: '102单 / 495件', yesterdayPreCheck: '69单 / 480件', yesterdayQc: '32单 / 287件', yesterdayOut: '31单 / 291件', total: '164单', unpack: '18单 / 10.98%', washing: '144单 / 87.80%', waitingShip: '2单 / 1.22%', over15: '0单 / 0.00%', over10: '0单 / 0.00%', over7: '1单 / 0.61%', over5: '5单 / 3.05%', over3: '9单 / 5.49%' },
]
const detailRows = Array.from({ length: 10 }, (_, index) => ({ orderNo: `26032400332077095880${index}`, reserveAt: '2026-03-24 11:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】衣鞋任洗', logistics: '收取: SF5132339130685 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: ['姜娟', '孔瀚笙', '孙'][index % 3], phone: '13106695002' }))
function openDetail(title: string) { detailTitle.value = title; detailVisible.value = true }
function resetDetail() { Object.assign(detailQuery, { orderNo: '', reserveRange: [], factory: '' }) }
async function handleExport() { if (exportLoading.value) return; exportLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('导出任务已创建') } finally { exportLoading.value = false } }
</script>

<style scoped>
.section-card { margin-top: 12px; }
.section-title { margin-bottom: 14px; padding-left: 8px; border-left: 4px solid var(--yx-primary); font-size: 16px; font-weight: 600; }
.section-title span { margin-left: 4px; color: var(--yx-danger); font-size: 13px; font-weight: 500; }
.warning-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px 16px; }
.warning-card { padding: 16px 20px; border: 1px solid var(--yx-border); border-radius: var(--yx-radius-lg); background: #fff; }
.warning-title { display: flex; align-items: center; justify-content: space-between; color: var(--yx-text-primary); font-weight: 600; }
.warning-value { margin-top: 20px; font-size: 24px; color: var(--yx-text-primary); }
.detail-filter { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.detail-actions { display: flex; align-items: center; gap: 8px; }
.pager-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
</style>
