import { Loader as GravityLoader } from '@gravity-ui/uikit'
import styles from './Loader.module.scss'

type Props = {
  size?: 's' | 'm' | 'l'
}

export const Loader = ({ size }: Props) => {
  return (
    <div className={styles['loader-container']}>
      <GravityLoader size={size} />
    </div>
  )
}
