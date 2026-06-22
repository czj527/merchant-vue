<template>
  <div class="data-query-page">
    <div class="filter-card query-filter">
      <el-form :model="query" label-width="92px">
        <div class="filter-grid">
          <el-form-item label="订单号"><el-input v-model="query.orderNo" clearable placeholder="请输入" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="query.phone" clearable placeholder="请输入" /></el-form-item>
          <el-form-item label="洗护工厂"><el-select v-model="query.factory" clearable placeholder="请选择"><el-option v-for="factory in factoryOptions" :key="factory" :label="factory" :value="factory" /></el-select></el-form-item>
          <el-form-item label="品牌"><el-select v-model="query.brand" clearable placeholder="请选择"><el-option label="比在" value="比在" /></el-select></el-form-item>
          <template v-if="expanded">
            <el-form-item label="商户"><el-select v-model="query.merchant" clearable placeholder="请选择"><el-option label="比在-河北工厂" value="比在-河北工厂" /><el-option label="比在-辽宁" value="比在-辽宁" /></el-select></el-form-item>
            <el-form-item label="衣物条码"><el-input v-model="query.clothNo" clearable placeholder="请输入" /></el-form-item>
            <el-form-item label="是否洗护"><el-select v-model="query.washed" clearable placeholder="请选择"><el-option label="洗" value="洗" /><el-option label="未洗" value="未洗" /></el-select></el-form-item>
            <el-form-item label="订单状态"><el-select v-model="query.orderStatus" clearable placeholder="请选择"><el-option label="待取件" value="待取件" /><el-option label="运输中" value="运输中" /></el-select></el-form-item>
            <el-form-item label="工厂状态"><el-select v-model="query.factoryStatus" clearable placeholder="请选择"><el-option label="已分配" value="已分配" /></el-select></el-form-item>
            <el-form-item label="入场时间"><el-date-picker v-model="query.enteredAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" /></el-form-item>
            <el-form-item label="预检时间"><el-date-picker v-model="query.precheckAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" /></el-form-item>
            <el-form-item label="质检时间"><el-date-picker v-model="query.qualityAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" /></el-form-item>
            <el-form-item label="出厂时间"><el-date-picker v-model="query.shippedAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" /></el-form-item>
          </template>
          <div class="filter-actions">
            <el-button @click="reset">重置</el-button>
            <el-button :loading="loading" type="primary" @click="queryData">查询</el-button>
            <el-button link type="primary" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}<el-icon class="toggle-icon"><ArrowUp v-if="expanded" /><ArrowDown v-else /></el-icon></el-button>
          </div>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="result-toolbar">
        <span />
        <el-button :icon="Download" :loading="exportLoading" type="primary" @click="handleExport">下载Excel</el-button>
      </div>
      <el-table v-loading="loading" :data="rows" border class="query-table">
        <el-table-column fixed label="排序" width="70"><template #default="{ $index }"><span class="sort-badge">{{ $index + 1 }}</span></template></el-table-column>
        <el-table-column fixed label="订单号" min-width="220"><template #default="{ row }"><button class="copy-link" type="button" @click="copyText(row.orderNo)">{{ row.orderNo }}<el-icon><CopyDocument /></el-icon></button></template></el-table-column>
        <el-table-column label="洗护工厂" min-width="180"><template #default="{ row }">{{ row.factory }} <el-tag size="small">{{ row.factoryCode }}</el-tag></template></el-table-column>
        <el-table-column label="品牌" width="90" prop="brand" />
        <el-table-column label="商户" min-width="150" prop="merchant" />
        <el-table-column label="项目/衣物" width="110" prop="itemName" />
        <el-table-column label="是否是附件" width="110"><template #default><el-tag type="success" effect="light">主件</el-tag></template></el-table-column>
        <el-table-column label="衣物条码" min-width="150" prop="clothNo" />
        <el-table-column label="颜色" width="90" prop="color" />
        <el-table-column label="瑕疵" min-width="120" prop="defect" />
        <el-table-column label="预检照片" width="130"><template #default="{ row }"><div class="cloth-photo" :class="row.photoClass" /></template></el-table-column>
        <el-table-column label="质检照片" width="110" prop="qualityPhoto" />
        <el-table-column label="配饰/附件" min-width="150" prop="accessory" />
        <el-table-column label="备注/洗涤风险" min-width="190" prop="risk" />
        <el-table-column label="是否洗护" width="100" prop="washed" />
        <el-table-column label="客户备注" min-width="150" prop="customerRemark" />
        <el-table-column label="商户备注" min-width="150" prop="merchantRemark" />
        <el-table-column label="订单状态" width="110" prop="orderStatus" />
        <el-table-column label="工厂状态" width="110" prop="factoryStatus" />
        <el-table-column label="质检操作员" width="120" prop="operator" />
        <el-table-column label="库位号" width="100" prop="location" />
      </el-table>
    </YxCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp, CopyDocument, Download } from '@element-plus/icons-vue'
import YxCard from '@/components/base/YxCard.vue'

