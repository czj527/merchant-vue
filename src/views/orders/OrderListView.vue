<template>
  <div>
    <PageHeader title="订单列表" description="按渠道、状态、工厂和时间快速检索订单，支持新建订单、修改订单与物流信息。">
      <template #extra>
        <el-button :loading="exportLoading" @click="handleExport">导出订单</el-button>
        <el-button type="primary" @click="openCreateOrder">+ 新建订单</el-button>
        <el-button :disabled="selectedRows.length === 0" @click="batchVisible = true">批量上门</el-button>
      </template>
    </PageHeader>

    <div class="filter-card order-filter">
      <el-form :model="query" label-width="82px">
        <el-row :gutter="28">
          <el-col :span="6"><el-form-item label="订单号"><el-input v-model="query.keyword" clearable placeholder="请输入订单号或者第三方订单号" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="品牌/商户"><el-select v-model="query.brandMerchant" clearable placeholder="请选择"><el-option label="净贝贝" value="净贝贝" /><el-option label="鲸蚁生活" value="鲸蚁生活" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="商户"><el-select v-model="query.merchant" clearable placeholder="请选择"><el-option label="净贝贝-河南" value="净贝贝-河南" /><el-option label="净贝贝-安徽省" value="净贝贝-安徽省" /></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="工厂状态"><el-select v-model="query.factoryStatus" clearable placeholder="请选择"><el-option label="已分配" value="assigned" /><el-option label="未分配" value="pending" /></el-select></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="套餐名"><el-input v-model="query.packageName" clearable placeholder="模糊查询" /></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="洗护工厂"><el-select v-model="query.factory" clearable placeholder="请选择"><el-option label="河南(郑州)-洗衣工厂" value="0307" /><el-option label="安徽省(合肥市/长丰县)-洗衣工厂" value="0679" /></el-select></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="用户信息"><el-input v-model="query.userInfo" clearable placeholder="请输入" /></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="手机号"><el-input v-model="query.phone" clearable placeholder="请输入下单/取件手机号或尾号" /></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="是否反洗"><el-select v-model="query.rewash" clearable placeholder="请选择"><el-option label="是" value="yes" /><el-option label="否" value="no" /></el-select></el-form-item></el-col>
          <el-col v-if="expanded" :span="6"><el-form-item label="创建时间"><el-date-picker v-model="query.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" /></el-form-item></el-col>
        </el-row>
        <div class="filter-actions">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" :loading="loading" @click="loadOrders">查询</el-button>
          <el-button text type="primary" @click="expanded = !expanded">{{ expanded ? '收起' : '展开' }}</el-button>
        </div>
      </el-form>
    </div>

    <YxCard>
      <div class="toolbar-row">
        <el-tabs v-model="activeChannel" class="channel-tabs">
          <el-tab-pane v-for="channel in channels" :key="channel" :label="channel" :name="channel" />
        </el-tabs>
      </div>
      <div class="status-row">
        <button v-for="status in statusTabs" :key="status.name" :class="['status-pill', { active: activeStatus === status.name }]" @click="activeStatus = status.name">{{ status.label }}({{ status.count }})</button>
      </div>

      <el-table v-loading="loading" :data="orderRows" row-key="id" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="48" />
        <el-table-column label="订单号" min-width="260">
          <template #default="{ row }">
            <div class="order-no-cell"><span class="mini-tag">鲸蚁</span><a class="linkish" @click.stop="router.push('/orders/' + row.id)">{{ row.orderNo }}</a><span class="copy-mark">▣</span></div>
            <div class="muted-line"><span class="mini-tag">三方</span>{{ row.thirdNo }}<span class="copy-mark">▣</span></div>
            <div class="muted-line"><span class="mini-tag">平台</span>{{ row.platformNo }}<span class="copy-mark">▣</span></div>
          </template>
        </el-table-column>
        <el-table-column label="品牌/商户" min-width="190">
          <template #default="{ row }"><div><span class="mini-tag">品牌</span>{{ row.brand }}</div><div><span class="mini-tag">商户</span>{{ row.merchant }}</div><div><span class="mini-tag">物流</span><StatusTag label="需要" type="primary" /></div></template>
        </el-table-column>
        <el-table-column label="在厂时间" width="90"><template #default>-</template></el-table-column>
        <el-table-column label="状态" width="140"><template #default="{ row }"><div><span class="mini-tag">订单</span><StatusTag :label="row.orderStatus" type="warning" /></div><div><span class="mini-tag">工厂</span><StatusTag :label="row.factoryStatus" type="primary" /></div></template></el-table-column>
        <el-table-column label="时间" min-width="180"><template #default="{ row }"><div><span class="mini-tag">预约</span><b>{{ row.reserveAt }}</b></div><div><span class="mini-tag">创建</span>{{ row.createdAt }}</div><div><span class="mini-tag">修改</span>{{ row.updatedAt }}</div></template></el-table-column>
        <el-table-column label="套餐名" min-width="230"><template #default="{ row }"><div><span class="mini-tag">套餐</span>{{ row.packageName }}</div><div><span class="mini-tag">件数</span>{{ row.itemCount }} 件</div><div><span class="mini-tag">订单</span>1 单</div></template></el-table-column>
        <el-table-column label="物流信息" min-width="220"><template #default="{ row }"><div><span class="mini-tag">收取</span><a class="linkish" @click.stop="openLogistics(row)">{{ row.pickupExpress }}</a><span class="copy-mark">▣</span></div><div><span class="mini-tag">配送</span>-</div></template></el-table-column>
        <el-table-column label="洗护工厂" min-width="190"><template #default="{ row }"><div><span class="mini-tag">工厂</span>{{ row.factory }}</div><div><span class="mini-tag">编号</span>{{ row.factoryCode }}</div></template></el-table-column>
        <el-table-column label="用户信息" min-width="170"><template #default="{ row }"><div><span class="mini-tag">用户</span><a class="linkish">{{ row.customerName }}</a></div><div><span class="mini-tag">手机</span><a class="linkish">{{ row.customerPhone }}</a></div></template></el-table-column>
        <el-table-column label="下单渠道" width="120"><template #default="{ row }"><StatusTag :label="row.channel" type="primary" /></template></el-table-column>
        <el-table-column label="费用" width="140"><template #default="{ row }"><div><span class="mini-tag">支付</span><b>¥{{ row.amount }}</b></div><div><span class="mini-tag">补差</span><b>¥0.00</b></div><div><span class="mini-tag">方式</span><b>线上</b></div></template></el-table-column>
        <el-table-column label="备注" min-width="160"><template #default><div><span class="mini-tag">客户</span>无</div><div><span class="mini-tag">商户</span>无</div><div><span class="mini-tag">取消</span>无</div></template></el-table-column>
        <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button text type="primary" @click.stop="openEditOrder(row)">修改</el-button><el-button text type="primary" @click.stop="openLogistics(row)">物流</el-button><el-button text type="primary" @click.stop="finishOrder">完成</el-button><el-dropdown><el-button text>...</el-button><template #dropdown><el-dropdown-menu><el-dropdown-item>取消</el-dropdown-item><el-dropdown-item>客户备注</el-dropdown-item></el-dropdown-menu></template></el-dropdown></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="orderDialogVisible" :title="orderDialogMode === 'create' ? '生成反洗单' : '修改订单信息'" width="900px" top="6vh" class="order-edit-dialog">
      <el-form ref="orderFormRef" :model="orderForm" :rules="orderRules" label-position="top" :disabled="submitLoading">
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="订单来源" prop="source" required><el-select v-model="orderForm.source" placeholder="请选择"><el-option label="自建渠道" value="自建渠道" /><el-option label="抖音(上门)" value="抖音(上门)" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="品牌" prop="brand" required><el-select v-model="orderForm.brand" placeholder="请选择"><el-option label="净贝贝" value="净贝贝" /><el-option label="鲸蚁生活" value="鲸蚁生活" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="商户" prop="merchant" required><el-select v-model="orderForm.merchant" placeholder="请选择"><el-option label="净贝贝-河南" value="净贝贝-河南" /><el-option label="净贝贝-安徽省" value="净贝贝-安徽省" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="手机号" prop="customerPhone" required><el-input v-model="orderForm.customerPhone" clearable placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="用户名"><el-input v-model="orderForm.customerName" clearable placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="账户余额(元)"><el-input v-model="orderForm.balance" disabled placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="套餐名称" prop="packageName" required><el-input v-model="orderForm.packageName" clearable placeholder="示例：1件衣服、2双鞋子" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="衣服件数"><el-input-number v-model="orderForm.itemCount" :min="1" style="width:100%" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="支付金额" prop="amount" required><el-input v-model="orderForm.amount" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="24"><div class="package-shortcuts"><b>衣鞋:</b><button v-for="item in packageShortcuts.clothes" :key="item" type="button" :class="{ active: orderForm.packageName.includes(item) }" @click="appendPackage(item)">{{ item }}</button><b>鞋靴:</b><button v-for="item in packageShortcuts.shoes" :key="item" type="button" @click="appendPackage(item)">{{ item }}</button><b>其它:</b><button v-for="item in packageShortcuts.other" :key="item" type="button" @click="appendPackage(item)">{{ item }}</button></div></el-col>
          <el-col :span="24"><el-form-item label="商家备注"><el-input v-model="orderForm.remark" type="textarea" :rows="4" placeholder="请输入洗护备注" /></el-form-item></el-col>
        </el-row>

        <div class="form-section-title">取件信息</div>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="上门时间" prop="pickupTime" required><el-date-picker v-model="orderForm.pickupTime" type="datetime" style="width:100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系人" prop="pickupName" required><el-input v-model="orderForm.pickupName" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系电话" prop="pickupPhone" required><el-input v-model="orderForm.pickupPhone" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="省市区"><el-select v-model="orderForm.pickupArea" placeholder="请选择"><el-option label="河南省 / 郑州市 / 金水区" value="河南省 / 郑州市 / 金水区" /><el-option label="安徽省 / 合肥市 / 长丰县" value="安徽省 / 合肥市 / 长丰县" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="详细地址" prop="pickupAddress" required><el-input v-model="orderForm.pickupAddress" type="textarea" :rows="3" placeholder="请输入详细地址" /><el-button class="parse-btn" type="primary" @click="parseAddress('pickup')">解析地址</el-button></el-form-item></el-col>
        </el-row>

        <div class="swap-title"><el-button type="primary" size="small" @click="swapAddress">交换</el-button><span>寄件信息</span><el-button type="primary" size="small" @click="copyPickup">复制</el-button></div>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="联系人" prop="deliveryName" required><el-input v-model="orderForm.deliveryName" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系电话" prop="deliveryPhone" required><el-input v-model="orderForm.deliveryPhone" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="省市区"><el-select v-model="orderForm.deliveryArea" placeholder="请选择"><el-option label="河南省 / 郑州市 / 金水区" value="河南省 / 郑州市 / 金水区" /><el-option label="安徽省 / 合肥市 / 长丰县" value="安徽省 / 合肥市 / 长丰县" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="详细地址" prop="deliveryAddress" required><el-input v-model="orderForm.deliveryAddress" type="textarea" :rows="3" placeholder="请输入详细地址" /><el-button class="parse-btn" type="primary" @click="parseAddress('delivery')">解析地址</el-button></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="orderDialogVisible = false">取消</el-button><el-button type="primary" :loading="submitLoading" @click="submitOrder">确定</el-button></template>
    </el-dialog>

    <el-dialog v-model="logisticsVisible" title="修改物流信息" width="900px" top="6vh" class="order-edit-dialog">
      <el-form :model="logisticsForm" label-position="top">
        <div class="form-section-title">取件信息</div>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="上门时间" required><el-date-picker v-model="logisticsForm.pickupTime" type="datetime" style="width:100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="物流公司"><el-select v-model="logisticsForm.company"><el-option label="京东" value="京东" /><el-option label="顺丰" value="顺丰" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="配送工厂"><el-select v-model="logisticsForm.deliveryFactory"><el-option label="(0307)河南(郑州)-洗衣工厂" value="0307" /><el-option label="(0679)安徽省(合肥市/长丰县)-洗衣工厂" value="0679" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系人" required><el-input v-model="logisticsForm.pickupName" clearable /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系电话" required><el-input v-model="logisticsForm.pickupPhone" clearable /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="省市区"><el-select v-model="logisticsForm.pickupArea"><el-option label="河南省 / 郑州市 / 金水区" value="河南省 / 郑州市 / 金水区" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="详细地址" required><el-input v-model="logisticsForm.pickupAddress" type="textarea" :rows="3" /><el-button class="parse-btn" type="primary" @click="parseAddress('pickup')">解析地址</el-button></el-form-item></el-col>
        </el-row>
        <div class="swap-title"><el-button type="primary" size="small" @click="swapLogistics">交换</el-button><span>寄件信息</span><el-button type="primary" size="small" @click="copyLogisticsPickup">复制</el-button></div>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="联系人" required><el-input v-model="logisticsForm.deliveryName" clearable /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系电话" required><el-input v-model="logisticsForm.deliveryPhone" clearable /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="省市区"><el-select v-model="logisticsForm.deliveryArea"><el-option label="河南省 / 郑州市 / 金水区" value="河南省 / 郑州市 / 金水区" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="详细地址" required><el-input v-model="logisticsForm.deliveryAddress" type="textarea" :rows="3" /><el-button class="parse-btn" type="primary" @click="parseAddress('delivery')">解析地址</el-button></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="logisticsVisible = false">取消</el-button><el-button type="danger" @click="logisticsVisible = false">修改并重新上门</el-button><el-button type="primary" @click="logisticsVisible = false">修改</el-button></template>
    </el-dialog>

    <el-dialog v-model="memberVisible" title="会员/取寄信息" width="620px"><el-descriptions :column="1" border><el-descriptions-item label="会员">{{ currentMember }}</el-descriptions-item><el-descriptions-item label="联系电话">138****0001</el-descriptions-item><el-descriptions-item label="取件地址">河南省郑州市金水区</el-descriptions-item></el-descriptions><template #footer><el-button type="primary" @click="memberVisible=false">知道了</el-button></template></el-dialog>
    <el-dialog v-model="batchVisible" title="批量上门" width="520px"><el-alert title="可对勾选订单批量发起上门。" type="info" show-icon :closable="false" /><template #footer><el-button @click="batchVisible=false">取消</el-button><el-button type="primary" @click="batchVisible=false">确认</el-button></template></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { createOrder, getOrders } from '@/services'
