<template>
  <div class="price-page">
    <aside class="merchant-list">
      <el-input v-model="keyword" placeholder="商户名和工厂名都可以搜索" />
      <button v-for="item in merchants" :key="item" :class="{ active: item === activeMerchant }" type="button" @click="activeMerchant = item">{{ item }}</button>
    </aside>
    <main class="price-main">
      <div class="price-actions"><el-button type="primary" @click="saveData">保存数据</el-button><el-button :icon="Refresh" type="primary">同步到其他商户</el-button></div>
      <el-table :data="rows" border class="price-table">
        <el-table-column label="排序" width="90"><template #default="{ $index }"><span class="sort-badge">{{ $index + 1 }}</span></template></el-table-column>
        <el-table-column label="衣物名称" prop="name" />
        <el-table-column label="衣物图片" width="260"><template #default="{ row }"><div class="cloth-photo" :class="row.className" /></template></el-table-column>
        <el-table-column label="代工价格(元/件)" width="330"><template #default="{ row }"><el-input v-model="row.price" /></template></el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const keyword = ref('')
const merchants = ['商户： 比在-江浙沪皖\n工厂： 浙江(台州/仙居县/下各镇)-洗衣工厂', '商户： 比在-辽宁\n工厂： 辽宁(沈阳市)-洗衣工厂', '商户： 比在-河北\n工厂： 河北(廊坊/三河市)-洗衣工厂', '商户： 比在-川渝\n工厂： 重庆(合川)-洗衣工厂']
const activeMerchant = ref(merchants[0])
const rows = reactive([{ name: '棉服', price: '0.00', className: 'pink' }, { name: '羽绒服', price: '0.00', className: 'white' }, { name: '呢子衣', price: '0.00', className: 'coat' }, { name: '皮毛一体', price: '0.00', className: 'black' }, { name: '风衣', price: '0.00', className: 'blue' }, { name: '休闲上衣', price: '0.00', className: 'cream' }, { name: '羊羔毛外套', price: '0.00', className: 'coat' }])
function saveData() { ElMessage.success('代工价已保存') }
</script>

<style scoped>
.price-page{display:grid;grid-template-columns:300px 1fr;min-height:760px;background:#fff;border:1px solid var(--yx-border);border-radius:var(--yx-radius-lg);overflow:hidden}.merchant-list{padding:16px;border-right:1px solid var(--yx-border)}.merchant-list button{display:block;width:100%;padding:8px 14px;line-height:1.5;text-align:left;background:#fff;border:0;border-bottom:1px solid var(--yx-border);cursor:pointer;white-space:pre-line}.merchant-list button.active{background:var(--yx-primary-soft);border-radius:var(--yx-radius-sm)}.price-main{padding:32px 48px}.price-actions{display:flex;justify-content:flex-end;gap:10px;margin-bottom:16px}.price-table :deep(.el-table__cell){padding:13px 0}.sort-badge{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;color:#fff;background:#2f4a60;border-radius:50%}.cloth-photo{width:70px;height:70px;margin:auto;border:1px solid var(--yx-border);background:#eee;border-radius:2px}.pink{background:#ffc8c8}.white{background:#ddd}.coat{background:#e5c9bf}.black{background:#111}.blue{background:#9fb9d7}.cream{background:#f0dfd2}
</style>
