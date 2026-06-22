export const statusMaps = {
  enabled: {
    enabled: { label: '启用', type: 'success' as const },
    disabled: { label: '停用', type: 'info' as const },
  },
  publish: {
    draft: { label: '草稿', type: 'info' as const },
    online: { label: '上架', type: 'success' as const },
    offline: { label: '下架', type: 'warning' as const },
  },
  logistics: {
    pending: { label: '待发货', type: 'warning' as const },
    shipping: { label: '配送中', type: 'primary' as const },
    delivered: { label: '已妥投', type: 'success' as const },
    exception: { label: '异常', type: 'danger' as const },
  },
  ticket: {
    pending: { label: '待处理', type: 'warning' as const },
    processing: { label: '处理中', type: 'primary' as const },
    waiting_user: { label: '待用户反馈', type: 'info' as const },
    resolved: { label: '已解决', type: 'success' as const },
  },
  sync: {
    synced: { label: '已同步', type: 'success' as const },
    pending: { label: '待同步', type: 'warning' as const },
    failed: { label: '同步失败', type: 'danger' as const },
  },
}

export const merchants = [
  { id: 'merchant_1', code: 'YX-M-001', name: '麻雀奢活清洗服务', contact: '何店长', phone: '152****7060', city: '杭州', status: 'enabled', brand: '优洗生活' },
  { id: 'merchant_2', code: 'YX-M-002', name: '优洗生活城西店', contact: '周经理', phone: '138****7720', city: '杭州', status: 'enabled', brand: '优洗生活' },
  { id: 'merchant_3', code: 'YX-M-003', name: '优洗生活滨江店', contact: '陈经理', phone: '159****4438', city: '杭州', status: 'disabled', brand: '优洗生活' },
]

export const brands = [
  { id: 'brand_1', code: 'BR-YX', name: '优洗生活', merchantCount: 12, productCount: 48, status: 'enabled', updatedAt: '2026-06-18' },
  { id: 'brand_2', code: 'BR-QJ', name: '轻净护理', merchantCount: 4, productCount: 16, status: 'enabled', updatedAt: '2026-06-15' },
]

export const banners = [
  { id: 'banner_1', title: '夏季洗护活动', position: '首页顶部', sort: 1, status: 'online', updatedAt: '2026-06-18' },
  { id: 'banner_2', title: '会员专享券', position: '会员中心', sort: 2, status: 'online', updatedAt: '2026-06-16' },
  { id: 'banner_3', title: '旧活动备份', position: '首页顶部', sort: 9, status: 'offline', updatedAt: '2026-05-28' },
]

export const categories = [
  { id: 'cat_1', name: '日常衣物', parent: '根类目', sort: 1, productCount: 18, status: 'enabled' },
  { id: 'cat_2', name: '高端护理', parent: '根类目', sort: 2, productCount: 12, status: 'enabled' },
  { id: 'cat_3', name: '家纺清洗', parent: '根类目', sort: 3, productCount: 8, status: 'enabled' },
]

export const products = [
  { id: 'prod_1', code: 'SPU-001', name: '衬衫标准洗护', category: '日常衣物', price: 39, sales: 218, status: 'online' },
  { id: 'prod_2', code: 'SPU-002', name: '羽绒服深度清洗', category: '高端护理', price: 188, sales: 96, status: 'online' },
  { id: 'prod_3', code: 'SPU-003', name: '四件套清洗', category: '家纺清洗', price: 128, sales: 54, status: 'offline' },
]

export const douyinProducts = [
  { id: 'dy_1', platformId: 'DY102938', name: '抖音衬衫洗护券', localProduct: '衬衫标准洗护', syncStatus: 'synced', updatedAt: '2026-06-18 10:20' },
  { id: 'dy_2', platformId: 'DY102939', name: '羽绒服护理套餐', localProduct: '羽绒服深度清洗', syncStatus: 'pending', updatedAt: '2026-06-17 16:42' },
]

export const logisticsOrders = [
  { id: 'log_1', logisticsNo: 'SF100286001', orderNo: 'YX202606180001', receiver: '林女士', carrier: '顺丰速运', status: 'pending', updatedAt: '2026-06-18 11:30' },
  { id: 'log_2', logisticsNo: 'JD88420002', orderNo: 'YX202606180002', receiver: '周先生', carrier: '京东物流', status: 'shipping', updatedAt: '2026-06-18 09:10' },
  { id: 'log_3', logisticsNo: 'YT76210003', orderNo: 'YX202606170018', receiver: '陈女士', carrier: '圆通速递', status: 'exception', updatedAt: '2026-06-17 20:45' },
]

