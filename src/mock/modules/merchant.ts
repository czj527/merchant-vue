import type { Member } from '@/types/member'
import { OrderStatus, PaymentStatus, type Order } from '@/types/order'

export const mockOrders: Order[] = [
  {
    id: 'ord_1001',
    orderNo: 'YX202606180001',
    customerName: '林女士',
    customerPhone: '138****2061',
    merchantName: '麻雀奢活清洗服务',
    status: OrderStatus.PendingPickup,
    paymentStatus: PaymentStatus.Paid,
    amount: 268,
    itemCount: 3,
    pickupAddress: '杭州市西湖区文三路 188 号',
    deliveryAddress: '杭州市西湖区文三路 188 号',
    createdAt: '2026-06-18 09:24',
    expectedAt: '2026-06-21 18:00',
    items: [
      { id: 'item_1', category: '外套', serviceName: '精洗护理', quantity: 1, price: 98, status: OrderStatus.PendingPickup },
      { id: 'item_2', category: '衬衫', serviceName: '标准洗护', quantity: 2, price: 85, status: OrderStatus.PendingPickup },
    ],
  },
  {
    id: 'ord_1002',
    orderNo: 'YX202606180002',
    customerName: '周先生',
    customerPhone: '186****7720',
    merchantName: '优洗生活直营店',
    status: OrderStatus.Washing,
    paymentStatus: PaymentStatus.Paid,
    amount: 156,
    itemCount: 2,
    pickupAddress: '杭州市拱墅区湖墅南路 66 号',
    deliveryAddress: '杭州市拱墅区湖墅南路 66 号',
    createdAt: '2026-06-17 14:10',
    expectedAt: '2026-06-20 18:00',
    items: [
      { id: 'item_3', category: '西裤', serviceName: '标准洗护', quantity: 1, price: 68, status: OrderStatus.Washing },
      { id: 'item_4', category: '毛衣', serviceName: '精细护理', quantity: 1, price: 88, status: OrderStatus.Washing },
    ],
  },
  {
    id: 'ord_1003',
    orderNo: 'YX202606170018',
    customerName: '陈女士',
    customerPhone: '159****4438',
    merchantName: '优洗生活城西店',
    status: OrderStatus.ReadyToShip,
    paymentStatus: PaymentStatus.Unpaid,
    amount: 328,
    itemCount: 4,
    pickupAddress: '杭州市余杭区未来科技城',
    deliveryAddress: '杭州市余杭区未来科技城',
    createdAt: '2026-06-17 10:36',
    expectedAt: '2026-06-19 18:00',
    items: [
      { id: 'item_5', category: '羽绒服', serviceName: '深度清洗', quantity: 1, price: 188, status: OrderStatus.ReadyToShip },
      { id: 'item_6', category: '围巾', serviceName: '标准洗护', quantity: 3, price: 46.67, status: OrderStatus.ReadyToShip },
    ],
  },
]

export const mockMembers: Member[] = [
  { id: 'mem_1001', memberNo: 'M202606001', name: '林女士', phone: '138****2061', level: '金卡会员', status: 'enabled', orderCount: 18, totalAmount: 3260, createdAt: '2026-03-12' },
  { id: 'mem_1002', memberNo: 'M202606002', name: '周先生', phone: '186****7720', level: '普通会员', status: 'enabled', orderCount: 5, totalAmount: 680, createdAt: '2026-05-02' },
  { id: 'mem_1003', memberNo: 'M202606003', name: '陈女士', phone: '159****4438', level: '银卡会员', status: 'enabled', orderCount: 11, totalAmount: 1850, createdAt: '2026-04-18' },
]

export const dashboardSummary = {
  todayOrders: 42,
  pendingPickup: 13,
  washing: 29,
  readyToShip: 36,
  afterSale: 2,
  timeoutWarnings: 8,
}

export const dashboardWarnings = [
  { id: 'w_1', title: '取件超 24 小时未受理', count: 3, target: '/orders?status=pending_pickup' },
  { id: 'w_2', title: '在厂超 5 天', count: 4, target: '/orders?status=washing' },
  { id: 'w_3', title: '待处理售后', count: 2, target: '/tickets' },
]
