export const TAB_CONFIG = {
  profile: 'Профиль',
  password: 'Пароль',
  rooms: 'Комнаты',
} as const

export type Tab = keyof typeof TAB_CONFIG

export type TabItem = {
  id: Tab
  label: (typeof TAB_CONFIG)[Tab]
}

export const TABS: readonly TabItem[] = Object.entries(TAB_CONFIG).map(
  ([id, label]) => ({
    id: id as Tab,
    label,
  })
)

export const isValidTab = (value: string): value is Tab =>
  Object.keys(TAB_CONFIG).includes(value)
