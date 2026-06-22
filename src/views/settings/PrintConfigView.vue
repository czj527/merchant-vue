<template>
  <YxCard class="print-page">
    <el-button type="primary" @click="downloadPlugin">下载打印机控件</el-button>
    <el-tabs v-model="activeTab" class="print-tabs">
      <el-tab-pane label="水洗唛打印设置" name="wash" />
      <el-tab-pane label="快递单打印设置" name="express" />
      <el-tab-pane label="合格证打印配置" name="certificate" />
      <el-tab-pane label="门店打印配置" name="store" />
    </el-tabs>

    <el-form label-position="top" class="print-form">
      <el-form-item label="打印机" required><el-select v-model="printer" clearable placeholder="请选择打印机"><el-option label="YX-Printer-01" value="YX-Printer-01" /></el-select></el-form-item>
      <template v-if="activeTab === 'wash'">
        <el-form-item label="水洗唛类打印型" required><div class="template-grid small"><LabelCard type="barcode" size="100mm * 20mm" /><LabelCard type="qr" size="100mm * 20mm" /></div></el-form-item>
      </template>
      <template v-else-if="activeTab === 'express'">
        <div class="carrier-row"><span>SF 顺丰快递</span><span>JD 京东快递</span><span>邮政快递</span><span>德邦快递</span></div>
        <el-form-item label="顺丰面单尺寸" required><el-select v-model="expressSize" clearable placeholder="请选择打印机"><el-option label="100mm * 150mm" value="100mm * 150mm" /></el-select></el-form-item>
      </template>
      <template v-else-if="activeTab === 'certificate'">
        <el-form-item label="合格证打印类型" required><div class="template-grid"><LabelCard type="barcode" size="80mm * 40mm" /><LabelCard type="qr" size="80mm * 40mm" /><LabelCard type="vertical" size="60mm * 40mm" /><LabelCard type="short" size="50mm * 40mm" /></div></el-form-item>
      </template>
      <template v-else>
        <el-form-item label="打印机" required><el-select v-model="storePrinter" clearable placeholder="请选择打印机"><el-option label="门店打印机" value="门店打印机" /></el-select></el-form-item>
      </template>
    </el-form>
    <el-button type="primary" @click="saveConfig">保存</el-button>
  </YxCard>
</template>

<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { ElMessage } from 'element-plus'
import YxCard from '@/components/base/YxCard.vue'

const activeTab = ref('wash')
const printer = ref('')
const expressSize = ref('')
const storePrinter = ref('')
const LabelCard = defineComponent({
  props: { type: { type: String, default: 'barcode' }, size: { type: String, required: true } },
  setup(props) {
    return () => h('div', { class: 'template-card' }, [h('div', { class: ['label-preview', `is-${props.type}`] }, [h('div', { class: 'barcode' }), h('strong', 'A13'), h('p', '123456789　11.01'), h('p', '羽绒服　3　1/3　黑色'), h('b', '商家简称')]), h('span', props.size)])
  },
})
function saveConfig() { ElMessage.success('打印配置已保存') }
function downloadPlugin() { ElMessage.success('控件下载已模拟') }
</script>

<style scoped>
.print-page{min-height:430px}.print-tabs{margin-top:14px}.print-form{max-width:1400px}.print-form :deep(.el-select){width:440px}.template-grid{display:grid;grid-template-columns:repeat(4,320px);gap:16px}.template-grid.small{grid-template-columns:repeat(2,440px)}.template-card{padding:14px;border:1px solid var(--yx-border);border-radius:var(--yx-radius-sm);background:#fff}.label-preview{height:150px;padding:12px;border:2px solid #222;color:#111;background:#fff}.template-grid.small .label-preview{height:80px}.barcode{height:26px;margin-bottom:6px;background:repeating-linear-gradient(90deg,#111 0 3px,transparent 3px 7px)}.label-preview strong{float:right;font-size:28px}.label-preview p{margin:5px 0}.label-preview b{font-size:16px}.template-card span{display:block;margin-top:8px;color:var(--yx-text-secondary);text-align:center}.carrier-row{display:inline-flex;margin:8px 0 28px;border:1px solid var(--yx-border);border-radius:var(--yx-radius-sm);overflow:hidden}.carrier-row span{padding:12px 22px;border-right:1px solid var(--yx-border)}.carrier-row span:last-child{border-right:0}
</style>
