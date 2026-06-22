export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface SelectOption<T = string> {
  label: string
  value: T
}
