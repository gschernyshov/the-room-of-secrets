import { useRef, useMemo, useCallback } from 'react'
import { AsideHeader as GravityAsideHeader } from '@gravity-ui/navigation'
import { CardClub } from '@gravity-ui/icons'
import { GuestMenuItems, AuthMenuItems } from './menuItems'
import { Footer } from './footer'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { CustomAsideBackground } from '@/shared/ui/CustomAsideBackground'
import styles from './AsideHeader.module.scss'

export const AsideHeader = () => {
  const { pathname, goToLogin, goToRegister, goToHome } = useAppNavigate()
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

  const menuItems = useMemo(() => {
    if (status !== 'authenticated') {
      return GuestMenuItems({
        pathname: pathname,
        onLogin: handleLogin,
        onRegister: handleRegister,
      })
    }
    return AuthMenuItems()
  }, [status, pathname, handleLogin, handleRegister])

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
        menuItems={menuItems} // Элементы в среднем блоке навигации
        menuMoreTitle="..." // Дополнительный заголовок для menuItems, если элементы не помещаются
        renderFooter={data => <Footer {...data} />}
        multipleTooltip={false} // Отображает несколько тултипов при наведении на элементы меню (menuItems) в свернутом состоянии
        customBackground={<CustomAsideBackground />} // Фон AsideHeader
        hideCollapseButton={false} // Скрывает CollapseButton
      />
    </div>
  )
}
