<template>
  <div>
    <PageHeader title="代工看板" description="查看代工工厂产能、时效、结算和异常预警。">
      <template #extra>
        <el-button @click="detailVisible = true">数据详情</el-button>
        <el-button type="primary" :loading="exportLoading" @click="handleExport">导出结算</el-button>
      </template>
    </PageHeader>

    <div class="metric-grid">
      <MetricCard label="今日入厂" value="256" hint="较昨日 +12" />
      <MetricCard label="今日出厂" value="213" hint="准时率 96%" />
      <MetricCard label="在厂洗护" value="549" hint="含合作工厂" />
      <MetricCard label="超时预警" value="13" hint="需跟进" />
      <MetricCard label="本月结算" value="¥42,860" hint="Mock 统计" />
      <MetricCard label="合作工厂" value="3" hint="启用中" />
    </div>

    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="日期范围"><el-date-picker v-model="query.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /></el-form-item>
        <el-form-item label="工厂"><el-select v-model="query.factory" clearable placeholder="请选择"><el-option label="浙江(台州)洗衣工厂" value="浙江(台州)洗衣工厂" /><el-option label="浙江(宁波)洗衣工厂" value="浙江(宁波)洗衣工厂" /></el-select></el-form-item>
      </el-form>
      <el-table :data="factories" border>
        <el-table-column prop="name" label="工厂名称" min-width="160" />
        <el-table-column prop="todayIn" label="今日入厂" width="110" />
        <el-table-column prop="todayOut" label="今日出厂" width="110" />
        <el-table-column prop="washing" label="在洗护" width="110" />
        <el-table-column prop="timeout" label="超时件数" width="110" />
        <el-table-column prop="rate" label="准时率" width="100" />
        <el-table-column label="操作" width="120"><template #default><el-button text type="primary" @click="detailVisible = true">查看详情</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="detailVisible" title="详情" width="1400px" top="5vh">
      <div class="detail-filter">
        <el-form inline :model="detailQuery">
          <el-form-item label="订单号"><el-input v-model="detailQuery.orderNo" placeholder="请输入" /></el-form-item>
          <el-form-item label="预约时间"><el-date-picker v-model="detailQuery.reserveRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /></el-form-item>
          <el-form-item label="洗护工厂"><el-select v-model="detailQuery.factory" placeholder="请选择" clearable><el-option v-for="item in factoryOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item label="品牌"><el-select v-model="detailQuery.brand" placeholder="请选择" clearable><el-option label="此在" value="此在" /><el-option label="优洗生活" value="优洗生活" /></el-select></el-form-item>
          <el-form-item label="商户"><el-select v-model="detailQuery.merchant" placeholder="请选择" clearable><el-option label="D0174-北京盛峰雅洁清洗服务有限公司" value="D0174" /><el-option label="D0175-上海门店" value="D0175" /></el-select></el-form-item>
          <el-form-item label="用户名"><el-input v-model="detailQuery.userName" placeholder="请输入" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="detailQuery.phone" placeholder="请输入" /></el-form-item>
        </el-form>
        <div class="detail-actions">
          <el-button @click="resetDetail">重置</el-button>
          <el-button type="primary" :loading="detailLoading" @click="searchDetail">查询</el-button>
          <el-button text type="primary" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</el-button>
        </div>
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

      <div class="pager-row">
        <div>第 1-10 条/总共 10 条</div>
        <el-pagination layout="prev, pager, next" :total="10" :page-size="10" />
      </div>

      <template #footer><el-button @click="detailVisible = false">关闭</el-button><el-button type="primary" @click="detailVisible = false">确认</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import MetricCard from '@/components/business/MetricCard.vue'
import YxCard from '@/components/base/YxCard.vue'

const exportLoading = ref(false)
const detailVisible = ref(false)
const detailLoading = ref(false)
const expanded = ref(true)
const query = reactive({ dateRange: [], factory: '' })
const detailQuery = reactive({ orderNo: '', reserveRange: [], factory: '', brand: '', merchant: '', userName: '', phone: '' })
const factoryOptions = ['河北(廊坊/三河市)-洗衣工厂', '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺', '辽宁(沈阳市)-洗衣工厂']
const factories = [
  { name: '浙江(台州)洗衣工厂', todayIn: 128, todayOut: 109, washing: 87, timeout: 4, rate: '96%' },
  { name: '浙江(宁波)洗衣工厂', todayIn: 95, todayOut: 88, washing: 64, timeout: 5, rate: '95%' },
]
const detailRows = [
  { orderNo: '260324003320770958808', reserveAt: '2026-03-24 11:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】衣鞋任洗', logistics: '收取: SF5132339130685 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '姜娟', phone: '13106695002' },
  { orderNo: '260323204230084677939', reserveAt: '2026-03-24 12:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】衣鞋任洗', logistics: '收取: SF5133441258469 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '孔瀚笙', phone: '18622595669' },
  { orderNo: '260323202624172207232', reserveAt: '2026-03-24 11:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】衣鞋任洗', logistics: '收取: SF0227240690385 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '孙', phone: '13691008781' },
  { orderNo: '260323194159463454779', reserveAt: '2026-03-24 08:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】衣鞋任洗', logistics: '收取: SF0223040690637 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '王荣', phone: '18500643291' },
  { orderNo: '26032317902142709628', reserveAt: '2026-03-24 08:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】衣鞋任洗', logistics: '收取: JDX050896074667 / 配送:-', factory: '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺 0289', brand: '此在', merchant: '此在-江浙沪院', channel: '抖音小程序', userName: '韩', phone: '13215635808' },
  { orderNo: '260323081519039572593', reserveAt: '2026-03-23 10:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】鞋子任洗', logistics: '收取: JDX050864550000 / 配送:-', factory: '辽宁(沈阳市)-洗衣工厂 0153', brand: '此在', merchant: '此在-辽宁', channel: '抖音小程序', userName: '景婷婷', phone: '15844003456' },
  { orderNo: '260322170015118983531', reserveAt: '2026-03-23 16:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】鞋子任洗', logistics: '收取: SF5133415435793 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '曲', phone: '18513042459' },
  { orderNo: '260322140710499814553', reserveAt: '2026-03-22 16:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】鞋子任洗', logistics: '收取: JDX050826360821 / 配送:-', factory: '辽宁(沈阳市)-洗衣工厂 0153', brand: '此在', merchant: '此在-辽宁', channel: '抖音小程序', userName: '潘妍', phone: '18746627052' },
  { orderNo: '260322135709530990055', reserveAt: '2026-03-23 16:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】鞋子任洗', logistics: '收取: SF5133226438794 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '符先生', phone: '13694308018' },
  { orderNo: '260312131046031858490', reserveAt: '2026-03-24 12:00:00', inFactoryAt: '-', packageName: '【云本引流/全国免费取送】鞋子任洗', logistics: '收取: SF5123456789012 / 配送:-', factory: '河北(廊坊/三河市)-洗衣工厂 0459', brand: '此在', merchant: '此在-河北工厂', channel: '抖音小程序', userName: '萍萍', phone: '13521259866' },
]
async function handleExport() { if (exportLoading.value) return; exportLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 600)); ElMessage.success('结算导出任务已创建') } finally { exportLoading.value = false } }
async function searchDetail() { if (detailLoading.value) return; detailLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 400)) } finally { detailLoading.value = false } }
function resetDetail() { Object.assign(detailQuery, { orderNo: '', reserveRange: [], factory: '', brand: '', merchant: '', userName: '', phone: '' }) }
</script>

<style scoped>
.detail-filter { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.detail-actions { display: flex; align-items: center; gap: 8px; }
.pager-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
</style>
