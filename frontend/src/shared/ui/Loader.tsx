import { Loader as LoaderGravityUI } from '@gravity-ui/uikit'
import styles from './Loader.module.scss'

export const Loader = () => {
  return (
    <div className={styles['loader-container']}>
      <LoaderGravityUI />
    </div>
  )
}
