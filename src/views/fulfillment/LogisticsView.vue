<template>
  <div class="logistics-page">
    <PageHeader title="物流中心" description="创建快递单、维护地址簿和查看物流中心记录。">
      <template #extra>
        <el-button :icon="Download" type="primary" @click="handleExport">下载Excel</el-button>
      </template>
    </PageHeader>

    <div class="filter-card logistics-filter">
      <el-form :model="query" label-width="92px">
        <div class="filter-grid">
          <el-form-item label="订单号">
            <el-input v-model="query.orderNo" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="客户编码">
            <el-input v-model="query.customerCode" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="物流公司">
            <el-select v-model="query.company" clearable placeholder="请选择">
              <el-option v-for="company in companyOptions" :key="company" :label="company" :value="company" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="expanded" label="物流单号">
            <el-input v-model="query.logisticsNo" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="expanded" label="寄件人信息">
            <el-input v-model="query.sender" clearable placeholder="输入寄件人名称或手机号" />
          </el-form-item>
          <el-form-item v-if="expanded" label="收件人信息">
            <el-input v-model="query.receiver" clearable placeholder="输入收件人名称或手机号" />
          </el-form-item>
          <el-form-item v-if="expanded" label="创建时间">
            <el-date-picker
              v-model="query.dateRange"
              end-placeholder="结束日期"
              range-separator="→"
              start-placeholder="开始日期"
              type="daterange"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <div class="filter-actions">
            <el-button @click="resetQuery">重置</el-button>
            <el-button :loading="queryLoading" type="primary" @click="loadLogistics">查询</el-button>
            <el-button link type="primary" @click="expanded = !expanded">
              {{ expanded ? '收起' : '展开' }}
              <el-icon class="toggle-icon"><ArrowUp v-if="expanded" /><ArrowDown v-else /></el-icon>
            </el-button>
          </div>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="page-actions">
        <div class="left-actions">
          <el-button :icon="Plus" type="primary" @click="openCreateDialog">创建快递单</el-button>
          <el-button :disabled="!selectedRows.length" :icon="Printer">打印面单</el-button>
          <el-button :icon="Plus" class="dashed-button" @click="openAddressDialog">新增地址簿</el-button>
        </div>
        <el-button :icon="Download" type="primary" @click="handleExport">下载Excel</el-button>
      </div>

      <el-table
        v-loading="queryLoading"
        :data="filteredRows"
        border
        class="logistics-table"
        row-key="id"
        @selection-change="selectedRows = $event"
      >
        <el-table-column type="selection" width="48" />
        <el-table-column label="排序" width="64">
          <template #default="{ $index }">
            <span class="sort-badge">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="租户名" min-width="170" prop="tenantName" />
        <el-table-column label="关联订单" min-width="190">
          <template #default="{ row }">
            <button class="copy-link" type="button" @click="copyText(row.orderNo)">
              {{ row.orderNo }}
              <el-icon><CopyDocument /></el-icon>
            </button>
          </template>
        </el-table-column>
        <el-table-column label="品牌" min-width="90" prop="brand" />
        <el-table-column label="商户" min-width="150" prop="merchant" />
        <el-table-column label="物流类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '寄件' ? 'success' : 'primary'" effect="light">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物流公司" width="100" prop="company" />
        <el-table-column label="物流单号" min-width="190">
          <template #default="{ row }">
            <button class="copy-link muted" type="button" @click="copyText(row.logisticsNo)">
              {{ row.logisticsNo }}
              <el-icon><CopyDocument /></el-icon>
            </button>
          </template>
        </el-table-column>
        <el-table-column label="寄件信息" min-width="230">
          <template #default="{ row }">
            <div class="address-cell">{{ row.sender }}</div>
          </template>
        </el-table-column>
        <el-table-column label="收件信息" min-width="250">
          <template #default="{ row }">
            <div class="address-cell">{{ row.receiver }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量" width="80" prop="quantity" />
        <el-table-column align="center" label="重量(kg)" width="100" prop="weight" />
        <el-table-column fixed="right" label="操作" width="116">
          <template #default="{ row }">
            <div class="row-actions">
              <el-button link type="primary" @click="openRoute(row)">物流路由</el-button>
              <el-button link type="primary" @click="createAgain(row)">再来一单</el-button>
              <el-button link type="primary" @click="saveAddress(row)">存为地址簿</el-button>
              <el-button link type="danger" @click="cancelLogistics(row)">取消物流</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="createDialogVisible" class="logistics-dialog" title="创建快递单" width="800px">
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-position="top">
        <div class="form-section-title"><span />上门信息<span /></div>
        <div class="dialog-grid top-grid">
          <el-form-item label="上门时间" prop="pickupTime">
            <el-date-picker
              v-model="createForm.pickupTime"
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>
          <el-form-item label="快递公司" prop="company">
            <el-select v-model="createForm.company" clearable placeholder="请选择">
              <el-option v-for="company in companyOptions" :key="company" :label="company" :value="company" />
            </el-select>
          </el-form-item>
          <el-form-item label="取寄类型" prop="pickupType">
            <el-select v-model="createForm.pickupType" clearable placeholder="请选择">
              <el-option label="取件(客户->工厂)" value="取件(客户->工厂)" />
              <el-option label="寄件(工厂->客户)" value="寄件(工厂->客户)" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型" prop="productType">
            <el-select v-model="createForm.productType" clearable placeholder="请选择">
              <el-option v-for="product in productOptions" :key="product" :label="product" :value="product" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-section-title"><span />寄件信息<span /></div>
        <div class="dialog-grid address-grid">
          <el-form-item label="联系人" required>
            <el-input v-model="createForm.sender.contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" required>
            <el-input v-model="createForm.sender.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="省市区">
            <el-select v-model="createForm.sender.region" clearable placeholder="请选择">
              <el-option v-for="region in regionOptions" :key="region" :label="region" :value="region" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="detail-form-item" label="详细地址" required>
          <div class="address-textarea">
            <el-input
              v-model="createForm.sender.detail"
              placeholder="请输入详细地址(如省市区没填，详细地址请包含省市区)"
              :rows="3"
              type="textarea"
            />
            <el-button :icon="Location" circle class="map-button" type="primary" />
          </div>
        </el-form-item>

        <div class="swap-line">
          <el-button :icon="Refresh" size="small" type="primary" @click="swapAddress">交换</el-button>
          <span>收件信息</span>
        </div>
        <div class="dialog-grid address-grid">
          <el-form-item label="联系人" required>
            <el-input v-model="createForm.receiver.contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" required>
            <el-input v-model="createForm.receiver.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="省市区">
            <el-select v-model="createForm.receiver.region" clearable placeholder="请选择">
              <el-option v-for="region in regionOptions" :key="region" :label="region" :value="region" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="detail-form-item" label="详细地址" required>
          <div class="address-textarea">
            <el-input
              v-model="createForm.receiver.detail"
              placeholder="请输入详细地址(如省市区没填，详细地址请包含省市区)"
              :rows="3"
              type="textarea"
            />
            <el-button :icon="Location" circle class="map-button" type="primary" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitCreate">确认下单</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="addressDialogVisible" class="logistics-dialog" title="新增地址簿" width="800px">
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-position="top">
        <div class="form-section-title"><span />上门信息<span /></div>
        <div class="dialog-grid top-grid">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="addressForm.templateName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="快递公司" prop="company">
            <el-select v-model="addressForm.company" clearable placeholder="请选择">
              <el-option v-for="company in companyOptions" :key="company" :label="company" :value="company" />
            </el-select>
          </el-form-item>
          <el-form-item label="取寄类型" prop="pickupType">
            <el-select v-model="addressForm.pickupType" clearable placeholder="请选择">
              <el-option label="取件(客户->工厂)" value="取件(客户->工厂)" />
              <el-option label="寄件(工厂->客户)" value="寄件(工厂->客户)" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型" prop="productType">
            <el-select v-model="addressForm.productType" clearable placeholder="请选择">
              <el-option v-for="product in productOptions" :key="product" :label="product" :value="product" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-section-title"><span />寄件信息<span /></div>
        <div class="dialog-grid address-grid">
          <el-form-item label="联系人" required>
            <el-input v-model="addressForm.sender.contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" required>
            <el-input v-model="addressForm.sender.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="省市区">
            <el-select v-model="addressForm.sender.region" clearable placeholder="请选择">
              <el-option v-for="region in regionOptions" :key="region" :label="region" :value="region" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="detail-form-item" label="详细地址" required>
          <div class="address-textarea">
            <el-input
              v-model="addressForm.sender.detail"
              placeholder="请输入详细地址(如省市区没填，详细地址请包含省市区)"
              :rows="3"
              type="textarea"
            />
            <el-button :icon="Location" circle class="map-button" type="primary" />
          </div>
        </el-form-item>

        <div class="swap-line">
          <el-button :icon="Refresh" size="small" type="primary" @click="swapAddressBook">交换</el-button>
          <span>收件信息</span>
        </div>
        <div class="dialog-grid address-grid">
          <el-form-item label="联系人" required>
            <el-input v-model="addressForm.receiver.contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" required>
            <el-input v-model="addressForm.receiver.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="省市区">
            <el-select v-model="addressForm.receiver.region" clearable placeholder="请选择">
              <el-option v-for="region in regionOptions" :key="region" :label="region" :value="region" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="detail-form-item" label="详细地址" required>
          <div class="address-textarea">
            <el-input
              v-model="addressForm.receiver.detail"
              placeholder="请输入详细地址(如省市区没填，详细地址请包含省市区)"
              :rows="3"
              type="textarea"
            />
            <el-button :icon="Location" circle class="map-button" type="primary" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addressDialogVisible = false">取消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitAddress">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="routeDialogVisible" title="物流路由" width="640px">
      <el-timeline>
        <el-timeline-item timestamp="2026-03-24 14:43">快递单已创建，等待快递员上门。</el-timeline-item>
        <el-timeline-item timestamp="2026-03-24 16:08">快件已揽收，发往分拨中心。</el-timeline-item>
        <el-timeline-item timestamp="2026-03-25 09:12">快件到达廊坊转运中心。</el-timeline-item>
      </el-timeline>
      <template #footer>
        <el-button type="primary" @click="routeDialogVisible = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, ArrowUp, CopyDocument, Download, Location, Plus, Printer, Refresh } from '@element-plus/icons-vue'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'

type AddressInfo = {
  contact: string
  phone: string
  region: string
  detail: string
}

type LogisticsRow = {
  id: number
  tenantName: string
  orderNo: string
  brand: string
  merchant: string
  type: '寄件' | '取件'
  company: string
  logisticsNo: string
  sender: string
  receiver: string
  quantity: string
  weight: string
}

type CreateForm = {
  pickupTime: string
  company: string
  pickupType: string
  productType: string
  sender: AddressInfo
  receiver: AddressInfo
}

type AddressForm = CreateForm & {
  templateName: string
}

const companyOptions = ['顺丰', '京东']
const productOptions = ['衣物鞋子', '家纺', '行李箱', '易碎品', '其他']
const regionOptions = ['河北省 廊坊市 三河市', '北京市 北京市 朝阳区', '浙江省 杭州市 富阳区', '河北省 唐山市 路北区']

const expanded = ref(true)
const queryLoading = ref(false)
const submitLoading = ref(false)
const createDialogVisible = ref(false)
const addressDialogVisible = ref(false)
const routeDialogVisible = ref(false)
const selectedRows = ref<LogisticsRow[]>([])

const query = reactive({
  orderNo: '',
  customerCode: '',
  company: '',
  logisticsNo: '',
  sender: '',
  receiver: '',
  dateRange: ['2026-03-09', '2026-03-24'],
})

const rows = ref<LogisticsRow[]>([
  {
    id: 1,
    tenantName: 'D0174-北京盛峰雅洁清洗服务有限公司',
    orderNo: '260321141648076113709',
    brand: '比在',
    merchant: '比在-河北工厂',
    type: '寄件',
    company: '顺丰',
    logisticsNo: 'SF5125489101420',
    sender: '河北(廊坊/三河市)-洗衣工厂 17521239989 河北省 廊坊市 三河市 河北省廊坊市三河市燕郊镇天山国际创业基地17号（雅洁洗衣工厂）雅洁',
    receiver: '司新梅 18612720061 河北省 廊坊市 香河县河北省廊坊市香河县蒋辛屯镇花语城小区19号楼1单元1604',
    quantity: '1',
    weight: '-',
  },
  {
    id: 2,
    tenantName: 'D0174-北京盛峰雅洁清洗服务有限公司',
    orderNo: '260324135242591128837',
    brand: '比在',
    merchant: '比在-河北工厂',
    type: '取件',
    company: '顺丰',
    logisticsNo: 'SF5132314110882',
    sender: '葛 13611025175 北京市 北京市 朝阳区 北京市朝阳区劲松街道农光东里29号楼三单元1102室',
    receiver: '比在 17521239989 河北省 廊坊市 三河市河北省廊坊市三河市燕郊镇天山国际创业基地17号（雅洁洗衣工厂）雅洁',
    quantity: '-',
    weight: '-',
  },
  {
    id: 3,
    tenantName: 'D0174-北京盛峰雅洁清洗服务有限公司',
    orderNo: '260303114644723900917',
    brand: '比在',
    merchant: '比在-河北工厂',
    type: '寄件',
    company: '顺丰',
    logisticsNo: 'SF5132314193035',
    sender: '河北(廊坊/三河市)-洗衣工厂 17521239989 河北省 廊坊市 三河市 河北省廊坊市三河市燕郊镇天山国际创业基地17号（雅洁洗衣工厂）雅洁',
    receiver: '吴宁 18330572345 河北省 唐山市 路北区河北省唐山市路北区学院路景泰翰林603号楼603栋2门1902',
    quantity: '1',
    weight: '-',
  },
  {
    id: 4,
    tenantName: 'D0174-北京盛峰雅洁清洗服务有限公司',
    orderNo: '260324134246359721037',
    brand: '比在',
    merchant: '比在-河北工厂',
    type: '取件',
    company: '顺丰',
    logisticsNo: 'SF5132317919902',
    sender: '刘 19931333086 河北省 廊坊市 安次区 河北省廊坊市安次区德荣帝景小区22号楼三单元1902',
    receiver: '比在 17521239989 河北省 廊坊市 三河市河北省廊坊市三河市燕郊镇天山国际创业基地17号（雅洁洗衣工厂）雅洁',
    quantity: '-',
    weight: '-',
  },
  {
    id: 5,
    tenantName: 'D0174-北京盛峰雅洁清洗服务有限公司',
    orderNo: '26032114544892335305',
    brand: '比在',
    merchant: '比在-江浙沪皖',
    type: '寄件',
    company: '京东',
    logisticsNo: 'JDVC35541352939',
    sender: '台州诚聚 13575932873 浙江省 台州市 仙居县 浙江台州市仙居县下各镇永泰南路8号1号楼5楼景德轩工艺品厂',
    receiver: '盛小钢 15068130315 浙江省 杭州市 富阳区浙江省杭州市富阳区横凉亭路165号凌克汽车165号',
    quantity: '1',
    weight: '-',
  },
])

const createFormRef = ref<FormInstance>()
const addressFormRef = ref<FormInstance>()

const createForm = reactive<CreateForm>({
  pickupTime: '2026-03-24 14:43',
  company: '',
  pickupType: '',
  productType: '衣物鞋子',
  sender: createEmptyAddress(),
  receiver: createEmptyAddress(),
})

const addressForm = reactive<AddressForm>({
  templateName: '',
  pickupTime: '',
  company: '',
  pickupType: '',
  productType: '衣物鞋子',
  sender: createEmptyAddress(),
  receiver: createEmptyAddress(),
})

const createRules = reactive<FormRules<CreateForm>>({
  pickupTime: [{ required: true, message: '请选择上门时间', trigger: 'change' }],
  company: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  pickupType: [{ required: true, message: '请选择取寄类型', trigger: 'change' }],
  productType: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
})

const addressRules = reactive<FormRules<AddressForm>>({
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  company: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  pickupType: [{ required: true, message: '请选择取寄类型', trigger: 'change' }],
  productType: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
})

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    return (
      (!query.orderNo || row.orderNo.includes(query.orderNo)) &&
      (!query.company || row.company === query.company) &&
      (!query.logisticsNo || row.logisticsNo.includes(query.logisticsNo)) &&
      (!query.sender || row.sender.includes(query.sender)) &&
      (!query.receiver || row.receiver.includes(query.receiver))
    )
  })
})

