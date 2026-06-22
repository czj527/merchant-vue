<template>
  <div>
    <PageHeader title="品牌管理" description="维护租户下品牌信息、logo、状态及基础标识配置。">
      <template #extra><el-button type="primary" @click="openBrandDialog()">+ 新建品牌</el-button></template>
    </PageHeader>

    <div class="filter-card brand-filter">
      <el-form :model="query" label-width="78px">
        <el-row :gutter="28">
          <el-col :span="8"><el-form-item label="租户名"><el-select v-model="query.tenant" clearable placeholder="请选择"><el-option label="D0138-深圳净贝贝网络科技有限公司" value="D0138" /><el-option label="D0174-北京盛峰雅洁清洗服务有限公司" value="D0174" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="名称"><el-input v-model="query.keyword" clearable placeholder="请输入" /></el-form-item></el-col>
        </el-row>
        <div class="filter-actions"><el-button @click="resetQuery">重置</el-button><el-button type="primary" :loading="loading" @click="loadBrands">查询</el-button></div>
      </el-form>
    </div>

    <YxCard>
      <div class="table-actions"><el-button type="primary" @click="openBrandDialog()">+ 新建品牌</el-button></div>
      <el-table :data="brandRows" border v-loading="loading">
        <el-table-column type="index" label="排序" width="60" />
        <el-table-column prop="code" label="ID" width="180" />
        <el-table-column prop="tenant" label="租户名" min-width="180" />
        <el-table-column prop="name" label="名称" width="140" />
        <el-table-column prop="tag" label="标识" width="120" />
        <el-table-column label="logo" width="120"><template #default="{ row }"><div class="brand-logo">{{ row.logo }}</div></template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{ row }"><StatusTag :label="row.status === 'enabled' ? '启用' : '禁用'" :type="row.status === 'enabled' ? 'success' : 'info'" /></template></el-table-column>
        <el-table-column prop="remark" label="备注" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
        <el-table-column prop="updatedAt" label="修改时间" width="160" sortable />
        <el-table-column label="操作" width="160" fixed="right"><template #default="{ row }"><el-button text type="primary" @click="openBrandDialog(row)">修改</el-button><el-button text type="danger">禁用</el-button></template></el-table-column>
      </el-table>
    </YxCard>

    <el-dialog v-model="brandDialogVisible" :title="brandDialogMode === 'create' ? '新建品牌' : '修改品牌'" width="760px" top="5vh" class="brand-dialog">
      <el-form ref="brandFormRef" :model="brandForm" :rules="brandRules" label-position="top" :disabled="brandSubmitting">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="租户" prop="tenant" required><el-select v-model="brandForm.tenant" placeholder="请选择"><el-option label="D0138-深圳净贝贝网络科技有限公司" value="D0138" /><el-option label="D0174-北京盛峰雅洁清洗服务有限公司" value="D0174" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="名称" prop="name" required><el-input v-model="brandForm.name" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="标识" prop="code" required><el-input v-model="brandForm.code" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="指定件数计费"><el-switch v-model="brandForm.pieceBilling" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="合并门店用户和小程序用户"><el-switch v-model="brandForm.mergeUser" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="鞋子商品标识"><el-select v-model="brandForm.shoeTag" placeholder="请选择"><el-option label="鞋类" value="shoe" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="奢洗标识"><el-select v-model="brandForm.luxuryTag" placeholder="请选择"><el-option label="奢洗" value="luxury" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="修复标识"><el-select v-model="brandForm.repairTag" placeholder="请选择"><el-option label="修复" value="repair" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="小件标识"><el-select v-model="brandForm.smallTag" placeholder="请选择"><el-option label="小件" value="small" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="其他标识"><el-select v-model="brandForm.otherTag" placeholder="请选择"><el-option label="其他" value="other" /></el-select></el-form-item></el-col>
        </el-row>
        <el-form-item label="logo"><div class="upload-box">单击上传</div></el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="工厂取消拦截" prop="cancelBlock" required><el-select v-model="brandForm.cancelBlock" placeholder="请选择"><el-option label="启用" value="enabled" /><el-option label="停用" value="disabled" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="美团核销时间" prop="meituanVerify" required><el-select v-model="brandForm.meituanVerify" placeholder="请选择"><el-option label="下单时" value="order" /><el-option label="完成时" value="done" /></el-select></el-form-item></el-col>
        </el-row>
        <el-form-item label="状态" prop="status" required><el-select v-model="brandForm.status" placeholder="请选择"><el-option label="启用" value="enabled" /><el-option label="禁用" value="disabled" /></el-select></el-form-item>
        <el-form-item label="备注"><el-input v-model="brandForm.remark" type="textarea" maxlength="200" show-word-limit placeholder="请输入" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="brandDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="brandSubmitting" @click="submitBrand">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'; import { ElMessage, type FormInstance, type FormRules } from 'element-plus'; import PageHeader from '@/components/business/PageHeader.vue'; import StatusTag from '@/components/business/StatusTag.vue'; import YxCard from '@/components/base/YxCard.vue'; import { brands as brandSource } from '@/mock/modules/module-data'
