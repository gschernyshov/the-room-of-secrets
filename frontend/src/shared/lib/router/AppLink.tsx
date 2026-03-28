import { NavLink, type NavLinkProps } from 'react-router-dom'
import clsx from 'clsx'
import styles from './AppLink.module.css'

export const AppLink = ({ children, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(styles['app-link'], isActive && styles['app-link_active'])
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}
