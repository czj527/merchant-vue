<template>
  <div class="ticket-page">
    <div class="filter-card ticket-filter">
      <el-form :model="query" label-width="92px">
        <div class="filter-grid">
          <el-form-item label="工单号"><el-input v-model="query.ticketNo" clearable placeholder="请输入" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="query.phone" clearable placeholder="请输入手机号或者后4位尾号" /></el-form-item>
          <el-form-item label="工单类型"><el-cascader v-model="query.type" :options="ticketTypeOptions" clearable placeholder="请选择" /></el-form-item>
          <template v-if="expanded">
            <el-form-item label="工单等级"><el-select v-model="query.level" clearable placeholder="请选择"><el-option label="一般" value="一般" /><el-option label="较急" value="较急" /><el-option label="紧急" value="紧急" /></el-select></el-form-item>
            <el-form-item label="工单状态"><el-select v-model="query.status" clearable placeholder="请选择"><el-option label="待处理" value="待处理" /><el-option label="完结" value="完结" /><el-option label="撤销" value="撤销" /></el-select></el-form-item>
            <el-form-item label="订单号"><el-input v-model="query.orderNo" clearable placeholder="请输入" /></el-form-item>
            <el-form-item label="关联品牌"><el-select v-model="query.brand" clearable placeholder="请选择"><el-option label="比在" value="比在" /></el-select></el-form-item>
            <el-form-item label="关联工厂"><el-select v-model="query.factory" clearable placeholder="请选择"><el-option v-for="factory in factories" :key="factory" :label="factory" :value="factory" /></el-select></el-form-item>
            <el-form-item label="是否差评"><el-select v-model="query.badReview" clearable placeholder="请选择"><el-option label="是" value="是" /><el-option label="否" value="否" /></el-select></el-form-item>
            <el-form-item label="负责人"><el-select v-model="query.owner" clearable placeholder="请选择"><el-option label="郑佳依" value="郑佳依" /><el-option label="赵敏君" value="赵敏君" /></el-select></el-form-item>
            <el-form-item label="发起时间"><el-date-picker v-model="query.createdAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" /></el-form-item>
            <el-form-item label="完结时间"><el-date-picker v-model="query.finishedAt" type="datetimerange" start-placeholder="请选择" end-placeholder="请选择" range-separator="→" /></el-form-item>
          </template>
          <div class="filter-actions">
            <el-button @click="reset">重置</el-button>
            <el-button :loading="loading" type="primary" @click="loadTickets">查询</el-button>
            <el-button link type="primary" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}<el-icon class="toggle-icon"><ArrowUp v-if="expanded" /><ArrowDown v-else /></el-icon></el-button>
          </div>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="ticket-tabs">
        <button v-for="tab in tabs" :key="tab.name" :class="{ active: activeStatus === tab.name }" type="button" @click="activeStatus = tab.name">
          {{ tab.name }}<el-badge v-if="tab.badge" :value="tab.badge" />
        </button>
        <div class="ticket-actions">
          <el-button :icon="Plus" type="primary" @click="dialogVisible = true">新建工单</el-button>
          <el-button :icon="Download" type="primary" @click="exportTickets">下载Excel</el-button>
          <el-button :disabled="!selectedRows.length" :icon="User" type="primary">设置负责人</el-button>
          <el-button :disabled="!selectedRows.length" :icon="User" type="primary">批量完结</el-button>
        </div>
      </div>
      <div v-if="selectedRows.length" class="selection-bar">已选择 {{ selectedRows.length }} 项 <button type="button" @click="selectedRows = []">取消选择</button></div>
      <el-table v-loading="loading" :data="visibleRows" border class="ticket-table" row-key="ticketNo" @selection-change="selectedRows = $event">
        <el-table-column type="selection" width="48" />
        <el-table-column fixed label="工单号" min-width="210"><template #default="{ row }"><button class="copy-link" type="button">{{ row.ticketNo }}<el-icon><CopyDocument /></el-icon></button></template></el-table-column>
        <el-table-column fixed label="工单状态" width="120"><template #default="{ row }"><el-tag :type="row.status === '完结' ? 'success' : row.status === '撤销' ? 'danger' : 'warning'" effect="light">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column label="是否商户介入" width="120"><template #default="{ row }"><el-tag type="danger" effect="plain">{{ row.merchantInvolved }}</el-tag></template></el-table-column>
        <el-table-column label="是否确认" width="110"><template #default="{ row }"><el-tag type="danger" effect="plain">{{ row.confirmed }}</el-tag></template></el-table-column>
        <el-table-column label="处理时效" width="130"><template #default="{ row }"><span class="danger-text">{{ row.age }}</span></template></el-table-column>
        <el-table-column label="客户信息" min-width="180" prop="customer" />
        <el-table-column label="工单类型" min-width="250"><template #default="{ row }"><el-tag type="success" effect="light">{{ row.typeRoot }}</el-tag> {{ row.type }}</template></el-table-column>
        <el-table-column label="工单等级" width="110" prop="level" />
        <el-table-column label="订单号" min-width="210"><template #default="{ row }"><span class="linkish">{{ row.orderNo }}</span> <el-icon class="copy-icon"><CopyDocument /></el-icon></template></el-table-column>
        <el-table-column label="发起方" min-width="230" prop="origin" />
        <el-table-column label="处理方" width="120" prop="handler" />
        <el-table-column label="工单标题" min-width="180" prop="title" />
        <el-table-column label="是否差评" width="100"><template #default="{ row }"><el-tag effect="plain">{{ row.badReview }}</el-tag></template></el-table-column>
        <el-table-column label="品牌方代赔付金额" width="150" prop="brandPay" />
        <el-table-column label="工厂赔付金额" width="140" prop="factoryPay" />
        <el-table-column label="发起人" width="120" prop="creator" />
        <el-table-column label="负责人" width="120" prop="owner" />
        <el-table-column label="忽略24小时限制" width="150"><template #default><el-tag type="danger" effect="plain">否</el-tag></template></el-table-column>
        <el-table-column label="下次建联时间" width="150" prop="nextContact" />
        <el-table-column label="发起时间" width="170" prop="createdAt" />
        <el-table-column label="完结时间" width="170" prop="finishedAt" />
        <el-table-column fixed="right" label="操作" width="160"><template #default="{ row }"><el-button link type="primary">查看</el-button><el-button link type="primary">处理</el-button><el-button :disabled="row.status === '撤销'" link>撤销</el-button><el-button link>...</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="dialogVisible" class="ticket-dialog" title="新建工单" width="900px">
      <div class="order-search"><el-input v-model="ticketForm.searchOrder" placeholder="请输入订单号查询衣物信息" /><el-button type="primary">查询</el-button></div>
      <div class="dialog-section-title">洗护订单信息</div>
      <div class="order-info"><span>订单号： 空</span><span>用户名： 空</span><span>手机号： 空</span></div>
      <el-table :data="[]" border empty-text="暂无数据"><el-table-column type="selection" width="48" /><el-table-column label="衣服名称" /><el-table-column label="衣物条码" /><el-table-column label="衣服颜色" /><el-table-column label="衣服配件" /><el-table-column label="预检时间" /></el-table>
      <div class="dialog-section-title">工单信息</div>
      <el-form :model="ticketForm" label-position="top">
        <el-form-item label="工单标题" required><el-input v-model="ticketForm.title" placeholder="请输入工单标题" /></el-form-item>
        <div class="dialog-grid">
          <el-form-item label="工单类型" required><el-cascader v-model="ticketForm.type" :options="ticketTypeOptions" placeholder="请选择" /></el-form-item>
          <el-form-item label="工单等级" required><el-select v-model="ticketForm.level" placeholder="请选择"><el-option label="一般" value="一般" /><el-option label="较急" value="较急" /><el-option label="紧急" value="紧急" /></el-select></el-form-item>
          <el-form-item label="是否差评"><el-select v-model="ticketForm.badReview" placeholder="否"><el-option label="是" value="是" /><el-option label="否" value="否" /></el-select></el-form-item>
        </div>
        <el-form-item label="工单详情"><div class="editor-mock"><div class="editor-toolbar">B I U S　”　&lt;/&gt;　H1 H2　Normal　A　Sans Serif</div><div class="editor-body" /></div></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="dialogVisible = false">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ArrowDown, ArrowUp, CopyDocument, Download, Plus, User } from '@element-plus/icons-vue'
