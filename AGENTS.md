# AGENTS.md

本文件适用于整个 `merchant-vue` 仓库。所有自动化代理和开发者在修改本项目时都必须遵守这些约定，确保鲸蚁生活商家端前端的功能结构和视觉风格保持一致。

## 项目定位

- 本项目是鲸蚁生活商家端 Vue 前端工程，不是一次性静态原型。
- 修改页面时应优先对齐 `D:/work1/YouXiLife/image/` 下的商家端截图。
- `D:/work1/YouXiLife/image/鲸蚁生活_工厂端/` 是工厂端参考图，不要误当作商家端主流程。
- `D:/work1/YouXiLife/merchant/` 是旧静态原型，可作为字段、布局和交互参考，但最终实现以 `merchant-vue` 为准。

## 必须保持的视觉规范

- 主色、背景色、文本色、圆角、阴影必须优先使用 `src/styles/tokens.scss` 中的 `--yx-*` 变量。
- 不要随意新增与现有风格冲突的颜色体系；新增状态色应优先复用 `--yx-success`、`--yx-warning`、`--yx-danger`、`--yx-primary`。
- 页面容器、卡片和弹窗应保持浅色、简洁、低饱和度风格。
- 页面标题区统一使用 `PageHeader`，不要在页面中重复手写风格不同的标题栏。
- 数据卡片统一使用 `MetricCard` 和 `.metric-grid`，保持 6 列网格风格。
- 内容卡片统一使用 `YxCard` 或 `.yx-card`。
- 表格和表单优先使用 Element Plus 组件，避免自造不一致的表格/表单控件。
- 弹窗宽表可使用 `el-dialog` + `el-table`，必要时设置较大宽度，但需要保持截图中的白底、细边框和紧凑表格风格。
- 不要使用 emoji 作为主要功能图标；如需图标，优先使用项目已有图标体系或 Element Plus/Lucide 图标。

## 代码组织规范

- 页面级组件放在 `src/views/<module>/`。
- 可复用业务组件放在 `src/components/business/`。
- 基础 UI 容器放在 `src/components/base/`。
- 全局布局相关代码放在 `src/components/layout/` 和 `src/styles/layout.scss`。
- 全局样式变量只放在 `src/styles/tokens.scss`，不要在单个页面重复定义主色、圆角、阴影。
- Mock 数据优先放在 `src/mock/modules/`，复杂页面不要长期堆大量重复 Mock 数据在模板里。
- API/Mock 服务函数放在 `src/services/modules/`，并从 `src/services/index.ts` 统一导出。
- 类型定义放在 `src/types/`，新增复杂数据结构时要补充类型。
- 新增路由时同步维护 `src/app/router/index.ts` 和 `src/config/menu.ts`。

## Vue 与 TypeScript 规范

- 使用 Vue 3 `<script setup lang="ts">`。
- 优先使用 `ref`、`reactive`、`computed`，不要引入 Options API。
- 不要提交未使用的 import、变量或类型；`vue-tsc` 必须通过。
- 事件函数命名应清晰，例如 `loadOrders`、`resetQuery`、`openDetail`、`handleExport`。
- 异步操作需要 loading 状态，避免重复点击。
- 危险操作如删除、禁用、取消订单，应使用二次确认或明确的弹窗流程。
- 路由跳转统一使用 `useRouter()`。

## 页面实现规范

- 查询页应包含：筛选区、重置、查询、列表、必要的导出入口。
- 列表页应包含：状态展示、行内操作、空态或 loading。
- 新增/编辑页应包含：表单校验、提交 loading、成功提示和返回/关闭逻辑。
- 详情页应包含：基础信息区、主要业务标签页或分区、关键弹窗入口。
- 工作台看板应优先对齐截图中的字段、表头和详情弹窗，不要只做抽象统计卡。
- 当截图中存在“展开/收起”“明细”“详情”“批量操作”时，至少需要保留可点击入口和对应弹窗/状态变化。

## 样式书写规范

- 页面局部样式使用 `<style scoped>`。
- 需要影响 Element Plus 内部结构时使用 `:deep()`，不要写全局污染选择器。
- 优先复用现有类名：`.metric-grid`、`.content-grid`、`.filter-card`、`.page-actions`、`.linkish`、`.section-card`。
- 不要在页面中大量写 `style="..."`；少量布局微调可以接受，但重复样式应抽为类名。
- 宽表需要横向滚动或设置弹窗宽度，避免挤压导致表头错乱。
- 保持紧凑后台系统风格，避免过大的间距、营销风大卡片或复杂动画。

## 验证要求

修改代码后必须运行：

```bash
npm run build
```

构建通过后才能声明完成。允许存在当前已知的第三方依赖警告：

- `@vueuse/core` 的 Rolldown pure annotation warning
- chunk size warning

但不允许新增 TypeScript、Vue SFC、路由或样式编译错误。

## Git 约定

- 不要提交 `node_modules/`、`dist/`、本地环境文件或临时调试文件。
- 提交信息使用简洁动宾结构，例如：`Update dashboard documentation`、`Align workbench detail modal`。
- 未经明确要求不要强推、重写历史或删除远程分支。
