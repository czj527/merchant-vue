<template>
  <div>
    <PageHeader title="物流中心" description="创建快递单、维护地址簿和查看物流中心记录。">
      <template #extra>
        <el-button @click="addressDialog = true">新增地址簿</el-button>
        <el-button type="primary" @click="dialogVisible = true">创建快递单</el-button>
      </template>
    </PageHeader>

    <YxCard>
      <el-form inline :model="query">
        <el-form-item label="快递单号"><el-input v-model="query.orderNo" placeholder="请输入" /></el-form-item>
        <el-form-item label="快递公司"><el-select v-model="query.company" clearable placeholder="请选择"><el-option label="顺丰速运" value="顺丰速运" /><el-option label="京东物流" value="京东物流" /></el-select></el-form-item>
        <el-form-item label="时间范围"><el-date-picker v-model="query.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /></el-form-item>
      </el-form>
      <el-table :data="rows" border>
        <el-table-column prop="expressNo" label="快递单号" min-width="160" />
        <el-table-column prop="company" label="快递公司" width="120" />
        <el-table-column prop="type" label="取寄类型" width="100" />
        <el-table-column prop="product" label="商品类型" width="100" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="updatedAt" label="更新时间" width="160" />
      </el-table>
    </YxCard>

    <el-dialog v-model="dialogVisible" title="创建快递单" width="560px">
      <el-form label-width="100px">
        <el-form-item label="快递公司"><el-select style="width:100%" placeholder="请选择" /></el-form-item>
        <el-form-item label="取寄类型"><el-radio-group><el-radio value="上门取件">上门取件</el-radio><el-radio value="商户寄件">商户寄件</el-radio></el-radio-group></el-form-item>
        <el-form-item label="商品类型"><el-select style="width:100%" placeholder="请选择" /></el-form-item>
        <el-form-item label="详细地址"><el-input placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="dialogVisible = false">确定</el-button></template>
    </el-dialog>

    <el-dialog v-model="addressDialog" title="新增地址簿" width="520px">
      <el-form label-width="100px">
        <el-form-item label="联系人"><el-input /></el-form-item>
        <el-form-item label="手机号"><el-input /></el-form-item>
        <el-form-item label="地址"><el-input /></el-form-item>
      </el-form>
      <template #footer><el-button @click="addressDialog = false">取消</el-button><el-button type="primary" @click="addressDialog = false">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const dialogVisible = ref(false)
const addressDialog = ref(false)
const query = reactive({ orderNo: '', company: '', dateRange: [] })
const rows = [
  { expressNo: 'SF1234567890', company: '顺丰速运', type: '上门取件', product: '衣物', status: '已创建', updatedAt: '2026-06-22 10:20' },
  { expressNo: 'JT1234567890', company: '京东物流', type: '商户寄件', product: '鞋靴', status: '运输中', updatedAt: '2026-06-22 09:12' },
]
</script>
