import type { PageResult } from '@/types/common'
import type { Member } from '@/types/member'
import type { Order } from '@/types/order'
import { dashboardSummary, dashboardWarnings, mockMembers, mockOrders } from '@/mock/modules/merchant'

const delay = (ms = 360) => new Promise((resolve) => window.setTimeout(resolve, ms))

function paginate<T>(list: T[], page = 1, pageSize = 10): PageResult<T> {
  const start = (page - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
  }
}

export async function getDashboardSummary() {
  await delay()
  return dashboardSummary
}

export async function getDashboardWarnings() {
  await delay()
  return dashboardWarnings
}

export async function getOrders(params: { page?: number; pageSize?: number; keyword?: string } = {}): Promise<PageResult<Order>> {
  await delay()
  const keyword = params.keyword?.trim()
  const list = keyword
    ? mockOrders.filter((order) => [order.orderNo, order.customerName, order.customerPhone].some((item) => item.includes(keyword)))
    : mockOrders
  return paginate(list, params.page, params.pageSize)
}

export async function getOrderDetail(id: string): Promise<Order | undefined> {
  await delay()
  return mockOrders.find((order) => order.id === id)
}

export async function createOrder() {
  await delay(600)
  return { id: 'ord_new', orderNo: `YX${Date.now()}` }
}

export async function getMembers(params: { page?: number; pageSize?: number; keyword?: string } = {}): Promise<PageResult<Member>> {
  await delay()
  const keyword = params.keyword?.trim()
  const list = keyword
    ? mockMembers.filter((member) => [member.name, member.phone, member.memberNo].some((item) => item.includes(keyword)))
    : mockMembers
  return paginate(list, params.page, params.pageSize)
}
