import { Loader as LoaderGravityUI } from '@gravity-ui/uikit'
import styles from './Loader.module.scss'

type Props = {
  size?: 's' | 'm' | 'l'
}

export const Loader = ({ size }: Props) => {
  return (
    <div className={styles['loader-container']}>
      <LoaderGravityUI size={size} />
    </div>
  )
}
