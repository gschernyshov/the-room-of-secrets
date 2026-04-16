import clsx from 'clsx'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, Button, Tooltip, ClipboardButton } from '@gravity-ui/uikit'
import { Paintbrush } from '@gravity-ui/icons'
import { generatePassword } from '../lib/generatePassword'
import { useChangePassword } from '../lib/useChangePassword'
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../lib/changePasswordSchema'
import { fieldNames } from '../model/initChangePassword'
import { useShowAlert } from '@/widgets/globalAlert'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'
import { createHandleFormErrors } from '@/shared/lib/form/createHandleFormErrors'
import styles from './ChangePassword.module.scss'

export const ChangePassword = () => {
  const { handleChangePassword } = useChangePassword()
  const { successAlert, errorAlert } = useShowAlert()
  const {
    register,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '' },
    mode: 'onBlur', // Валидация при потере фокуса
    reValidateMode: 'onBlur', // Перепроверка при изменении
  })
  const handleErrors = createHandleFormErrors<ChangePasswordFormData>(
    fieldNames,
    setError
  )
  const form = useRef<HTMLFormElement>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')

  useEffect(() => {
    if (errors.root) {
      errorAlert('Обновление данных пользоваетля', errors.root.message)
    }
  }, [errors.root])

  useOnClickOutside(form, () => {
    if (!isEdit || isSubmitting) return

    setTimeout(() => {
      setValue('password', '')
      clearErrors('password')

      setGeneratedPassword('')

      errorAlert('Обновление данных пользоваетля', 'Вы не сохранили пароль')

      setIsEdit(false)
    }, 0)
  })

  const handleGeneratePassword = () => {
    const password = generatePassword()
    setGeneratedPassword(password)
    setValue('password', password)
  }

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

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (isSubmitting) return

    try {
      await handleChangePassword(data)
      successAlert(
        'Обновление данных пользователя',
        `Вы успешно обновили пароль`
      )
      setValue('password', '')
      setGeneratedPassword('')
      setIsEdit(false)
    } catch (error) {
      handleErrors(error)
    }
  }

  return (
    <form
      ref={form}
      onSubmit={handleSubmit(onSubmit)}
      className={styles['change-password-form']}
    >
      <label
        htmlFor="password"
        className={styles['change-password-form__label']}
      >
        Пароль
      </label>
      <div className={styles['change-password-form__field']}>
        <TextInput
          id="password"
          size="xl"
          pin={isEdit ? 'round-round' : 'round-clear'}
          disabled={!isEdit || isSubmitting}
          type={isEdit ? 'text' : 'password'}
          placeholder={isEdit ? 'Введите пароль' : '••••••••••'}
          validationState={errors.password ? 'invalid' : undefined}
          errorMessage={errors.password?.message}
          {...register('password')}
          className={clsx(
            styles['change-password-form__input'],
            !isEdit && styles['change-password-form__input--not-active']
          )}
        />

        {isEdit && (
          <Tooltip
            content="Автогенерация пароля"
            placement="top"
            openDelay={100}
          >
            <div
              onClick={() => handleGeneratePassword()}
              className={styles['change-password-form__generate-button']}
            >
              <Paintbrush
                className={styles['change-password-form__generate-button-icon']}
              />
            </div>
          </Tooltip>
        )}

        {isEdit && generatedPassword && (
          <div className={styles['change-password-form__clipboard-button']}>
            <ClipboardButton
              text={generatedPassword}
              tooltipInitialText="Скопировать пароль"
              tooltipSuccessText="Пароль скопирован"
              className={styles['change-password-form__clipboard-button-icon']}
            />
          </div>
        )}

        <Button
          view="action"
          type="button"
          size="xl"
          pin={isEdit ? 'circle-circle' : 'clear-circle'}
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={handleClick}
          className={clsx(
            styles['change-password-form__button'],
            !isEdit && styles['change-password-form__button--not-active']
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
