import { Navigate, type NavigateProps } from 'react-router-dom'

export const AppNavigate = (props: NavigateProps) => {
  return <Navigate {...props} />
}
