<template>
  <div>
    <PageHeader title="订单详情" description="复刻原版订单详情的信息总览、衣物清单、下单信息、物流与外呼记录。">
      <template #extra>
        <el-button @click="router.back()">返回</el-button>
        <el-button @click="barcodeVisible = true">衣物条码</el-button>
        <el-button type="primary" :loading="remarkLoading" @click="saveRemark">保存备注</el-button>
        <el-dropdown>
          <el-button>更多</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>打印衣物条码</el-dropdown-item>
              <el-dropdown-item>发起售后</el-dropdown-item>
              <el-dropdown-item>取消订单</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </PageHeader>

    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else-if="order">
      <YxCard>
        <el-descriptions :column="4" border>
          <el-descriptions-item label="套餐名">【写本引流/全国免费取送】衣鞋任洗</el-descriptions-item>
          <el-descriptions-item label="商户名称">{{ order.merchantName }}</el-descriptions-item>
          <el-descriptions-item label="品牌名">优洗生活</el-descriptions-item>
          <el-descriptions-item label="分配工厂">河北(廊坊/三河市)-洗衣工厂(0459)</el-descriptions-item>
          <el-descriptions-item label="订单渠道">抖音(上门)</el-descriptions-item>
          <el-descriptions-item label="客户名称">{{ order.customerName }}</el-descriptions-item>
          <el-descriptions-item label="客户手机号"><span class="linkish">{{ order.customerPhone }}</span></el-descriptions-item>
          <el-descriptions-item label="订单号"><span class="linkish">{{ order.orderNo }}</span></el-descriptions-item>
          <el-descriptions-item label="下单件数">{{ order.itemCount }}</el-descriptions-item>
          <el-descriptions-item label="登记件数">{{ clothesRows.length }}</el-descriptions-item>
          <el-descriptions-item label="订单状态"><StatusTag :label="getOrderStatusMeta(order.status).label" :type="getOrderStatusMeta(order.status).type" /></el-descriptions-item>
          <el-descriptions-item label="工厂状态">已出厂</el-descriptions-item>
          <el-descriptions-item label="入场时间">2026-03-22 08:11:08</el-descriptions-item>
          <el-descriptions-item label="预检时间">2026-03-22 09:09:31</el-descriptions-item>
          <el-descriptions-item label="质检时间">2026-03-24 12:53:27</el-descriptions-item>
          <el-descriptions-item label="出厂时间">2026-03-24 13:53:45</el-descriptions-item>
        </el-descriptions>
        <el-input class="factory-remark" v-model="factoryRemark" type="textarea" :rows="2" placeholder="工厂备注，请输入内容" />
      </YxCard>

      <YxCard class="section-card">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="衣物清单" name="clothes">
            <el-table :data="clothesRows" border>
              <el-table-column prop="index" label="#" width="60" />
              <el-table-column prop="location" label="位置" width="90" />
              <el-table-column prop="type" label="类型" width="90" />
              <el-table-column prop="barcode" label="衣物条码" min-width="160"><template #default="{ row }"><span class="linkish" @click="barcodeVisible = true">{{ row.barcode }}</span></template></el-table-column>
              <el-table-column prop="name" label="衣物名称" width="110" />
              <el-table-column prop="color" label="颜色" width="90" />
              <el-table-column label="预检照片" width="130"><template #default><div class="cloth-thumb" @click="imageVisible = true"></div></template></el-table-column>
              <el-table-column prop="stain" label="瑕疵" min-width="180" />
              <el-table-column label="衣服状态" width="110"><template #default><StatusTag label="已出厂" type="primary" /></template></el-table-column>
              <el-table-column prop="attachment" label="附件" min-width="150" />
              <el-table-column prop="risk" label="洗护风险" width="120" />
              <el-table-column prop="washType" label="洗护类型" width="100" />
              <el-table-column prop="wash" label="是否洗护" width="100" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="下单信息" name="order"><el-descriptions :column="2" border><el-descriptions-item label="取件地址">{{ order.pickupAddress }}</el-descriptions-item><el-descriptions-item label="送回地址">{{ order.deliveryAddress }}</el-descriptions-item><el-descriptions-item label="支付状态">已支付</el-descriptions-item><el-descriptions-item label="订单金额">¥{{ order.amount }}</el-descriptions-item></el-descriptions></el-tab-pane>
          <el-tab-pane label="物流" name="logistics"><el-timeline><el-timeline-item timestamp="2026-03-22 08:11">取件快递已揽收</el-timeline-item><el-timeline-item timestamp="2026-03-24 13:53">工厂已出厂</el-timeline-item></el-timeline></el-tab-pane>
          <el-tab-pane label="外呼记录" name="call"><el-table :data="callRows"><el-table-column prop="time" label="时间" /><el-table-column prop="scene" label="场景" /><el-table-column prop="result" label="结果" /></el-table></el-tab-pane>
        </el-tabs>
      </YxCard>
    </template>
    <el-empty v-else description="未找到订单" />

    <el-dialog v-model="barcodeVisible" title="衣物条码" width="420px"><div class="barcode-box">045926032200068</div><template #footer><el-button @click="barcodeVisible=false">关闭</el-button><el-button type="primary">打印条码</el-button></template></el-dialog>
    <el-dialog v-model="imageVisible" title="衣物图片预览" width="720px"><div class="preview-large"></div><template #footer><el-button @click="imageVisible = false">关闭</el-button></template></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/business/PageHeader.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import YxCard from '@/components/base/YxCard.vue'