import YxCard from '@/components/base/YxCard.vue'

type TicketRow = { ticketNo: string; status: string; merchantInvolved: string; confirmed: string; age: string; customer: string; typeRoot: string; type: string; level: string; orderNo: string; origin: string; handler: string; title: string; badReview: string; brandPay: string; factoryPay: string; creator: string; owner: string; nextContact: string; createdAt: string; finishedAt: string }
const loading = ref(false)
const expanded = ref(false)
const activeStatus = ref('全部')
const dialogVisible = ref(false)
const selectedRows = ref<TicketRow[]>([])
const factories = ['浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺(0289)', '辽宁(沈阳市)-洗衣工厂(0153)']
const tabs = [{ name: '全部' }, { name: '新工单' }, { name: '工单新回复' }, { name: '超2小时未确认', badge: 7 }, { name: '超24小时' }, { name: '超36小时' }, { name: '超48小时' }, { name: '超72小时' }]
const ticketTypeOptions = [{ label: '售前类', value: '售前类', children: [{ label: '送洗件数与订单不符', value: '送洗件数与订单不符' }, { label: '加价类', value: '加价类' }, { label: '退洗类', value: '退洗类' }, { label: '其他类', value: '其他类' }] }, { label: '售后类', value: '售后类', children: [{ label: '未清洗干净', value: '未清洗干净' }, { label: '洗坏洗破', value: '洗坏洗破' }, { label: '漏寄错寄', value: '漏寄错寄' }, { label: '包装问题', value: '包装问题' }] }, { label: '投诉类', value: '投诉类', children: [{ label: '投诉', value: '投诉' }] }]
const query = reactive({ ticketNo: '', phone: '', type: [], level: '', status: '', orderNo: '', brand: '', factory: '', badReview: '', owner: '', createdAt: [], finishedAt: [] })
const ticketForm = reactive({ searchOrder: '', title: '', type: [], level: '', badReview: '否' })
const rows = ref<TicketRow[]>([
  createRow('T260316132510353124160', '撤销', '-', '张梅-18861600817', '送洗件数与订单不符', '260312165020265297411', '郑佳依', '下5到4，退一双洗涤费', '2026-03-16 13:25:10', '-'),
  createRow('T260226153823114651894', '待处理', '25天23小时', '梁快乐-18435154578', '退洗类', '260224193917471963059', '郑佳依', '一双不洗', '2026-02-26 15:38:23', '-'),
  createRow('T260209152551815950679', '待处理', '42天23小时', '钟-15221860816', '退洗类', '260208061207391368246', '赵敏君', '退洗', '2026-02-09 15:25:51', '-'),
  createRow('T260209131708460712669', '待处理', '43天1小时', '谢-18616775125', '退洗类', '260206172013661456343', '赵敏君', '退洗', '2026-02-09 13:17:08', '-'),
  createRow('T260209093727192550758', '待处理', '43天5小时', '怀惠英-15801890450', '退洗类', '260206150055044902962', '赵敏君', '退洗', '2026-02-09 09:37:27', '-'),
  createRow('T260125134319094960392', '完结', '5天19小时', '张欢-13840586416', '退洗类', '260124092942926277248', '辽宁沈阳洗护工厂', '退洗一件', '2026-01-25 13:43:19', '2026-01-31 09:09:04'),
])
const visibleRows = computed(() => activeStatus.value === '超2小时未确认' ? rows.value.filter((row) => row.status === '待处理') : rows.value)
function createRow(ticketNo: string, status: string, age: string, customer: string, type: string, orderNo: string, creator: string, title: string, createdAt: string, finishedAt: string): TicketRow { return { ticketNo, status, merchantInvolved: '否', confirmed: status === '完结' ? '是' : '否', age, customer, typeRoot: '售前类', type, level: '一般', orderNo, origin: '浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺(0289)', handler: '比在', title, badReview: '否', brandPay: '¥0.00', factoryPay: '¥0.00', creator, owner: '-', nextContact: '-', createdAt, finishedAt } }
function reset() { Object.assign(query, { ticketNo: '', phone: '', type: [], level: '', status: '', orderNo: '', brand: '', factory: '', badReview: '', owner: '', createdAt: [], finishedAt: [] }) }
function loadTickets() { loading.value = true; window.setTimeout(() => { loading.value = false }, 300) }
function exportTickets() { /* mock export */ }
</script>

