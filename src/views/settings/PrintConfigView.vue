<template>
  <div>
    <PageHeader title="打印配置" description="配置水洗唛、快递单、合格证和门店打印机模板。">
      <template #extra><el-button type="primary" :loading="downloadLoading" @click="downloadPlugin">下载打印机控件</el-button></template>
    </PageHeader>
    <YxCard>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="水洗唛打印设置" name="wash"><PrintSettingPanel title="水洗唛打印类型" :templates="washTemplates" /></el-tab-pane>
        <el-tab-pane label="快递单打印设置" name="express"><PrintSettingPanel title="快递单打印类型" :templates="expressTemplates" /></el-tab-pane>
        <el-tab-pane label="合格证打印配置" name="certificate"><PrintSettingPanel title="合格证打印类型" :templates="certificateTemplates" /></el-tab-pane>
        <el-tab-pane label="门店打印配置" name="store"><PrintSettingPanel title="门店打印类型" :templates="storeTemplates" /></el-tab-pane>
      </el-tabs>
      <el-button type="primary" :loading="saveLoading" class="save-btn" @click="saveConfig">保存</el-button>
    </YxCard>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const activeTab = ref('express'); const saveLoading = ref(false); const downloadLoading = ref(false)
const washTemplates = ['58mm * 40mm', '80mm * 40mm']
const expressTemplates = ['顺丰标准面单', '京东标准面单']
const certificateTemplates = ['80mm * 40mm', '80mm * 40mm 二维码', '60mm * 40mm 竖版', '50mm * 40mm']
const storeTemplates = ['门店小票', '订单交接单']
const PrintSettingPanel = defineComponent({ props: { title: { type: String, required: true }, templates: { type: Array<string>, required: true } }, setup(props) { return () => h('div', { class: 'print-panel' }, [h('div', { class: 'printer-select' }, [h('label', '打印机'), h('div', { class: 'select-mock' }, '请选择打印机')]), h('div', { class: 'print-title' }, props.title), h('div', { class: 'template-grid' }, props.templates.map((item, index) => h('div', { class: ['template-card', index === 0 ? 'is-active' : ''] }, [h('div', { class: 'label-preview' }, [h('div', { class: 'barcode' }), h('strong', 'A13'), h('p', '123456789　3　1/3　黑色'), h('p', '羽绒服　附件：内胆，帽子，带扣'), h('b', '商家简称')]), h('span', item)])))]) } })
async function saveConfig() { if (saveLoading.value) return; saveLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 600)); ElMessage.success('打印配置已保存') } finally { saveLoading.value = false } }
async function downloadPlugin() { if (downloadLoading.value) return; downloadLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 600)); ElMessage.success('控件下载已模拟') } finally { downloadLoading.value = false } }
</script>
<style scoped>
.save-btn { margin-top: 24px; }
:deep(.print-panel) { padding-top: 10px; }
:deep(.printer-select) { width: 420px; margin: 12px 0 26px; }
:deep(.printer-select label), :deep(.print-title) { display: block; margin-bottom: 10px; color: var(--yx-text-primary); font-weight: 600; }
:deep(.select-mock) { padding: 10px 12px; color: var(--yx-text-secondary); border: 1px solid var(--yx-border); border-radius: var(--yx-radius-md); }
:deep(.template-grid) { display: grid; grid-template-columns: repeat(4, 320px); gap: 16px; }
:deep(.template-card) { padding: 16px; border: 1px solid var(--yx-border); border-radius: var(--yx-radius-lg); background: #fff; }
:deep(.template-card.is-active) { border-color: var(--yx-primary); box-shadow: 0 0 0 2px var(--yx-primary-soft); }
:deep(.label-preview) { height: 150px; padding: 12px; border: 2px solid #222; color: #111; background: #fff; }
:deep(.barcode) { height: 28px; margin-bottom: 8px; background: repeating-linear-gradient(90deg, #111 0 3px, transparent 3px 7px); }
:deep(.label-preview strong) { float: right; font-size: 26px; }
:deep(.label-preview p) { margin: 6px 0; font-size: 13px; }
:deep(.label-preview b) { font-size: 16px; }
:deep(.template-card span) { display: block; margin-top: 8px; color: var(--yx-text-secondary); text-align: center; }
</style>
