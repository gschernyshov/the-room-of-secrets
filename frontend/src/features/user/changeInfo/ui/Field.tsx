import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
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
  const { successAlert, errorAlert } = useShowAlert()
  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    clearErrors,
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
  const form = useRef<HTMLFormElement>(null)
  const [isEdit, setIsEdit] = useState(false)
  // eslint-disable-next-line react-hooks/incompatible-library
  const currentValue = watch(nameField)

  useEffect(() => {
    if (errors.root) {
      errorAlert('Обновление данных пользователя', errors.root.message)
    }
  }, [errors.root])

  useOnClickOutside(form, () => {
    if (!isEdit || isSubmitting) return

    setTimeout(() => {
      setValue(nameField, user?.[nameField])
      clearErrors(nameField)

      if (user?.[nameField] !== currentValue) {
        errorAlert(
          'Обновление данных пользователя',
          `Вы не сохранили ${nameField}`
        )
      }

      setIsEdit(false)
    }, 0)
  })

  const handleClick = () => {
    if (!isEdit) {
      setIsEdit(true)
      return
    }

    const formElement = form.current
    if (formElement) {
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
      formElement.dispatchEvent(submitEvent)
    }
  }

  const onSubmit = async (data: ChangeInfoFormData) => {
    if (isSubmitting) return

    try {
      await handleChangeInfo(nameField, data)
      successAlert(
        'Обновление данных пользователя',
        `Вы успешно обновили ${nameField}`
      )
      setIsEdit(false)
    } catch (error) {
      handleErrors(error)
    }
  }

  return (
    <form
      ref={form}
      onSubmit={handleSubmit(onSubmit)}
      className={styles['change-info-form']}
    >
      <label htmlFor={nameField} className={styles['change-info-form__label']}>
        {nameField.charAt(0).toUpperCase() + nameField.slice(1)}
      </label>
      <div className={styles['change-info-form__field']}>
        <TextInput
          id={nameField}
          size="xl"
          pin={isEdit ? 'round-round' : 'round-clear'}
          autoFocus={false}
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
          type="button"
          size="xl"
          pin={isEdit ? 'circle-circle' : 'clear-circle'}
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={handleClick}
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
