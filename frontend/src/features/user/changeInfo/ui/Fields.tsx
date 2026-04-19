import { Field } from './Field'
import { fieldNames } from '../model/initChangeInfo'
import styles from './Fields.module.scss'

export const Fields = () => {
  return (
    <div className={styles['fields-container']}>
      {fieldNames.map(nameField => (
        <Field key={nameField} nameField={nameField} />
      ))}
    </div>
  )
}