function createEmptyAddress(): AddressInfo {
  return { contact: '', phone: '', region: '', detail: '' }
}

function openCreateDialog() {
  createDialogVisible.value = true
}

function openAddressDialog() {
  addressDialogVisible.value = true
}

function loadLogistics() {
  queryLoading.value = true
  window.setTimeout(() => {
    queryLoading.value = false
    ElMessage.success('查询完成')
  }, 300)
}

function resetQuery() {
  query.orderNo = ''
  query.customerCode = ''
  query.company = ''
  query.logisticsNo = ''
  query.sender = ''
  query.receiver = ''
  query.dateRange = ['2026-03-09', '2026-03-24']
}

function handleExport() {
  ElMessage.success('物流数据已开始导出')
}

async function submitCreate() {
  if (!(await createFormRef.value?.validate())) return
  submitLoading.value = true
  window.setTimeout(() => {
    submitLoading.value = false
    createDialogVisible.value = false
    ElMessage.success('快递单创建成功')
  }, 300)
}

async function submitAddress() {
  if (!(await addressFormRef.value?.validate())) return
  submitLoading.value = true
  window.setTimeout(() => {
    submitLoading.value = false
    addressDialogVisible.value = false
    ElMessage.success('地址簿已新增')
  }, 300)
}

function swapAddress() {
  const sender = { ...createForm.sender }
  createForm.sender = { ...createForm.receiver }
  createForm.receiver = sender
}