const loading=ref(false); const brandDialogVisible=ref(false); const brandSubmitting=ref(false); const brandDialogMode=ref<'create'|'edit'>('create'); const brandFormRef=ref<FormInstance>(); const query=reactive({ tenant:'D0138', keyword:'' }); const brandRows=ref<any[]>([]); const currentRow=ref<any|null>(null)
const brandForm=reactive({tenant:'D0174',name:'',code:'',pieceBilling:false,mergeUser:false,shoeTag:'',luxuryTag:'',repairTag:'',smallTag:'',otherTag:'',cancelBlock:'',meituanVerify:'',status:'enabled',remark:''}); const brandRules:FormRules={tenant:[{required:true,message:'请选择租户',trigger:'change'}],name:[{required:true,message:'请输入名称',trigger:'blur'}],code:[{required:true,message:'请输入标识',trigger:'blur'}],cancelBlock:[{required:true,message:'请选择工厂取消拦截',trigger:'change'}],meituanVerify:[{required:true,message:'请选择美团核销时间',trigger:'change'}],status:[{required:true,message:'请选择状态',trigger:'change'}]}
function normalize(row:any){ return { ...row, logo: row.name.slice(0,2) } }
async function loadBrands(){ loading.value=true; try{ const keyword=query.keyword.trim(); brandRows.value=brandSource.map(normalize).filter((row)=> (!query.tenant || row.tenant.includes(query.tenant)) && (!keyword || [row.code,row.name].some((item)=>String(item).includes(keyword)))) } finally{ loading.value=false } }
function resetQuery(){ query.tenant='D0138'; query.keyword=''; void loadBrands() }
function openBrandDialog(row:any|null=null){ brandDialogMode.value=row?'edit':'create'; currentRow.value=row; Object.assign(brandForm,{tenant:row?.tenant??'D0174',name:row?.name??'',code:row?.code??'',pieceBilling:false,mergeUser:false,shoeTag:'',luxuryTag:'',repairTag:'',smallTag:'',otherTag:'',cancelBlock:'enabled',meituanVerify:'order',status:row?.status??'enabled',remark:row?.remark??''}); brandDialogVisible.value=true }
async function submitBrand(){ if(brandSubmitting.value)return; await brandFormRef.value?.validate(); brandSubmitting.value=true; try{ await new Promise((resolve)=>window.setTimeout(resolve,500)); ElMessage.success(brandDialogMode.value==='create'?'品牌保存成功':'品牌修改成功'); brandDialogVisible.value=false; void loadBrands() } finally{ brandSubmitting.value=false } }
onMounted(loadBrands)
</script>
<style scoped>.brand-filter{margin-bottom:14px}.filter-actions{display:flex;justify-content:flex-end;gap:8px}.table-actions{display:flex;justify-content:flex-end;margin-bottom:14px}.brand-logo{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#f44336;color:#fff;font-weight:700;border-radius:4px}.upload-box{width:104px;height:104px;display:grid;place-items:center;border:1px dashed var(--yx-border);border-radius:var(--yx-radius-md);background:#fafcff;color:var(--yx-text-regular)}:deep(.brand-dialog .el-dialog__body){padding-top:10px}</style>

