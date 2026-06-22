<template>
  <div>
    <PageHeader title="新增会员" description="录入客户基础资料，可作为新建订单时的会员识别依据。" />
    <YxCard>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px" :disabled="submitLoading" style="max-width: 760px">
        <el-form-item label="用户类型" prop="type"><el-select v-model="form.type" style="width: 100%"><el-option label="普通用户" value="normal" /><el-option label="商户用户" value="merchant" /></el-select></el-form-item>
        <el-form-item label="用户名" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="会员等级" prop="level"><el-select v-model="form.level" style="width: 100%"><el-option label="普通会员" value="普通会员" /><el-option label="银卡会员" value="银卡会员" /><el-option label="金卡会员" value="金卡会员" /></el-select></el-form-item>
        <el-form-item label="客户标签"><el-checkbox-group v-model="form.tags"><el-checkbox label="高频" /><el-checkbox label="售后关注" /><el-checkbox label="企业客户" /></el-checkbox-group></el-form-item>
        <el-form-item label="默认地址"><el-input v-model="form.address" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="3" /></el-form-item>
        <el-form-item><el-button @click="router.back()">取消</el-button><el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存会员</el-button></el-form-item>
      </el-form>
    </YxCard>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const router = useRouter(); const formRef = ref<FormInstance>(); const submitLoading = ref(false)
const form = reactive({ type: 'normal', name: '', phone: '', level: '普通会员', tags: [] as string[], address: '', remark: '' })
const rules: FormRules = { type: [{ required: true, message: '请选择用户类型', trigger: 'change' }], name: [{ required: true, message: '请输入用户名', trigger: 'blur' }], phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }], level: [{ required: true, message: '请选择会员等级', trigger: 'change' }] }
async function handleSubmit() { if (submitLoading.value) return; await formRef.value?.validate(); submitLoading.value = true; try { await new Promise((resolve) => window.setTimeout(resolve, 600)); ElMessage.success('会员保存成功'); await router.push('/members') } finally { submitLoading.value = false } }
</script>
