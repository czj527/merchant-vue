<template>
  <SimpleFormPage title="新增商户" description="录入合作商户基础信息，包含租户、商户类型、状态、联系人和备注。" :fields="fields" redirect-to="/customers/merchants" />
</template>
<script setup lang="ts">
import SimpleFormPage, { type SimpleFormField } from '@/components/business/SimpleFormPage.vue'
const fields: SimpleFormField[] = [
  { prop: 'tenant', label: '租户', type: 'select', required: true, defaultValue: 'D0174', options: [{ label: 'D0174-北京盛峰雅洁清洗服务有限公司', value: 'D0174' }, { label: 'D0289-景德祥工艺', value: 'D0289' }] },
  { prop: 'name', label: '商户名称', required: true, placeholder: '请输入商户名称' },
  { prop: 'type', label: '商户类型', type: 'select', required: true, options: [{ label: '品牌商户', value: 'brand' }, { label: '门店商户', value: 'store' }, { label: '代收点', value: 'station' }] },
  { prop: 'status', label: '商户状态', type: 'select', required: true, defaultValue: 'enabled', options: [{ label: '启用', value: 'enabled' }, { label: '禁用', value: 'disabled' }] },
  { prop: 'contact', label: '联系人', required: true, placeholder: '请输入联系人' },
  { prop: 'phone', label: '联系电话', required: true, placeholder: '请输入联系电话' },
  { prop: 'city', label: '所在城市', required: true, placeholder: '请输入城市' },
  { prop: 'brand', label: '关联品牌', type: 'select', required: true, defaultValue: '优洗生活', options: [{ label: '优洗生活', value: '优洗生活' }, { label: '轻净护理', value: '轻净护理' }] },
  { prop: 'remark', label: '备注', type: 'textarea', placeholder: '请输入备注' },
]
</script>
