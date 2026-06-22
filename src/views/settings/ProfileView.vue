<template>
  <div>
    <PageHeader title="个人中心" description="查看个人信息、修改密码和基础账号配置。">
      <template #extra><el-button @click="passwordVisible = true">修改密码</el-button></template>
    </PageHeader>
    <YxCard>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="昵称">麻雀奢活清洗服务</el-descriptions-item>
        <el-descriptions-item label="手机号">152****7060</el-descriptions-item>
        <el-descriptions-item label="角色">管理员</el-descriptions-item>
        <el-descriptions-item label="状态">正常</el-descriptions-item>
      </el-descriptions>
    </YxCard>
    <el-dialog v-model="passwordVisible" title="修改密码" width="520px"><el-form label-width="100px"><el-form-item label="原密码"><el-input type="password" /></el-form-item><el-form-item label="新密码"><el-input type="password" /></el-form-item><el-form-item label="确认密码"><el-input type="password" /></el-form-item></el-form><template #footer><el-button @click="passwordVisible = false">取消</el-button><el-button type="primary" @click="passwordVisible = false">保存</el-button></template></el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/business/PageHeader.vue'
import YxCard from '@/components/base/YxCard.vue'
const passwordVisible = ref(false)
</script>
