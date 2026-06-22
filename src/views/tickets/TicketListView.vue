<template>
  <div>
    <PageHeader title="工单管理" description="管理售后、投诉和批量工单，支持快速筛选与批量处理。">
      <template #extra>
        <el-button type="primary" @click="dialogVisible = true">新建工单</el-button>
        <el-button @click="batchVisible = true">批量操作</el-button>
      </template>
    </PageHeader>
    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="工单号"><el-input v-model="query.keyword" placeholder="请输入" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="query.phone" placeholder="请输入手机号或后4位" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="query.type" clearable placeholder="请选择"><el-option label="售前类" value="pre" /><el-option label="售后类" value="after" /><el-option label="投诉类" value="complaint" /></el-select></el-form-item>
        <el-form-item><el-button @click="reset">重置</el-button><el-button type="primary" :loading="loading" @click="loadTickets">查询</el-button></el-form-item>
      </el-form>
      <el-tabs v-model="activeStatus" class="status-tabs">
        <el-tab-pane label="全部" name="全部" />
        <el-tab-pane label="新工单" name="新工单" />
        <el-tab-pane label="工单回复" name="工单回复" />
        <el-tab-pane label="超2小时未确认" name="超2小时未确认" />
        <el-tab-pane label="超24小时" name="超24小时" />
      </el-tabs>
      <el-table :data="rows" border>
        <el-table-column prop="ticketNo" label="工单号" min-width="170" />
        <el-table-column prop="status" label="工单状态" width="100" />
        <el-table-column prop="type" label="工单类型" width="110" />
        <el-table-column prop="level" label="工单等级" width="90" />
        <el-table-column prop="orderNo" label="订单号" min-width="160" />
        <el-table-column prop="origin" label="发起方" min-width="180" />
        <el-table-column prop="handler" label="处理方" width="100" />
        <el-table-column prop="title" label="工单标题" min-width="180" />
        <el-table-column label="操作" width="160"><template #default><el-button text type="primary" @click="dialogVisible = true">查看</el-button><el-button text type="primary" @click="dialogVisible = true">处理</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="dialogVisible" title="新建工单" width="680px"><el-form label-width="90px"><el-row :gutter="16"><el-col :span="12"><el-form-item label="工单类型"><el-select style="width:100%"><el-option label="售前类" value="pre" /><el-option label="售后类" value="after" /><el-option label="投诉类" value="complaint" /></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="工单等级"><el-select style="width:100%"><el-option label="一般" value="normal" /><el-option label="紧急" value="urgent" /></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="是否差评"><el-switch /></el-form-item></el-col><el-col :span="24"><el-form-item label="工单标题"><el-input /></el-form-item></el-col><el-col :span="24"><el-form-item label="工单内容"><el-input type="textarea" :rows="4" /></el-form-item></el-col></el-row></el-form><template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="dialogVisible = false">确定</el-button></template></el-dialog>
    <el-dialog v-model="batchVisible" title="批量操作" width="520px"><el-alert title="可对勾选工单执行批量完成或分配。" type="info" show-icon :closable="false" /><template #footer><el-button @click="batchVisible = false">取消</el-button><el-button type="primary" @click="batchVisible = false">确认</el-button></template></el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const dialogVisible = ref(false)
const batchVisible = ref(false)
const loading = ref(false)
const activeStatus = ref('全部')
const query = reactive({ keyword: '', phone: '', type: '' })
const rows = [
  { ticketNo: 'T26031613251033124160', status: '撤销', type: '售后类', level: '一般', orderNo: '26031216550265297411', origin: '浙江(台州/临海县/下各镇)-洗衣工厂-擦擦精工工艺(0289)', handler: '此在', title: '下5到4。退一双洗淡费' },
  { ticketNo: 'T260226153823114651894', status: '待处理', type: '售后类', level: '一般', orderNo: '260224183917471963059', origin: '浙江(台州/临海县/下各镇)-洗衣工厂-擦擦精工工艺(0289)', handler: '此在', title: '一双不洗' },
]
async function loadTickets() { loading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 400)) } finally { loading.value = false } }
function reset() { query.keyword = ''; query.phone = ''; query.type = '' }
</script>
