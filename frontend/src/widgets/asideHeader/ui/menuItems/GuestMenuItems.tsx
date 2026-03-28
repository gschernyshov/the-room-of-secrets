import clsx from 'clsx'
import { ArrowRightToSquare, PersonPlus } from '@gravity-ui/icons'
import { type AsideHeaderItem } from '@gravity-ui/navigation'
import { AppRoutes } from '@/shared/consts/router'
import styles from '../AsideHeader.module.scss'

type Params = {
  pathname: string
  onLogin: () => void
  onRegister: () => void
}

export const GuestMenuItems = ({
  pathname,
  onLogin,
  onRegister,
}: Params): AsideHeaderItem[] => {
  const getItemClass = (route: string) =>
    clsx(
      styles['aside-header__item'],
      pathname === route && styles['aside-header__item_active']
    )

  return [
    {
      id: 'login', // Идентификатор элемента меню
      type: 'action', // Тип элемента меню, определяющий его внешний вид
      icon: ArrowRightToSquare, // Иконка меню на основе компонента Icon из фреймворка UIKit
      title: 'Вход', // Заголовок элемента меню
      onItemClickCapture: () => {
        onLogin()
      }, // Обратный вызов, срабатывающий при клике по элементу
      enableTooltip: true, // Отображать ли подсказку
      tooltipText: 'Войти в личный кабинет', // Содержимое тултипа
      className: getItemClass(AppRoutes.LOGIN), // HTML-атрибут class
    },
    {
      id: 'register',
      type: 'action',
      icon: PersonPlus,
      title: 'Регистрация',
      onItemClickCapture: () => {
        onRegister()
      },
      enableTooltip: true,
      tooltipText: 'Зарегистироваться на платформе',
      className: getItemClass(AppRoutes.REGISTER),
    },
  ]
}
