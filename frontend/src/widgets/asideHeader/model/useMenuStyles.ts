import clsx from 'clsx'
import { useMemo } from 'react'
import { type AsideHeaderItem } from '@gravity-ui/navigation'

export const useMenuStyles = (
  menuItems: AsideHeaderItem[],
  pathname: string,
  styles: CSSModuleClasses
) => {
  return useMemo(() => {
    return menuItems.map(item => ({
      ...item,
      className: clsx(
        styles['aside-header__item'],
        pathname === item.id && styles['aside-header__item--active']
      ),
    }))
  }, [menuItems, pathname, styles])
}