function swapAddressBook() {
  const sender = { ...addressForm.sender }
  addressForm.sender = { ...addressForm.receiver }
  addressForm.receiver = sender
}

function copyText(text: string) {
  void navigator.clipboard?.writeText(text)
  ElMessage.success('已复制')
}

function openRoute(row: LogisticsRow) {
  void row
  routeDialogVisible.value = true
}

function createAgain(row: LogisticsRow) {
  createForm.company = row.company
  createForm.pickupType = row.type === '寄件' ? '寄件(工厂->客户)' : '取件(客户->工厂)'
  createDialogVisible.value = true
}

function saveAddress(row: LogisticsRow) {
  addressForm.company = row.company
  addressForm.pickupType = row.type === '寄件' ? '寄件(工厂->客户)' : '取件(客户->工厂)'
  addressDialogVisible.value = true
}

async function cancelLogistics(row: LogisticsRow) {
  await ElMessageBox.confirm(`确认取消物流单 ${row.logisticsNo} 吗？`, '取消物流', {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    type: 'warning',
  })
  ElMessage.success('物流单已取消')
}
</script>

<style scoped>
.logistics-page {
  color: var(--yx-text-primary);
}

.logistics-filter {
  padding-bottom: 4px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 18px;
  align-items: start;
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

.page-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.left-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dashed-button {
  color: var(--yx-primary);
  border-style: dashed;
  border-color: var(--yx-primary);
}

.logistics-table {
  width: 100%;
}

.logistics-table :deep(.el-table__cell) {
  padding: 12px 0;
}

.sort-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  background: #2f4a60;
  border-radius: 50%;
}