import type { Order } from '@/types/order'

type OrderRow = Order & {
  thirdNo: string
  platformNo: string
  brand: string
  merchant: string
  orderStatus: string
  factoryStatus: string
  reserveAt: string
  updatedAt: string
  packageName: string
  pickupExpress: string
  factory: string
  factoryCode: string
  channel: string
}

const router = useRouter()
const loading = ref(false)
const exportLoading = ref(false)
const submitLoading = ref(false)
const expanded = ref(true)
const orders = ref<OrderRow[]>([])
const selectedRows = ref<OrderRow[]>([])
const activeChannel = ref('全部')
const activeStatus = ref('全部')
const memberVisible = ref(false)
const logisticsVisible = ref(false)
const batchVisible = ref(false)
const orderDialogVisible = ref(false)
const orderDialogMode = ref<'create' | 'edit'>('create')
const currentMember = ref('奶昔')
const orderFormRef = ref<FormInstance>()
const editingOrder = ref<OrderRow | null>(null)
const query = reactive({ keyword: '', brandMerchant: '', merchant: '', factoryStatus: '', packageName: '', factory: '', userInfo: '', phone: '', rewash: '', dateRange: [] as string[] })
const orderForm = reactive({ source: '自建渠道', brand: '', merchant: '', customerPhone: '', customerName: '', balance: '', packageName: '', itemCount: 1, amount: '', remark: '', pickupTime: '2026-06-22 10:48', pickupName: '', pickupPhone: '', pickupArea: '', pickupAddress: '', deliveryName: '', deliveryPhone: '', deliveryArea: '', deliveryAddress: '' })
const logisticsForm = reactive({ pickupTime: '2026-06-22 10:00', company: '京东', deliveryFactory: '(0307)河南(郑州)-洗衣工厂', pickupName: '奶昔', pickupPhone: '15290734328', pickupArea: '河南省 / 郑州市 / 金水区', pickupAddress: '河南省郑州市金水区新世纪大厦2号楼4楼前台4楼', deliveryName: '奶昔', deliveryPhone: '15290734328', deliveryArea: '河南省 / 郑州市 / 金水区', deliveryAddress: '河南省郑州市金水区新世纪大厦2号楼4楼前台4楼' })
const orderRules: FormRules = { source: [{ required: true, message: '请选择订单来源', trigger: 'change' }], brand: [{ required: true, message: '请选择品牌', trigger: 'change' }], merchant: [{ required: true, message: '请选择商户', trigger: 'change' }], customerPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }], packageName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }], amount: [{ required: true, message: '请输入支付金额', trigger: 'blur' }], pickupTime: [{ required: true, message: '请选择上门时间', trigger: 'change' }], pickupName: [{ required: true, message: '请输入联系人', trigger: 'blur' }], pickupPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }], pickupAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }], deliveryName: [{ required: true, message: '请输入联系人', trigger: 'blur' }], deliveryPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }], deliveryAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }] }
const channels = ['全部', '门店', '微信小程序', '美团', '美团(到店)', '抖音', '抖音(到店)', '快手', '淘宝', '拼多多', '京东', '小红书', '代收点', '自建渠道']
const statusTabs = [
  { name: '全部', label: '全部', count: 4569 },
  { name: '待支付', label: '待支付', count: 0 },
  { name: '待预约', label: '待预约', count: 0 },
  { name: '已接单', label: '已接单', count: 1 },
  { name: '收取中', label: '收取中', count: 204 },
  { name: '待洗护', label: '待洗护', count: 118 },
  { name: '洗护中', label: '洗护中', count: 522 },
  { name: '配送中', label: '配送中', count: 239 },
  { name: '订单完成', label: '订单完成', count: 2994 },
  { name: '待退款', label: '待退款', count: 0 },
  { name: '已取消', label: '已取消', count: 422 },
]
const packageShortcuts = { clothes: ['任选1件', '任选2件', '任选3件', '任选4件', '任选5件', '任选6件'], shoes: ['鞋靴1双', '鞋靴2双', '鞋靴3双', '鞋靴4双', '鞋靴5双', '鞋靴6双'], other: ['精洗1件', '精洗1鞋', '1件皮毛', '1普通包', '1奢侈包', '1副窗帘'] }
const orderRows = computed(() => orders.value.filter((row) => activeStatus.value === '全部' || row.orderStatus === activeStatus.value))

