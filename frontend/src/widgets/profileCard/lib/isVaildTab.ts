import { TAB_CONFIG, type Tab } from '../model/tab'

export const isValidTab = (value: string): value is Tab =>
  Object.keys(TAB_CONFIG).includes(value)
