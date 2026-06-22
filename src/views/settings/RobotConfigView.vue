<template>
  <YxCard class="robot-page">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="消息群发" name="message">
        <el-form :model="messageForm" label-position="top">
          <el-form-item label="请填写要发送的内容" required><el-input v-model="messageForm.content" :rows="4" type="textarea" placeholder="请输入" /></el-form-item>
          <el-checkbox v-model="messageForm.all">全选</el-checkbox>
          <el-form-item label="发送的工厂" required>
            <el-checkbox-group v-model="messageForm.factories">
              <el-checkbox v-for="factory in factories" :key="factory" :label="factory" />
            </el-checkbox-group>
          </el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="机器人配置" name="config">
        <el-table :data="robotRows" border><el-table-column prop="sort" label="排序" width="90" /><el-table-column prop="factory" label="工厂" min-width="260" /><el-table-column label="群名" min-width="260"><template #default="{ row }"><el-input v-model="row.group" /></template></el-table-column><el-table-column label="@人列表" min-width="260"><template #default="{ row }"><el-input v-model="row.atList" /></template></el-table-column><el-table-column label="开启机器人" width="150"><template #default="{ row }"><el-switch v-model="row.enabled" /></template></el-table-column></el-table>
      </el-tab-pane>
    </el-tabs>
  </YxCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import YxCard from '@/components/base/YxCard.vue'

const activeTab = ref('message')
const factories = ['辽宁(沈阳市)-洗衣工厂', '重庆(合川)-洗衣工厂', '浙江(台州/仙居县/下各镇)-洗衣工厂', '浙江(宁波/海曙区)-洗衣工厂', '河北(廊坊/三河市)-洗衣工厂', '浙江省(台州市/仙居县)-洗衣工厂']
const messageForm = reactive({ content: '', all: false, factories: [] as string[] })
const robotRows = ref(factories.map((factory, index) => ({ sort: index + 1, factory, group: '', atList: '', enabled: false })))
function reset() { messageForm.content = ''; messageForm.all = false; messageForm.factories = [] }
function submit() { ElMessage.success('消息已提交') }
</script>

<style scoped>
.robot-page{min-height:360px}.robot-page :deep(.el-textarea__inner){min-height:76px}.robot-page :deep(.el-checkbox-group){display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-top:10px}.robot-page :deep(.el-form-item__label){font-weight:700;color:var(--yx-text-primary)}
</style>