export const callTasks = [
  { id: 'call_1', taskNo: 'CALL-001', customer: '林女士', phone: '138****2061', scene: '取件确认', result: '待外呼', status: 'pending', updatedAt: '2026-06-18 10:00' },
  { id: 'call_2', taskNo: 'CALL-002', customer: '周先生', phone: '186****7720', scene: '售后回访', result: '已接通', status: 'processing', updatedAt: '2026-06-18 09:40' },
]

export const clothes = [
  { id: 'cloth_1', clothNo: 'C20260618001', orderNo: 'YX202606180001', category: '外套', status: '待取件', factory: '杭州洗护中心', updatedAt: '2026-06-18 09:24' },
  { id: 'cloth_2', clothNo: 'C20260617008', orderNo: 'YX202606180002', category: '毛衣', status: '洗护中', factory: '杭州洗护中心', updatedAt: '2026-06-18 11:12' },
  { id: 'cloth_3', clothNo: 'C20260617018', orderNo: 'YX202606170018', category: '羽绒服', status: '待发货', factory: '杭州洗护中心', updatedAt: '2026-06-18 13:28' },
]

export const factories = [
  { id: 'factory_1', name: '杭州洗护中心', todayIn: 126, todayOut: 98, washing: 286, timeout: 8, rate: '94%' },
  { id: 'factory_2', name: '嘉兴洗护中心', todayIn: 88, todayOut: 76, washing: 172, timeout: 4, rate: '96%' },
  { id: 'factory_3', name: '湖州合作工厂', todayIn: 42, todayOut: 39, washing: 91, timeout: 1, rate: '98%' },
]

export const tickets = [
  { id: 'ticket_1', ticketNo: 'TK20260618001', type: '售后', title: '客户反馈衣物褶皱', relatedOrder: 'YX202606170018', owner: '客服一组', status: 'pending', updatedAt: '2026-06-18 10:16' },
  { id: 'ticket_2', ticketNo: 'TK20260618002', type: '物流', title: '快递轨迹长时间未更新', relatedOrder: 'YX202606180002', owner: '履约组', status: 'processing', updatedAt: '2026-06-18 11:20' },
  { id: 'ticket_3', ticketNo: 'TK20260617009', type: '咨询', title: '会员咨询价格规则', relatedOrder: '-', owner: '客服二组', status: 'resolved', updatedAt: '2026-06-17 18:40' },
]

export const employees = [
  { id: 'emp_1', account: 'admin', name: '系统管理员', role: '管理员', phone: '152****7060', status: 'enabled', updatedAt: '2026-06-18' },
  { id: 'emp_2', account: 'order01', name: '订单专员', role: '订单运营', phone: '138****2001', status: 'enabled', updatedAt: '2026-06-17' },
  { id: 'emp_3', account: 'service01', name: '客服专员', role: '客服', phone: '159****2002', status: 'disabled', updatedAt: '2026-06-12' },
]

export const printTemplates = [
  { id: 'print_1', name: '取件小票', scene: '取件', printer: '前台热敏打印机', status: 'enabled', updatedAt: '2026-06-18' },
  { id: 'print_2', name: '衣物标签', scene: '入厂', printer: '标签打印机', status: 'enabled', updatedAt: '2026-06-16' },
]

export const priceRules = [
  { id: 'price_1', name: '杭州洗护中心基础价', factory: '杭州洗护中心', category: '日常衣物', price: 28, status: 'enabled', effectiveAt: '2026-06-01' },
  { id: 'price_2', name: '高端护理代工价', factory: '杭州洗护中心', category: '高端护理', price: 88, status: 'enabled', effectiveAt: '2026-06-01' },
]

export const robots = [
  { id: 'robot_1', name: '取件提醒机器人', scene: '外呼提醒', provider: 'Mock Voice', status: 'enabled', updatedAt: '2026-06-18' },
  { id: 'robot_2', name: '售后通知机器人', scene: '短信通知', provider: 'Mock SMS', status: 'disabled', updatedAt: '2026-06-12' },
]
