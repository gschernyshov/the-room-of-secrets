import { AsideHeader as GravityAsideHeader } from '@gravity-ui/navigation'
import { CardClub } from '@gravity-ui/icons'
import { useAsideState } from '../model/useAsideState'
import { useAsideMenu } from '../model/useAsideMenu'
import { useMenuStyles } from '../model/useMenuStyles'
import { Footer } from './Footer'
import { AsideBackground } from './AsideBackground'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import styles from './AsideHeader.module.scss'

export const AsideHeader = () => {
  const { goToLogin, goToRegister, goToHome, goToProfile, pathname } =
    useAppNavigate()
  const { asideRef, compact, setCompact } = useAsideState()

  const handleLogin = () => {
    goToLogin()
    setCompact(true)
  }

  const handleRegister = () => {
    goToRegister()
    setCompact(true)
  }

  const handleProfile = () => {
    goToProfile()
    setCompact(true)
  }

  const menuItems = useAsideMenu({
    onLogin: handleLogin,
    onRegister: handleRegister,
  })

  const menuItemsWithStyles = useMenuStyles(menuItems, pathname, styles)

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