import { getOrderDetail } from '@/services'
import { getOrderStatusMeta, type Order } from '@/types/order'
const route = useRoute(); const router = useRouter(); const loading = ref(false); const remarkLoading = ref(false); const barcodeVisible = ref(false); const imageVisible = ref(false); const activeTab = ref('clothes'); const factoryRemark = ref(''); const order = ref<Order>()
const clothesRows = ref([{ index: 1, location: 'J73-C', type: '主件', barcode: '045926032200068', name: '运动鞋', color: '黑色', stain: '脏足洗,有渍,油渍', attachment: '另一只(045926032200068-1)', risk: '-', washType: '普洗', wash: '洗' }, { index: 2, location: 'J73-C', type: '主件', barcode: '045926032200070', name: '运动鞋', color: '灰色', stain: '脏足洗,油渍,有渍,折痕', attachment: '另一只(045926032200070-1)', risk: '-', washType: '普洗', wash: '洗' }, { index: 3, location: 'J73-C', type: '主件', barcode: '045926032200074', name: '羽绒服', color: '黑色', stain: '脏足洗,有渍,油渍', attachment: '帽子(045926032200074-1)', risk: '-', washType: '普洗', wash: '洗' }])
const callRows = [{ time: '2026-03-22 10:21', scene: '取件确认', result: '已接通' }, { time: '2026-03-24 14:10', scene: '出厂通知', result: '短信已发送' }]
async function loadDetail() { loading.value = true; try { order.value = await getOrderDetail(String(route.params.id)) } finally { loading.value = false } }
async function saveRemark() { if (remarkLoading.value) return; remarkLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 500)); ElMessage.success('备注已保存') } finally { remarkLoading.value = false } }
onMounted(loadDetail)
</script>

<style scoped>
.section-card, .factory-remark { margin-top: 16px; }
.linkish { color: var(--yx-primary); cursor: pointer; }
.cloth-thumb { width: 86px; height: 46px; border-radius: 4px; background: linear-gradient(135deg, #dfe7ef, #f8fafc); border: 1px solid var(--yx-border); cursor: pointer; }
.preview-large { height: 420px; border-radius: var(--yx-radius-lg); border: 1px solid var(--yx-border); background: linear-gradient(135deg, #f5f7fa, #dfe7ef); }
.barcode-box { padding: 28px; text-align: center; font-size: 22px; letter-spacing: 2px; border: 1px dashed var(--yx-border); border-radius: var(--yx-radius-lg); }
</style>