function mapOrder(row: Order, index: number): OrderRow {
  const factories = ['河南(郑州)-洗衣工厂', '安徽省(合肥市/长丰县)-洗衣工厂', '浙江(台州/仙居县/下各镇)-洗衣工厂', '重庆(合川)-洗衣工厂']
  const factoryCodes = ['0307', '0679', '0290', '0197']
  return { ...row, thirdNo: `202606${String(index + 1).padStart(8, '0')}`, platformNo: `1111${String(45268151063944 + index)}`, brand: '净贝贝', merchant: ['净贝贝-河南', '净贝贝-安徽省', '净贝贝-浙江上海', '净贝贝-四川重庆'][index % 4], orderStatus: '待取件', factoryStatus: '已分配', reserveAt: index % 4 === 3 ? '2026-06-22 18:00' : '2026-06-22 10:00', updatedAt: '2026-06-22 09:48', packageName: index % 2 ? '【10W+人选择/京东取送】5双鞋子清洗' : '【马年特惠·免费上门取送】3双鞋子清洗', pickupExpress: `JDX05568${String(2661416 + index * 8731)}`, factory: factories[index % factories.length], factoryCode: factoryCodes[index % factoryCodes.length], channel: '抖音小程序' }
}
async function loadOrders() { loading.value = true; try { orders.value = (await getOrders({ keyword: query.keyword, page: 1, pageSize: 20 })).list.map(mapOrder) } finally { loading.value = false } }
function resetQuery() { Object.assign(query, { keyword: '', brandMerchant: '', merchant: '', factoryStatus: '', packageName: '', factory: '', userInfo: '', phone: '', rewash: '', dateRange: [] }); void loadOrders() }
function handleSelectionChange(rows: OrderRow[]) { selectedRows.value = rows }
function openCreateOrder() { orderDialogMode.value = 'create'; editingOrder.value = null; Object.assign(orderForm, { source: '自建渠道', brand: '', merchant: '', customerPhone: '', customerName: '', balance: '', packageName: '', itemCount: 1, amount: '', remark: '', pickupTime: '2026-06-22 10:48', pickupName: '', pickupPhone: '', pickupArea: '', pickupAddress: '', deliveryName: '', deliveryPhone: '', deliveryArea: '', deliveryAddress: '' }); orderDialogVisible.value = true }
function openEditOrder(row: OrderRow) { orderDialogMode.value = 'edit'; editingOrder.value = row; Object.assign(orderForm, { source: '抖音(上门)', brand: row.brand, merchant: row.merchant, customerPhone: row.customerPhone, customerName: row.customerName, balance: '', packageName: row.packageName, itemCount: row.itemCount, amount: String(row.amount), remark: '', pickupTime: row.reserveAt, pickupName: row.customerName, pickupPhone: row.customerPhone, pickupArea: '河南省 / 郑州市 / 金水区', pickupAddress: '河南省郑州市金水区新世纪大厦2号楼4楼前台4楼', deliveryName: row.customerName, deliveryPhone: row.customerPhone, deliveryArea: '河南省 / 郑州市 / 金水区', deliveryAddress: '河南省郑州市金水区新世纪大厦2号楼4楼前台4楼' }); orderDialogVisible.value = true }
function openLogistics(row: OrderRow) { Object.assign(logisticsForm, { pickupTime: row.reserveAt, pickupName: row.customerName, pickupPhone: row.customerPhone, deliveryName: row.customerName, deliveryPhone: row.customerPhone }); logisticsVisible.value = true }
function appendPackage(item: string) { orderForm.packageName = orderForm.packageName ? `${orderForm.packageName} ${item}` : item }
function parseAddress(type: 'pickup' | 'delivery') { ElMessage.success(type === 'pickup' ? '取件地址解析完成' : '寄件地址解析完成') }
function copyPickup() { orderForm.deliveryName = orderForm.pickupName; orderForm.deliveryPhone = orderForm.pickupPhone; orderForm.deliveryArea = orderForm.pickupArea; orderForm.deliveryAddress = orderForm.pickupAddress; ElMessage.success('已复制取件信息') }
function swapAddress() { const pickup = { name: orderForm.pickupName, phone: orderForm.pickupPhone, area: orderForm.pickupArea, address: orderForm.pickupAddress }; orderForm.pickupName = orderForm.deliveryName; orderForm.pickupPhone = orderForm.deliveryPhone; orderForm.pickupArea = orderForm.deliveryArea; orderForm.pickupAddress = orderForm.deliveryAddress; orderForm.deliveryName = pickup.name; orderForm.deliveryPhone = pickup.phone; orderForm.deliveryArea = pickup.area; orderForm.deliveryAddress = pickup.address; ElMessage.success('取寄信息已交换') }
function copyLogisticsPickup() { logisticsForm.deliveryName = logisticsForm.pickupName; logisticsForm.deliveryPhone = logisticsForm.pickupPhone; logisticsForm.deliveryArea = logisticsForm.pickupArea; logisticsForm.deliveryAddress = logisticsForm.pickupAddress; ElMessage.success('已复制取件信息') }
function swapLogistics() { const pickup = { name: logisticsForm.pickupName, phone: logisticsForm.pickupPhone, area: logisticsForm.pickupArea, address: logisticsForm.pickupAddress }; logisticsForm.pickupName = logisticsForm.deliveryName; logisticsForm.pickupPhone = logisticsForm.deliveryPhone; logisticsForm.pickupArea = logisticsForm.deliveryArea; logisticsForm.pickupAddress = logisticsForm.deliveryAddress; logisticsForm.deliveryName = pickup.name; logisticsForm.deliveryPhone = pickup.phone; logisticsForm.deliveryArea = pickup.area; logisticsForm.deliveryAddress = pickup.address; ElMessage.success('取寄信息已交换') }
function finishOrder() { ElMessage.success('订单已完成') }
async function submitOrder() { if (submitLoading.value) return; await orderFormRef.value?.validate(); submitLoading.value = true; try { if (orderDialogMode.value === 'create') await createOrder(); await new Promise((resolve) => window.setTimeout(resolve, 400)); ElMessage.success(orderDialogMode.value === 'create' ? '订单创建成功' : '订单修改成功'); orderDialogVisible.value = false; void loadOrders() } finally { submitLoading.value = false } }
async function handleExport() { if (exportLoading.value) return; exportLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('导出任务已创建') } finally { exportLoading.value = false } }
onMounted(loadOrders)
</script>