const loading = ref(false)
const exportLoading = ref(false)
const expanded = ref(true)
const factoryOptions = ['河北(廊坊/三河市)-洗衣工厂', '辽宁(沈阳市)-洗衣工厂', '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺']
const query = reactive({ orderNo: '', phone: '', factory: '', brand: '', merchant: '', clothNo: '', washed: '', orderStatus: '', factoryStatus: '', enteredAt: [], precheckAt: ['2026-03-09 00:00:00', '2026-03-24 23:59:59'], qualityAt: [], shippedAt: [] })
const rows = ref([
  { orderNo: '260322200844116847299', factory: '河北(廊坊/三河市)-洗衣工厂', factoryCode: '0459', brand: '比在', merchant: '比在-河北工厂', itemName: '羽绒服', clothNo: '045926032400557', color: '黑色', defect: '脏尽洗,有渍,油渍,色差,特脏', photoClass: 'photo-gray', qualityPhoto: '-', accessory: '-', risk: '-', washed: '洗', customerRemark: '-', merchantRemark: '-', orderStatus: '-', factoryStatus: '-', operator: '-', location: 'J376-C' },
  { orderNo: '260321153032296722089', factory: '辽宁(沈阳市)-洗衣工厂', factoryCode: '0153', brand: '比在', merchant: '比在-辽宁', itemName: '羽绒服', clothNo: '015326032400091', color: '黑色', defect: '脏尽洗,清尽洗,拉链掉色/掉漆', photoClass: 'photo-green', qualityPhoto: '-', accessory: '-', risk: '-', washed: '洗', customerRemark: '-', merchantRemark: '-', orderStatus: '-', factoryStatus: '-', operator: '-', location: 'L231-C' },
  { orderNo: '260321175246698553823', factory: '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺', factoryCode: '0289', brand: '比在', merchant: '比在-江浙沪皖', itemName: '棉服', clothNo: '028926032400590', color: '灰绿', defect: '脏尽洗,有渍,油渍,笔渍不易掉,黑渍', photoClass: 'photo-cyan', qualityPhoto: '-', accessory: '-', risk: '-', washed: '洗', customerRemark: '-', merchantRemark: '-', orderStatus: '-', factoryStatus: '-', operator: '-', location: '774-C' },
  { orderNo: '260321153032296722089', factory: '辽宁(沈阳市)-洗衣工厂', factoryCode: '0153', brand: '比在', merchant: '比在-辽宁', itemName: '羽绒服', clothNo: '015326032400090', color: '白色', defect: '脏尽洗,清尽洗,拉链掉色/掉漆', photoClass: 'photo-white', qualityPhoto: '-', accessory: '-', risk: '-', washed: '洗', customerRemark: '-', merchantRemark: '-', orderStatus: '-', factoryStatus: '-', operator: '-', location: 'L231-C' },
])

function reset() { Object.assign(query, { orderNo: '', phone: '', factory: '', brand: '', merchant: '', clothNo: '', washed: '', orderStatus: '', factoryStatus: '', enteredAt: [], precheckAt: ['2026-03-09 00:00:00', '2026-03-24 23:59:59'], qualityAt: [], shippedAt: [] }) }
function queryData() { loading.value = true; window.setTimeout(() => { loading.value = false; ElMessage.success('查询完成') }, 300) }
function handleExport() { exportLoading.value = true; window.setTimeout(() => { exportLoading.value = false; ElMessage.success('衣物数据已开始导出') }, 300) }
function copyText(text: string) { void navigator.clipboard?.writeText(text); ElMessage.success('已复制') }
</script>

<style scoped>
.data-query-page{color:var(--yx-text-primary)}.query-filter{padding:16px 24px 4px}.filter-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 34px}.filter-grid :deep(.el-form-item){margin-right:0}.filter-grid :deep(.el-select),.filter-grid :deep(.el-date-editor){width:100%}.filter-actions{display:flex;justify-content:flex-end;gap:10px;padding-bottom:18px}.toggle-icon{margin-left:4px}.result-toolbar{display:flex;justify-content:space-between;margin-bottom:16px}.query-table{width:100%}.query-table :deep(.el-table__cell){padding:13px 0;vertical-align:middle}.sort-badge{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;color:#fff;font-size:12px;font-weight:700;background:#2f4a60;border-radius:50%}.copy-link{display:inline-flex;align-items:center;gap:4px;padding:0;color:var(--yx-primary);font:inherit;background:transparent;border:0;cursor:pointer}.cloth-photo{width:86px;height:58px;margin:auto;border:1px solid var(--yx-border);background:linear-gradient(145deg,#bbb,#eee);border-radius:2px}.photo-gray{background:linear-gradient(145deg,#777,#c8c8c8)}.photo-green{background:linear-gradient(145deg,#9eaaa0,#d7e1dc)}.photo-cyan{background:linear-gradient(145deg,#16c5ad,#92eee0)}.photo-white{background:linear-gradient(145deg,#ddd,#f8f8f8)}
</style>
