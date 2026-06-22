import type { Component } from 'vue'
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileSearch,
  Headphones,
  Home,
  Package,
  Settings,
  Shirt,
  Store,
  Ticket,
  Users,
} from '@lucide/vue'

export interface MenuItem {
  title: string
  path: string
  icon?: Component
  permission?: string
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    title: '工作台',
    path: '/workbench/merchant',
    icon: Home,
    children: [
      { title: '商户看板', path: '/workbench/merchant' },
      { title: '代工看板', path: '/workbench/oem' },
    ],
  },
  {
    title: '会员管理',
    path: '/members',
    icon: Users,
    children: [
      { title: '会员列表', path: '/members' },
    ],
  },
  {
    title: '订单中心',
    path: '/orders',
    icon: ClipboardList,
    children: [
      { title: '订单列表', path: '/orders' },
      { title: '新建订单', path: '/orders/create' },
      { title: '批量订单', path: '/orders/batch' },
    ],
  },
  {
    title: '客户管理',
    path: '/customers/merchants',
    icon: Store,
    children: [
      { title: '商户列表', path: '/customers/merchants' },
      { title: '新增商户', path: '/customers/merchants/create' },
      { title: '品牌管理', path: '/customers/brands' },
    ],
  },
  {
    title: '商品中心',
    path: '/products/banners',
    icon: Package,
    children: [
      { title: '轮播图管理', path: '/products/banners' },
      { title: '类目管理', path: '/products/categories' },
      { title: '网店商品', path: '/products/online' },
      { title: '抖音商品', path: '/products/douyin' },
    ],
  },
  {
    title: '履约管理',
    path: '/fulfillment/logistics',
    icon: Boxes,
    children: [
      { title: '物流中心', path: '/fulfillment/logistics' },
      { title: '外呼中心', path: '/fulfillment/call-center' },
    ],
  },
  {
    title: '数据查询',
    path: '/data/orders',
    icon: FileSearch,
    children: [
      { title: '订单查询', path: '/data/orders' },
      { title: '衣物查询', path: '/data/clothes' },
      { title: '工厂产量', path: '/data/factories' },
    ],
  },
  {
    title: '工单管理',
    path: '/tickets',
    icon: Ticket,
    children: [{ title: '工单管理', path: '/tickets' }],
  },
  {
    title: '系统设置',
    path: '/settings/employees',
    icon: Settings,
    children: [
      { title: '员工管理', path: '/settings/employees' },
      { title: '打印配置', path: '/settings/print' },
      { title: '代工价配置', path: '/settings/prices' },
      { title: '机器人配置', path: '/settings/robot' },
      { title: '个人资料', path: '/settings/profile' },
    ],
  },
]

export const quickActions = [
  { title: '新建订单', path: '/orders/create', icon: Shirt },
  { title: '会员管理', path: '/members', icon: Users },
  { title: '处理工单', path: '/tickets', icon: Headphones },
  { title: '查看趋势', path: '/workbench/merchant', icon: BarChart3 },
]

