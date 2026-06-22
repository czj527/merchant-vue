export type StatusType = 'info' | 'primary' | 'success' | 'warning' | 'danger'

export interface TableColumnConfig {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  type?: 'text' | 'status' | 'money' | 'number'
  statusMap?: Record<string, { label: string; type?: StatusType }>
}

export interface SimpleActionResult {
  success: boolean
  message: string
}
