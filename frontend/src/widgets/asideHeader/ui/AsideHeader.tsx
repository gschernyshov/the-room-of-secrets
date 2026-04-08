import clsx from 'clsx'
import { useRef, useMemo, useCallback } from 'react'
import { AsideHeader as GravityAsideHeader } from '@gravity-ui/navigation'
import { CardClub } from '@gravity-ui/icons'
import { Footer } from './Footer'
import { AsideBackground } from './AsideBackground'
import { ID_TO_ROUTE, buildGuestMenuItems, buildAuthMenuItems } from '../сonfig'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import styles from './AsideHeader.module.scss'

export const AsideHeader = () => {
  const { pathname, goToLogin, goToRegister, goToHome, goToProfile } =
    useAppNavigate()
  const status = useSessionStore(state => state.status)
  const asideRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useLocalStorage('aside-open', true)

  const handleClose = useCallback(() => {
    if (compact) return
    setCompact(true)
  }, [compact, setCompact])

  useOnClickOutside(asideRef, handleClose)

  const handleLogin = useCallback(() => {
    goToLogin()
    setCompact(true)
  }, [goToLogin, setCompact])

  const handleRegister = useCallback(() => {
    goToRegister()
    setCompact(true)
  }, [goToRegister, setCompact])

  const handleProfile = useCallback(() => {
    goToProfile()
    setCompact(true)
  }, [goToProfile, setCompact])

  const menuItems = useMemo(() => {
    if (status !== 'authenticated') {
      return buildGuestMenuItems({
        onLogin: handleLogin,
        onRegister: handleRegister,
      })
    }
    return buildAuthMenuItems()
  }, [status, handleLogin, handleRegister])

  const menuItemsWithStyles = menuItems.map(item => ({
    ...item,
    className: clsx(
      styles['aside-header__item'],
      pathname === ID_TO_ROUTE[item.id] && styles['aside-header__item--active']
    ),
  }))

  return (
    <div ref={asideRef} className={styles['aside-header']}>
      <GravityAsideHeader
        compact={compact} // Визуальное состояние элемента навигации
        onChangeCompact={() => setCompact(!compact)} // Обратный вызов, срабатывающий при изменении визуального состояния элемента навигации
        logo={{
          icon: CardClub,
          iconSize: 30,
          text: 'The room of secrets',
          textSize: 16,
          onClick: () => goToHome(),
        }} // Контейнер логотипа, включающий иконку с заголовком и обрабатывающий клики
        menuItems={menuItemsWithStyles} // Элементы в среднем блоке навигации
        menuMoreTitle="..." // Дополнительный заголовок для menuItems, если элементы не помещаются
        renderFooter={() => (
          <Footer compact={compact} handleProfile={handleProfile} />
        )}
        multipleTooltip={false} // Отображает несколько тултипов при наведении на элементы меню (menuItems) в свернутом состоянии
        customBackground={<AsideBackground />} // Фон AsideHeader
        hideCollapseButton={false} // Скрывает CollapseButton
      />
    </div>
  )
}
