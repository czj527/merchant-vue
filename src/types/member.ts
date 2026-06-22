export interface Member {
  id: string
  memberNo: string
  name: string
  phone: string
  level: string
  status: 'enabled' | 'disabled'
  orderCount: number
  totalAmount: number
  createdAt: string
}
