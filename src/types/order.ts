export const OrderStatus = {
  PendingPickup: 'pending_pickup',
  PickedUp: 'picked_up',
  Received: 'received',
  PreCheck: 'pre_check',
  Washing: 'washing',
  QualityCheck: 'quality_check',
  ReadyToShip: 'ready_to_ship',
  Shipping: 'shipping',
  Completed: 'completed',
  Cancelled: 'cancelled',
  AfterSale: 'after_sale',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const PaymentStatus = {
  Unpaid: 'unpaid',
  Paid: 'paid',
  Refunded: 'refunded',
} as const

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

export interface OrderItem {
  id: string
  category: string
  serviceName: string
  quantity: number
  price: number
  status: OrderStatus
}

export interface Order {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  merchantName: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  amount: number
  itemCount: number
  pickupAddress: string
  deliveryAddress: string
  createdAt: string
  expectedAt: string
  items: OrderItem[]
}

export const orderStatusMap: Record<OrderStatus, { label: string; type: 'info' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  [OrderStatus.PendingPickup]: { label: '待取件', type: 'warning' },
  [OrderStatus.PickedUp]: { label: '已取件', type: 'primary' },
  [OrderStatus.Received]: { label: '已入厂', type: 'primary' },
  [OrderStatus.PreCheck]: { label: '预检中', type: 'primary' },
  [OrderStatus.Washing]: { label: '洗护中', type: 'primary' },
  [OrderStatus.QualityCheck]: { label: '质检中', type: 'warning' },
  [OrderStatus.ReadyToShip]: { label: '待发货', type: 'warning' },
  [OrderStatus.Shipping]: { label: '配送中', type: 'primary' },
  [OrderStatus.Completed]: { label: '已完成', type: 'success' },
  [OrderStatus.Cancelled]: { label: '已取消', type: 'info' },
  [OrderStatus.AfterSale]: { label: '售后中', type: 'danger' },
}

export const paymentStatusMap: Record<PaymentStatus, string> = {
  [PaymentStatus.Unpaid]: '未支付',
  [PaymentStatus.Paid]: '已支付',
  [PaymentStatus.Refunded]: '已退款',
}

export function getOrderStatusMeta(status: OrderStatus) {
  return orderStatusMap[status]
}
