# 鲸蚁生活 · 商家端前端

`merchant-vue` 是鲸蚁生活商家端的 Vue 前端工程，基于现有商家端截图和静态原型复刻业务页面，用于承载商户工作台、会员管理、订单中心、商品中心、功能管理、信息查询、工单管理和系统设置等模块11。

## 技术栈

- Vue 3 + `<script setup>`
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- Sass

## 快速开始

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

## 目录结构

```text
src/
  app/                路由、全局状态等应用级代码
  assets/             静态资源
  components/         通用组件
    base/             基础 UI 组件
    business/         业务通用组件，如 PageHeader、MetricCard、ModuleTable
    layout/           应用整体布局
  config/             品牌、菜单等配置
  mock/               Mock 数据
  services/           数据访问层
  styles/             全局样式、布局样式、设计变量
  types/              TypeScript 类型
  views/              页面级组件
```

## 功能模块

- 工作台：商户看板、代工看板、时效预警、工厂生产统计、详情弹窗
- 会员管理：会员列表、新增会员、会员详情和启停入口
- 订单中心：订单列表、新建订单、订单详情、批量寄洗、物流与机器人消息
- 客户管理：品牌管理、商户管理、新增商户
- 商品中心：轮播图、类目、网店商品、抖音商品
- 功能管理：物流中心、外呼中心
- 信息查询：订单查询、衣物查询、工厂产量
- 工单管理：工单查询、新建工单、批量操作
- 系统设置：员工管理、打印配置、代工价配置、机器人配置、个人中心

## 设计与样式原则

项目视觉需要保持与鲸蚁生活商家端截图一致：

- 主色使用 `--yx-primary`，不要随意替换蓝色体系。
- 页面卡片使用 `YxCard` 或 `.yx-card`，保持白底、浅边框、圆角和轻阴影。
- 页面标题区统一使用 `PageHeader`。
- 指标卡片统一使用 `MetricCard` 和 `.metric-grid`。
- 表格、表单、弹窗优先使用 Element Plus，并通过现有设计变量微调。
- 全局颜色、圆角、阴影必须优先使用 `src/styles/tokens.scss` 中的 CSS 变量。
- 不要在页面里引入大面积不同风格的渐变、深色主题或强装饰图形。

## 开发约定

- 页面组件放在 `src/views/<module>/` 下。
- 业务通用组件放在 `src/components/business/` 下。
- Mock 数据优先放在 `src/mock/modules/` 下，避免散落在多个页面中；页面临时展示数据可以局部定义，但后续应沉淀到 Mock 层。
- 服务函数放在 `src/services/modules/` 下，并通过 `src/services/index.ts` 导出。
- 类型定义放在 `src/types/` 下。
- 路由新增后，需要同步检查 `src/config/menu.ts` 的菜单入口和高亮状态。

## 提交前检查

提交前至少运行：

```bash
npm run build
```

当前构建可能出现来自第三方依赖 `@vueuse/core` 的 Rolldown 注解警告，以及 chunk 偏大的提示；这些不是业务代码错误，但不应新增 TypeScript 或 Vue 编译错误。

## 参考资源

- 商家端截图位于：`D:/work1/YouXiLife/image/`
- 工厂端截图位于：`D:/work1/YouXiLife/image/鲸蚁生活_工厂端/`
- 旧静态原型位于：`D:/work1/YouXiLife/merchant/`