<style scoped>
.ticket-filter{padding:16px 24px 4px}.filter-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 34px}.filter-grid :deep(.el-form-item){margin-right:0}.filter-grid :deep(.el-select),.filter-grid :deep(.el-cascader),.filter-grid :deep(.el-date-editor){width:100%}.filter-actions{display:flex;justify-content:flex-end;gap:10px;padding-bottom:18px}.toggle-icon{margin-left:4px}.ticket-tabs{display:flex;align-items:center;gap:26px;margin-bottom:16px;border-bottom:1px solid var(--yx-border)}.ticket-tabs button{position:relative;height:42px;padding:0;border:0;background:transparent;cursor:pointer;font-weight:700}.ticket-tabs button.active{color:var(--yx-primary)}.ticket-tabs button.active::after{position:absolute;right:0;bottom:-1px;left:0;height:2px;background:var(--yx-primary);content:""}.ticket-actions{display:flex;gap:8px;margin-left:auto;padding-bottom:8px}.selection-bar{display:flex;justify-content:space-between;padding:12px 24px;margin-bottom:12px;color:var(--yx-text-secondary);background:#fafafa}.selection-bar button{color:var(--yx-text-secondary);border:0;background:transparent;cursor:pointer}.ticket-table{width:100%}.ticket-table :deep(.el-table__cell){padding:13px 0}.copy-link{display:inline-flex;align-items:center;gap:4px;padding:0;color:var(--yx-text-primary);font:inherit;background:transparent;border:0}.copy-icon{color:var(--yx-primary)}.danger-text{color:var(--yx-danger);font-weight:700}.ticket-dialog :deep(.el-dialog__body){padding-top:0}.order-search{display:grid;grid-template-columns:1fr 64px;margin-bottom:16px}.dialog-section-title{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin:16px 0;font-weight:700}.dialog-section-title::before,.dialog-section-title::after{height:1px;background:var(--yx-border);content:""}.order-info{display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:12px;color:var(--yx-text-secondary)}.dialog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.editor-mock{width:100%;border:1px solid var(--yx-border)}.editor-toolbar{height:40px;padding:10px 16px;border-bottom:1px solid var(--yx-border)}.editor-body{height:42px}
</style>
