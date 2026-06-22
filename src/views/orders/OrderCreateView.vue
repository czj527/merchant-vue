<template>
  <div>
    <PageHeader title="新建订单" description="按真实截图录入订单来源、套餐、客户、取寄地址和支付信息。" />
    <YxCard>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" :disabled="submitLoading">
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="订单来源" prop="source"><el-select v-model="form.source"><el-option label="自建渠道" value="自建渠道" /><el-option label="抖音" value="抖音" /><el-option label="美团" value="美团" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="品牌" prop="brand"><el-select v-model="form.brand"><el-option label="优洗生活" value="优洗生活" /><el-option label="此在" value="此在" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="商户" prop="merchant"><el-select v-model="form.merchant"><el-option label="麻雀奢活清洗服务" value="麻雀奢活清洗服务" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="套餐名称" prop="packageName"><el-input v-model="form.packageName" placeholder="示例：1件衣服、2双鞋子" /></el-form-item></el-col>
          <el-col :span="16"><div class="package-tip"><b>衣鞋：</b>任选1件　任选2件　任选3件　任选4件　任选5件　任选6件<br /><b>鞋靴：</b>鞋靴1双　鞋靴2双　鞋靴3双　鞋靴4双　鞋靴5双　鞋靴6双<br /><b>其它：</b>精选1衣　精选1鞋　1件皮毛　1普通包　1奢侈包　1副窗帘</div></el-col>
          <el-col :span="8"><el-form-item label="用户名"><el-input v-model="form.userName" placeholder="默认为设置为取件联系人" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="衣服件数" prop="itemCount"><el-input-number v-model="form.itemCount" :min="1" style="width:100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="支付金额" prop="amount"><el-input-number v-model="form.amount" :min="0" :precision="2" style="width:100%" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="商家备注"><el-input v-model="form.merchantRemark" type="textarea" :rows="3" placeholder="请输入洗护备注" /></el-form-item></el-col>
        </el-row>
        <el-divider>取件信息</el-divider>
        <el-row :gutter="16"><el-col :span="8"><el-form-item label="上门时间" prop="pickupTime"><el-date-picker v-model="form.pickupTime" type="datetime" style="width:100%" /></el-form-item></el-col><el-col :span="8"><el-form-item label="联系人" prop="pickupName"><el-input v-model="form.pickupName" /></el-form-item></el-col><el-col :span="8"><el-form-item label="联系电话" prop="pickupPhone"><el-input v-model="form.pickupPhone" /></el-form-item></el-col><el-col :span="8"><el-form-item label="省市区"><el-select v-model="form.pickupArea"><el-option label="浙江省/杭州市/西湖区" value="浙江省/杭州市/西湖区" /><el-option label="北京市/海淀区" value="北京市/海淀区" /></el-select></el-form-item></el-col><el-col :span="24"><el-form-item label="详细地址" prop="pickupAddress"><el-input v-model="form.pickupAddress" type="textarea" /><el-button class="inline-btn" type="primary" @click="parseAddress('pickup')">解析地址</el-button></el-form-item></el-col></el-row>
        <el-divider><el-button type="primary" @click="swapAddress">交换</el-button> 寄件信息 <el-button type="primary" @click="copyPickup">复制</el-button></el-divider>
        <el-row :gutter="16"><el-col :span="8"><el-form-item label="联系人" prop="deliveryName"><el-input v-model="form.deliveryName" /></el-form-item></el-col><el-col :span="8"><el-form-item label="联系电话" prop="deliveryPhone"><el-input v-model="form.deliveryPhone" /></el-form-item></el-col><el-col :span="8"><el-form-item label="省市区"><el-select v-model="form.deliveryArea"><el-option label="浙江省/杭州市/西湖区" value="浙江省/杭州市/西湖区" /><el-option label="北京市/海淀区" value="北京市/海淀区" /></el-select></el-form-item></el-col><el-col :span="24"><el-form-item label="详细地址" prop="deliveryAddress"><el-input v-model="form.deliveryAddress" type="textarea" /><el-button class="inline-btn" type="primary" @click="parseAddress('delivery')">解析地址</el-button></el-form-item></el-col></el-row>
        <div class="submit-bar"><el-button @click="router.back()">取消</el-button><el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button></div>
      </el-form>
    </YxCard>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'; import { ElMessage, type FormInstance, type FormRules } from 'element-plus'; import { useRouter } from 'vue-router'; import PageHeader from '@/components/business/PageHeader.vue'; import YxCard from '@/components/base/YxCard.vue'; import { createOrder } from '@/services'
const router=useRouter(); const formRef=ref<FormInstance>(); const submitLoading=ref(false)
const form=reactive({source:'自建渠道',brand:'',merchant:'',packageName:'',userName:'',itemCount:1,amount:0,merchantRemark:'',pickupTime:'2026-03-24 14:24',pickupName:'',pickupPhone:'',pickupArea:'',pickupAddress:'',deliveryName:'',deliveryPhone:'',deliveryArea:'',deliveryAddress:''})
const rules:FormRules={source:[{required:true,message:'请选择订单来源',trigger:'change'}],brand:[{required:true,message:'请选择品牌',trigger:'change'}],merchant:[{required:true,message:'请选择商户',trigger:'change'}],packageName:[{required:true,message:'请输入套餐名称',trigger:'blur'}],itemCount:[{required:true,message:'请输入衣服件数',trigger:'blur'}],amount:[{required:true,message:'请输入支付金额',trigger:'blur'}],pickupTime:[{required:true,message:'请选择上门时间',trigger:'change'}],pickupName:[{required:true,message:'请输入联系人',trigger:'blur'}],pickupPhone:[{required:true,message:'请输入联系电话',trigger:'blur'}],pickupAddress:[{required:true,message:'请输入详细地址',trigger:'blur'}],deliveryName:[{required:true,message:'请输入联系人',trigger:'blur'}],deliveryPhone:[{required:true,message:'请输入联系电话',trigger:'blur'}],deliveryAddress:[{required:true,message:'请输入详细地址',trigger:'blur'}]}
function parseAddress(type:'pickup'|'delivery'){ ElMessage.success(type==='pickup'?'取件地址解析完成':'寄件地址解析完成') }
function copyPickup(){ form.deliveryName=form.pickupName; form.deliveryPhone=form.pickupPhone; form.deliveryArea=form.pickupArea; form.deliveryAddress=form.pickupAddress; ElMessage.success('已复制取件信息') }
function swapAddress(){ const n=form.pickupName,p=form.pickupPhone,a=form.pickupArea,d=form.pickupAddress; form.pickupName=form.deliveryName; form.pickupPhone=form.deliveryPhone; form.pickupArea=form.deliveryArea; form.pickupAddress=form.deliveryAddress; form.deliveryName=n; form.deliveryPhone=p; form.deliveryArea=a; form.deliveryAddress=d; ElMessage.success('取寄信息已交换') }
async function handleSubmit(){ if(submitLoading.value)return; await formRef.value?.validate(); submitLoading.value=true; try{ const result=await createOrder(); ElMessage.success('订单创建成功'); await router.push('/orders/'+result.id) } finally{ submitLoading.value=false } }
</script>
<style scoped>.package-tip{padding-top:31px;line-height:1.8;color:var(--yx-text-regular)}.inline-btn{float:right;margin-top:8px}.submit-bar{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}</style>
