<template>
  <div>
    <ModuleTable title="抖音商品" description="维护抖音渠道商品、规格、价格与上架状态。" :columns="columns" :rows="products" :keyword-fields="['name', 'sku', 'category']" secondary-action-text="批量上下架" danger-action-text="删除" row-action-text="编辑" />

    <div class="page-actions">
      <el-button type="primary" @click="openDialog()">新增商品</el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="新建商品" width="1220px" class="product-dialog">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" :disabled="submitLoading">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="应用" prop="app">
              <el-select v-model="form.app" placeholder="请选择应用">
                <el-option label="鲸蚁生活" value="鲸蚁生活" />
                <el-option label="鲸蚁洗护" value="鲸蚁洗护" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品类目" prop="category">
              <el-select v-model="form.category" placeholder="请选择商品类目">
                <el-option label="家清日用" value="家清日用" />
                <el-option label="洗衣护理" value="洗衣护理" />
                <el-option label="生活服务" value="生活服务" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否测试品">
              <el-switch v-model="form.isTest" inline-prompt active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名" prop="name">
              <el-input v-model="form.name" placeholder="请输入商品名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收款方式">
              <el-radio-group v-model="form.paymentMode">
                <el-radio label="总店结算">总店结算</el-radio>
                <el-radio label="分店结算">分店结算</el-radio>
                <el-radio label="区域结算">区域结算</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投放渠道">
              <el-radio-group v-model="form.channelScope">
                <el-radio label="不限制">不限制</el-radio>
                <el-radio label="仅直播间可见">仅直播间可见</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-checkbox-group v-model="form.tags">
                <el-checkbox label="推荐(小程序首页)" />
                <el-checkbox label="热卖" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="市场价" prop="marketPrice">
              <el-input v-model="form.marketPrice" placeholder="请输入市场价" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售价" prop="salePrice">
              <el-input v-model="form.salePrice" placeholder="请输入售价" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库存">
              <el-input v-model="form.stock" placeholder="请输入库存" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="包含件数">
              <el-input v-model="form.containsCount" placeholder="请输入包含件数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售卖日期">
              <el-date-picker v-model="form.saleDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="自动延期">
              <el-switch v-model="form.autoExtend" inline-prompt active-text="开" inactive-text="关" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可消费日期">
              <el-date-picker v-model="form.consumeDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序">
              <el-input v-model="form.sort" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用门店">
              <el-select v-model="form.stores" multiple collapse-tags collapse-tags-tooltip placeholder="请选择适用门店">
                <el-option label="北京朝阳店" value="北京朝阳店" />
                <el-option label="上海虹口店" value="上海虹口店" />
                <el-option label="郑州中原店" value="郑州中原店" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-switch v-model="form.enabled" inline-prompt active-text="启用" inactive-text="停用" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卖点">
              <el-input v-model="form.highlight" placeholder="请输入卖点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="media-row">
          <el-col :span="8">
            <el-form-item label="列表商品图">
              <div class="image-uploader single"><el-icon><Plus /></el-icon><span>上传图片</span></div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品图片">
              <div class="image-uploader multiple"><el-icon><Plus /></el-icon><span>上传图片</span></div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="环境图片">
              <div class="image-uploader multiple"><el-icon><Plus /></el-icon><span>上传图片</span></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品详细说明">
              <div class="rich-editor"><div class="editor-toolbar"><span>富文本编辑器</span><span class="toolbar-tip">支持多图与格式化</span></div><div class="editor-body">请输入商品详细说明</div></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用规则说明">
              <div class="rich-editor"><div class="editor-toolbar"><span>富文本编辑器</span><span class="toolbar-tip">支持多图与格式化</span></div><div class="editor-body">请输入使用规则说明</div></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import ModuleTable from '@/components/business/ModuleTable.vue';
import { products, statusMaps } from '@/mock/modules/module-data';
import type { TableColumnConfig } from '@/types/module'

const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  app: '',
  category: '',
  isTest: false,
  name: '',
  paymentMode: '总店结算',
  channelScope: '不限制',
  tags: [] as string[],
  marketPrice: '',
  salePrice: '',
  stock: '',
  containsCount: '',
  saleDate: [],
  autoExtend: false,
  consumeDate: [],
  sort: '',
  stores: [] as string[],
  enabled: true,
  highlight: '',
})
const rules: FormRules = {
  app: [{ required: true, message: '请选择应用', trigger: 'change' }],
  category: [{ required: true, message: '请选择商品类目', trigger: 'change' }],
  name: [{ required: true, message: '请输入商品名', trigger: 'blur' }],
  marketPrice: [{ required: true, message: '请输入市场价', trigger: 'blur' }],
  salePrice: [{ required: true, message: '请输入售价', trigger: 'blur' }],
}
const columns: TableColumnConfig[] = [
  { prop: 'name', label: '商品名称', minWidth: 180 },
  { prop: 'sku', label: 'SKU', width: 140 },
  { prop: 'category', label: '类目', width: 100 },
  { prop: 'price', label: '价格', width: 100, type: 'money' },
  { prop: 'dyPrice', label: '抖音价', width: 100, type: 'money' },
  { prop: 'status', label: '状态', width: 100, type: 'status', statusMap: statusMaps.publish },
]
function openDialog() { dialogVisible.value = true }
async function submit() {
  if (submitLoading.value) return
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    ElMessage.success('商品保存成功')
    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
.page-actions { display: flex; justify-content: flex-end; margin: 12px 0; }
.product-dialog :deep(.el-dialog__body) { padding-top: 10px; }
.media-row { margin-top: 2px; }
.image-uploader { height: 160px; border: 1px dashed var(--yx-border); border-radius: 10px; background: #fafcff; color: var(--yx-text-regular); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.image-uploader .el-icon { font-size: 22px; color: var(--yx-primary); }
.rich-editor { min-height: 160px; border: 1px solid var(--yx-border); border-radius: 10px; overflow: hidden; background: #fff; }
.editor-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--yx-border); background: #f8fbff; color: var(--yx-text-primary); font-size: 13px; }
.toolbar-tip { color: var(--yx-text-regular); }
.editor-body { min-height: 118px; padding: 12px; color: var(--yx-text-placeholder); }
</style>
