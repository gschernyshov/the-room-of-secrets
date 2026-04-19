import { Loader as LoaderGravityUI } from '@gravity-ui/uikit'
import styles from './Loader.module.scss'

const Loader = () => {
  return (
    <div className={styles['loader-container']}>
      <LoaderGravityUI />
    </div>
  )
}

export default Loader
