import { Link, type LinkProps } from 'react-router-dom'

export const AppLink = ({ children, ...props }: LinkProps) => {
  return <Link {...props}>{children}</Link>
}
