import { useCallback, useMemo } from 'react'
import { AsideHeader as GravityAsideHeader } from '@gravity-ui/navigation'
import { CardClub } from '@gravity-ui/icons'
import { Footer } from './Footer'
import { AsideBackground } from './AsideBackground'
import { useAsideState } from '../model/useAsideState'
import { useAsideMenu } from '../model/useAsideMenu'
import { useMenuStyles } from '../model/useMenuStyles'
import { type Room } from '@/entities/room/model/types'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import styles from './AsideHeader.module.scss'

export const AsideHeader = () => {
  const { goToLogin, goToRegister, goToHome, goToProfile, goToRoom, pathname } =
    useAppNavigate()
  const { asideRef, compact, onCompact, handleClose } = useAsideState()

  const handleLogin = useCallback(() => {
    goToLogin()
    handleClose()
  }, [goToLogin, handleClose])

  const handleRegister = useCallback(() => {
    goToRegister()
    handleClose()
  }, [goToRegister, handleClose])

  const handleProfile = useCallback(
    (tab?: string) => {
      goToProfile(tab)
      handleClose()
    },
    [goToProfile, handleClose]
  )

  const handleRoom = useCallback(
    (id: Room['id']) => {
      goToRoom(id)
      handleClose()
    },
    [goToRoom, handleClose]
  )

  const payload = useMemo(
    () => ({
      guestPayload: {
        onLogin: handleLogin,
        onRegister: handleRegister,
      },
      authPayload: {
        compact,
        onProfile: handleProfile,
        onRoom: handleRoom,
      },
    }),
    [compact, handleLogin, handleRegister, handleProfile, handleRoom]
  )

  const menuItems = useAsideMenu(payload)
  const menuItemsWithStyles = useMenuStyles(menuItems, pathname, styles)

  const handleLogoClick = useCallback(() => goToHome(), [goToHome])

  const renderFooter = useCallback(
    () => <Footer compact={compact} handleProfile={handleProfile} />,
    [compact, handleProfile]
  )

  return (
    <div ref={asideRef} className={styles['aside-header']}>
      <GravityAsideHeader
        compact={compact} // Визуальное состояние элемента навигации
        onChangeCompact={onCompact} // Обратный вызов, срабатывающий при изменении визуального состояния элемента навигации
        logo={{
          icon: CardClub,
          iconSize: 30,
          text: 'The room of secrets',
          textSize: 16,
          onClick: handleLogoClick,
        }} // Контейнер логотипа, включающий иконку с заголовком и обрабатывающий клики
        menuItems={menuItemsWithStyles} // Элементы в среднем блоке навигации
        menuMoreTitle="..." // Дополнительный заголовок для menuItems, если элементы не помещаются
        renderFooter={renderFooter}
        multipleTooltip={false} // Отображает несколько тултипов при наведении на элементы меню (menuItems) в свернутом состоянии
        customBackground={<AsideBackground />} // Фон AsideHeader
        hideCollapseButton={false} // Скрывает CollapseButton
      />
    </div>
  )
}