.copy-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: var(--yx-primary);
  font: inherit;
  line-height: 1.5;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.copy-link.muted {
  color: var(--yx-text-regular);
}

.address-cell {
  line-height: 1.65;
  text-align: center;
  word-break: break-all;
}

.row-actions {
  display: grid;
  justify-items: center;
  gap: 2px;
}

.logistics-dialog :deep(.el-dialog__body) {
  padding-top: 8px;
}

.logistics-dialog :deep(.el-select),
.logistics-dialog :deep(.el-date-editor) {
  width: 100%;
}

.form-section-title,
.swap-line {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  margin: 8px 0 18px;
  color: var(--yx-text-primary);
  font-weight: 700;
}

.form-section-title span,
.swap-line::before,
.swap-line::after {
  height: 1px;
  background: var(--yx-border);
  content: "";
}

.dialog-grid {
  display: grid;
  gap: 14px;
}

.top-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.address-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.detail-form-item {
  margin-bottom: 26px;
}

.address-textarea {
  position: relative;
  width: 100%;
}

.map-button {
  position: absolute;
  right: 8px;
  bottom: 8px;
}

.swap-line {
  grid-template-columns: 1fr auto auto 1fr;
  margin-top: 0;
}

.swap-line::before {
  grid-column: 1;
}

.swap-line::after {
  grid-column: 4;
}

@media (max-width: 1400px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
