import clsx from 'clsx'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, Button } from '@gravity-ui/uikit'
import { useChangeInfo } from '../lib/useChangeInfo'
import {
  changeInfoSchema,
  type ChangeInfoFormData,
  type FieldKey,
} from '../lib/cnangeInfoSchema'
import { getInitialFormData, fieldNames } from '../model/initChangeInfo'
import { useShowAlert } from '@/widgets/globalAlert'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'
import { createHandleFormErrors } from '@/shared/lib/form/createHandleFormErrors'
import styles from './Field.module.scss'

type Props = {
  nameField: FieldKey
}

export const Field = ({ nameField }: Props) => {
  const user = useSessionStore(state => state.user)
  const { handleChangeInfo } = useChangeInfo()
  const { successAlert } = useShowAlert()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(changeInfoSchema),
    defaultValues: getInitialFormData(user, nameField),
    mode: 'onBlur', // Валидация при потере фокуса
    reValidateMode: 'onBlur', // Перепроверка при изменении
  })
  const handleErrors = createHandleFormErrors<ChangeInfoFormData>(
    fieldNames,
    setError
  )
  const field = useRef<HTMLDivElement>(null)
  const [isEdit, setIsEdit] = useState(false)

  useOnClickOutside(field, () => setIsEdit(false))

  const onSubmit = async (data: ChangeInfoFormData) => {
    if (!isEdit) setIsEdit(true)

    if (!isEdit || isSubmitting) return

    try {
      await handleChangeInfo(nameField, data)
      successAlert(
        'Обновление данных пользоваетля',
        `Вы успешно обновили ${nameField}`
      )
      setIsEdit(false)
    } catch (error) {
      handleErrors(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['change-info-form']}
    >
      <label htmlFor={nameField} className={styles['change-info-form__label']}>
        {nameField}
      </label>
      <div ref={field} className={styles['change-info-form__field']}>
        <TextInput
          id={nameField}
          size="xl"
          pin={isEdit ? 'round-round' : 'round-clear'}
          disabled={!isEdit || isSubmitting}
          placeholder={`Введите ${nameField}`}
          validationState={errors[nameField] ? 'invalid' : undefined}
          errorMessage={errors[nameField]?.message}
          {...register(nameField)}
          className={clsx(
            styles['change-info-form__input'],
            !isEdit && styles['change-info-form__input--not-active']
          )}
        />
        <Button
          view="action"
          type="submit"
          size="xl"
          pin={isEdit ? 'circle-circle' : 'clear-circle'}
          disabled={isSubmitting}
          loading={isSubmitting}
          className={clsx(
            styles['change-info-form__button'],
            !isEdit && styles['change-info-form__button--not-active']
          )}
        >
          {isEdit
            ? isSubmitting
              ? 'Обновление...'
              : 'Обновить'
            : 'Редактировать'}
        </Button>
      </div>
    </form>
  )
}
