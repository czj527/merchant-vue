<template>
  <div>
    <PageHeader title="机器人配置" description="配置消息群发和各工厂机器人群、@人员、启停状态。" />
    <YxCard>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="消息群发" name="message">
          <el-form :model="messageForm" label-width="96px" :disabled="sendLoading" class="message-form"><el-form-item label="发送范围"><el-select v-model="messageForm.range"><el-option label="全部工厂群" value="all" /><el-option label="指定工厂" value="factory" /></el-select></el-form-item><el-form-item label="消息内容"><el-input v-model="messageForm.content" type="textarea" :rows="5" placeholder="请输入群发内容" /></el-form-item><el-form-item><el-button type="primary" :loading="sendLoading" @click="sendMessage">发送消息</el-button></el-form-item></el-form>
        </el-tab-pane>
        <el-tab-pane label="机器人配置" name="config">
          <el-table :data="robotRows" border><el-table-column prop="sort" label="排序" width="90" /><el-table-column label="工厂" min-width="240"><template #default="{ row }"><el-select v-model="row.factory" style="width:100%"><el-option v-for="item in factories" :key="item" :label="item" :value="item" /></el-select></template></el-table-column><el-table-column label="群名" min-width="240"><template #default="{ row }"><el-select v-model="row.group" multiple filterable allow-create default-first-option placeholder="可输入多个群名" style="width:100%" /></template></el-table-column><el-table-column label="@人列表" min-width="260"><template #default="{ row }"><el-select v-model="row.atList" multiple filterable allow-create placeholder="可输入多人名，群主输入@所有人" style="width:100%" /></template></el-table-column><el-table-column label="开启机器人" width="160"><template #default="{ row }"><el-select v-model="row.enabled"><el-option label="启用" value="enabled" /><el-option label="禁用" value="disabled" /></el-select></template></el-table-column><el-table-column label="操作" width="100"><template #default><el-button text type="danger">删除</el-button></template></el-table-column></el-table>
          <div class="robot-submit"><el-button @click="addRow">新增一行</el-button><el-button type="primary" :loading="saveLoading" @click="saveConfig">提交</el-button></div>
        </el-tab-pane>
      </el-tabs>
    </YxCard>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'; import { ElMessage } from 'element-plus'; import PageHeader from '@/components/business/PageHeader.vue'; import YxCard from '@/components/base/YxCard.vue'
const activeTab=ref('config'); const sendLoading=ref(false); const saveLoading=ref(false); const messageForm=reactive({range:'all',content:''}); const factories=['(0153)辽宁(沈阳市)-洗衣工厂','(0197)重庆(合川)-洗衣工厂','(0289)浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺','(0361)浙江(宁波/海曙区)-洗衣工厂','(0459)河北(廊坊/三河市)-洗衣工厂','(0532)浙江省(台州市/仙居县)-洗衣工厂']
const robotRows=ref(factories.map((factory,index)=>({id:index+1,sort:index+1,factory,group:[],atList:[],enabled:'disabled'})))
function addRow(){ robotRows.value.push({id:Date.now(),sort:robotRows.value.length+1,factory:'',group:[],atList:[],enabled:'disabled'}) }
async function sendMessage(){ if(sendLoading.value)return; sendLoading.value=true; try{ await new Promise(r=>setTimeout(r,600)); ElMessage.success('消息已群发') } finally{ sendLoading.value=false } }
async function saveConfig(){ if(saveLoading.value)return; saveLoading.value=true; try{ await new Promise(r=>setTimeout(r,700)); ElMessage.success('机器人配置已保存') } finally{ saveLoading.value=false } }
</script>
<style scoped>.message-form{max-width:720px}.robot-submit{display:flex;justify-content:center;gap:12px;margin-top:22px}</style>
