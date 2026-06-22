<template>
  <div class="capacity-page">
    <div class="filter-card capacity-filter">
      <el-form inline>
        <el-form-item label="展示">
          <el-checkbox-group v-model="visibleMetrics">
            <el-checkbox label="入场单" />
            <el-checkbox label="预检单/件" />
            <el-checkbox label="质检单/件" />
            <el-checkbox label="出厂单/件" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="年月">
          <el-date-picker v-model="month" type="month" value-format="YYYY-MM" />
        </el-form-item>
        <el-form-item label="工厂">
          <el-select v-model="factory" filterable clearable placeholder="全部工厂">
            <el-option v-for="item in factoryNames" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <YxCard>
      <h3>每日出厂量</h3>
      <div class="capacity-table-wrap">
        <table class="capacity-table">
          <thead>
            <tr>
              <th>工厂</th>
              <th v-for="day in days" :key="day">{{ day }}日</th>
              <th>合计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in visibleRows" :key="row.name">
              <td class="factory-name">{{ row.name }}</td>
              <td v-for="day in days" :key="day">
                <div v-if="row.values[day]" class="day-cell">
                  <p v-if="visibleMetrics.includes('入场单')">入场 <b>{{ row.values[day].in }}</b>单</p>
                  <p v-if="visibleMetrics.includes('预检单/件')">预检 <b>{{ row.values[day].pre }}</b>单 {{ row.values[day].prePieces }}件</p>
                  <p v-if="visibleMetrics.includes('质检单/件')">质检 <b>{{ row.values[day].quality }}</b>单 {{ row.values[day].qualityPieces }}件</p>
                  <p v-if="visibleMetrics.includes('出厂单/件')">出厂 <b>{{ row.values[day].out }}</b>单 {{ row.values[day].pieces }}件</p>
                </div>
                <span v-else>-</span>
              </td>
              <td class="total-cell">
                <p v-if="visibleMetrics.includes('入场单')">入场 <b>{{ row.totalIn }}</b>单</p>
                <p v-if="visibleMetrics.includes('预检单/件')">预检 <b>{{ row.totalPre }}</b>单 {{ row.totalPrePieces }}件</p>
                <p v-if="visibleMetrics.includes('质检单/件')">质检 <b>{{ row.totalQuality }}</b>单 {{ row.totalQualityPieces }}件</p>
                <p v-if="visibleMetrics.includes('出厂单/件')">出厂 <b>{{ row.totalOut }}</b>单 {{ row.totalPieces }}件</p>
              </td>
            </tr>
            <tr class="summary-row">
              <td>合计</td>
              <td v-for="day in days" :key="day">
                <p v-if="visibleMetrics.includes('入场单')">入场 <b>{{ 280 + day * 4 }}</b>单</p>
                <p v-if="visibleMetrics.includes('出厂单/件')">出厂 <b>{{ 190 + day * 8 }}</b>单 {{ 800 + day * 19 }}件</p>
              </td>
              <td><p>入场 <b>4956</b>单</p><p>出厂 <b>4940</b>单 20037件</p></td>
            </tr>
          </tbody>
        </table>
      </div>
    </YxCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import YxCard from '@/components/base/YxCard.vue'

type DayValue = { in: number; pre: number; prePieces: number; quality: number; qualityPieces: number; out: number; pieces: number }
type CapacityRow = { name: string; values: Record<number, DayValue>; totalIn: number; totalPre: number; totalPrePieces: number; totalQuality: number; totalQualityPieces: number; totalOut: number; totalPieces: number }

const month = ref('2026-03')
const factory = ref('')
const visibleMetrics = ref(['出厂单/件'])
const days = Array.from({ length: 15 }, (_, index) => index + 1)
const factoryNames = ['(0153)辽宁(沈阳市)-洗衣工厂', '(0197)重庆(合川)-洗衣工厂', '(0289)浙江(台州/仙居县/下各镇)-洗衣工厂-景德祥工艺', '(0361)浙江(宁波/海曙区)-洗衣工厂', '(0459)河北(廊坊/三河市)-洗衣工厂', '(0532)浙江省(台州市/仙居县)-洗衣工厂']
const rows = reactive<CapacityRow[]>(factoryNames.map((name, index) => {
  const values: Record<number, DayValue> = {}
  let totalIn = 0, totalPre = 0, totalPrePieces = 0, totalQuality = 0, totalQualityPieces = 0, totalOut = 0, totalPieces = 0
  for (const day of days) {
    if ((index === 1 || index === 5) && day % 3 !== 0) continue
    const inCount = (day * 17 + index * 31) % 180 + 20
    const pre = Math.max(inCount - (day % 9), 1)
    const quality = Math.max(pre - (index % 7), 1)
    const out = (day * 13 + index * 19) % 160 + 15
    const prePieces = pre * 4 + day
    const qualityPieces = quality * 4 + day * 2
    const pieces = out * 4 + day * 3
    values[day] = { in: inCount, pre, prePieces, quality, qualityPieces, out, pieces }
    totalIn += inCount; totalPre += pre; totalPrePieces += prePieces; totalQuality += quality; totalQualityPieces += qualityPieces; totalOut += out; totalPieces += pieces
  }
  return { name, values, totalIn, totalPre, totalPrePieces, totalQuality, totalQualityPieces, totalOut, totalPieces }
}))

const visibleRows = computed(() => factory.value ? rows.filter((row) => row.name === factory.value) : rows)
</script>

<style scoped>
.capacity-filter{padding:16px 24px 8px}.capacity-filter :deep(.el-select){width:260px}h3{margin:0 0 14px;font-size:18px}.capacity-table-wrap{overflow:auto}.capacity-table{min-width:1920px;width:100%;border-collapse:collapse;background:#fff}.capacity-table th,.capacity-table td{min-width:110px;padding:14px 10px;border:1px solid var(--yx-border);text-align:center;vertical-align:middle}.capacity-table th{background:#fafafa;font-weight:700}.capacity-table th:first-child,.capacity-table td:first-child{min-width:180px;text-align:left}.factory-name{line-height:1.6}.day-cell p,.total-cell p,.summary-row p{margin:3px 0}.day-cell b,.total-cell b,.summary-row b{font-weight:800}.summary-row{font-weight:700;background:#fcfdff}
</style>
