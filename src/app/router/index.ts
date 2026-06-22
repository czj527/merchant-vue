import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/app/store/user'

const routes = [
  { path: '/', redirect: '/workbench/merchant' },
  { path: '/login', name: 'login', component: () => import('@/views/login/LoginView.vue'), meta: { title: '登录' } },
  { path: '/workbench/merchant', name: 'workbench-merchant', component: () => import('@/views/workbench/MerchantWorkbenchView.vue'), meta: { title: '商户看板', module: '工作台' } },
  { path: '/workbench/oem', name: 'workbench-oem', component: () => import('@/views/workbench/OemWorkbenchView.vue'), meta: { title: '代工看板', module: '工作台' } },
  { path: '/orders', name: 'orders', component: () => import('@/views/orders/OrderListView.vue'), meta: { title: '订单列表', module: '订单中心' } },
  { path: '/orders/create', name: 'order-create', component: () => import('@/views/orders/OrderCreateView.vue'), meta: { title: '新建订单', module: '订单中心' } },
  { path: '/orders/batch', name: 'order-batch', component: () => import('@/views/orders/OrderBatchView.vue'), meta: { title: '批量订单', module: '订单中心' } },
  { path: '/orders/:id', name: 'order-detail', component: () => import('@/views/orders/OrderDetailView.vue'), meta: { title: '订单详情', module: '订单中心' } },
  { path: '/members', name: 'members', component: () => import('@/views/members/MemberListView.vue'), meta: { title: '会员列表', module: '会员管理' } },
  { path: '/members/create', name: 'member-create', component: () => import('@/views/members/MemberCreateView.vue'), meta: { title: '新增会员', module: '会员管理' } },
  { path: '/customers/merchants', name: 'merchant-list', component: () => import('@/views/customers/MerchantListView.vue'), meta: { title: '商户列表', module: '客户管理' } },
  { path: '/customers/merchants/create', name: 'merchant-create', component: () => import('@/views/customers/MerchantCreateView.vue'), meta: { title: '新增商户', module: '客户管理' } },
  { path: '/customers/brands', name: 'brand-list', component: () => import('@/views/customers/BrandListView.vue'), meta: { title: '品牌管理', module: '客户管理' } },
  { path: '/products/banners', name: 'product-banners', component: () => import('@/views/products/ProductBannerView.vue'), meta: { title: '轮播图管理', module: '商品中心' } },
  { path: '/products/categories', name: 'product-categories', component: () => import('@/views/products/ProductCategoryView.vue'), meta: { title: '类目管理', module: '商品中心' } },
  { path: '/products/online', name: 'product-online', component: () => import('@/views/products/ProductOnlineView.vue'), meta: { title: '网店商品', module: '商品中心' } },
  { path: '/products/douyin', name: 'product-douyin', component: () => import('@/views/products/ProductDouyinView.vue'), meta: { title: '抖音商品', module: '商品中心' } },
  { path: '/fulfillment/logistics', name: 'logistics', component: () => import('@/views/fulfillment/LogisticsView.vue'), meta: { title: '物流中心', module: '履约管理' } },
  { path: '/fulfillment/call-center', name: 'call-center', component: () => import('@/views/fulfillment/CallCenterView.vue'), meta: { title: '外呼中心', module: '履约管理' } },
  { path: '/data/orders', name: 'data-orders', component: () => import('@/views/data/OrderQueryView.vue'), meta: { title: '订单查询', module: '数据查询' } },
  { path: '/data/clothes', name: 'data-clothes', component: () => import('@/views/data/ClothesQueryView.vue'), meta: { title: '衣物查询', module: '数据查询' } },
  { path: '/data/factories', name: 'data-factories', component: () => import('@/views/data/FactoryCapacityView.vue'), meta: { title: '工厂产量', module: '数据查询' } },
  { path: '/tickets', name: 'tickets', component: () => import('@/views/tickets/TicketListView.vue'), meta: { title: '工单管理', module: '工单管理' } },
  { path: '/settings/employees', name: 'settings-employees', component: () => import('@/views/settings/EmployeeListView.vue'), meta: { title: '员工管理', module: '系统设置' } },
  { path: '/settings/print', name: 'settings-print', component: () => import('@/views/settings/PrintConfigView.vue'), meta: { title: '打印配置', module: '系统设置' } },
  { path: '/settings/prices', name: 'settings-prices', component: () => import('@/views/settings/PriceConfigView.vue'), meta: { title: '代工价配置', module: '系统设置' } },
  { path: '/settings/robot', name: 'settings-robot', component: () => import('@/views/settings/RobotConfigView.vue'), meta: { title: '机器人配置', module: '系统设置' } },
  { path: '/settings/profile', name: 'settings-profile', component: () => import('@/views/settings/ProfileView.vue'), meta: { title: '个人资料', module: '系统设置' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const isLoginRoute = to.path === '/login'

  if (!userStore.isLoggedIn && !isLoginRoute) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (userStore.isLoggedIn && isLoginRoute) {
    return '/workbench/merchant'
  }

  const baseTitle = '优洗生活商家端'
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${baseTitle}`
  } else {
    document.title = baseTitle
  }
})
export default router



