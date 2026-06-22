<template>
  <div>
    <PageHeader :title="title" :description="description" />
    <YxCard>
      <el-form ref="formRef" :model="model" :rules="rules" label-width="104px" :disabled="submitLoading" class="simple-form">
        <el-form-item v-for="field in fields" :key="field.prop" :label="field.label" :prop="field.prop">
          <el-input v-if="field.type === 'textarea'" v-model="model[field.prop]" type="textarea" :rows="3" :placeholder="field.placeholder" />
          <el-select v-else-if="field.type === 'select'" v-model="model[field.prop]" :placeholder="field.placeholder" style="width: 100%">
            <el-option v-for="option in field.options" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
          <el-input-number v-else-if="field.type === 'number'" v-model="model[field.prop]" :min="0" style="width: 100%" />
          <el-input v-else v-model="model[field.prop]" :placeholder="field.placeholder" />
        </el-form-item>
        <el-form-item>
          <el-button @click="router.back()">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </YxCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'

export interface SimpleFormField {
  prop: string
  label: string
  type?: 'input' | 'textarea' | 'select' | 'number'
  placeholder?: string
  required?: boolean
  defaultValue?: string | number
  options?: Array<{ label: string; value: string | number }>
}

const props = defineProps<{
  title: string
  description: string
  fields: SimpleFormField[]
  redirectTo: string
}>()

const router = useRouter()
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const model = reactive<Record<string, string | number>>({})
const rules: FormRules = {}

for (const field of props.fields) {
  model[field.prop] = field.defaultValue ?? ''
  if (field.required) {
    rules[field.prop] = [{ required: true, message: `请填写${field.label}`, trigger: field.type === 'select' ? 'change' : 'blur' }]
  }
}

async function handleSubmit() {
  if (submitLoading.value) return
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    ElMessage.success('保存成功')
    await router.push(props.redirectTo)
  } finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
.simple-form {
  max-width: 760px;
}
</style>
