import clsx from 'clsx'
import { type AsideHeaderItem } from '@gravity-ui/navigation'

export const useMenuStyles = (
  menuItems: AsideHeaderItem[],
  pathname: string,
  styles: CSSModuleClasses
) => {
  return menuItems.map(item => {
    return {
      ...item,
      className: clsx(
        styles['aside-header__item'],
        pathname === item.id && styles['aside-header__item--active']
      ),
    }
  })
}