<style scoped>
.order-filter { margin-bottom: 12px; }
.filter-actions { display: flex; justify-content: flex-end; gap: 8px; }
.toolbar-row { display: flex; align-items: center; justify-content: space-between; }
.channel-tabs { flex: 1; }
.status-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 12px; }
.status-pill { height: 32px; padding: 0 14px; border: 1px solid #d8e6ff; color: #41556f; background: #fff; border-radius: 18px; cursor: pointer; }
.status-pill.active { color: var(--yx-primary); border-color: var(--yx-primary); background: var(--yx-primary-soft); }
.order-no-cell, .muted-line { line-height: 1.75; }
.muted-line { color: var(--yx-text-regular); }
.mini-tag { display: inline-flex; align-items: center; margin-right: 6px; padding: 1px 6px; color: #51657e; background: #eef3f9; border-radius: 4px; font-size: 12px; }
.copy-mark { margin-left: 4px; color: var(--yx-primary); font-size: 12px; }
.linkish { color: var(--yx-primary); cursor: pointer; }
.form-section-title, .swap-title { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 18px 0 14px; color: var(--yx-text-primary); font-weight: 600; }
.form-section-title::before, .form-section-title::after, .swap-title::before, .swap-title::after { content: ''; flex: 1; height: 1px; background: var(--yx-border); }
.package-shortcuts { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; margin: -4px 0 12px; color: var(--yx-text-primary); }
.package-shortcuts button { border: 0; background: transparent; color: var(--yx-text-primary); cursor: pointer; }
.package-shortcuts button.active { padding: 3px 8px; color: #fff; background: var(--yx-primary); border-radius: 4px; }
.parse-btn { float: right; margin-top: 8px; }
:deep(.order-edit-dialog .el-dialog__body) { max-height: 70vh; overflow: auto; }
</style>
