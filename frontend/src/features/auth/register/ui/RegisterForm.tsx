import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, PasswordInput, Button } from '@gravity-ui/uikit'
import { useRegister } from '../lib/useRegister'
import { registerSchema, type RegisterFormData } from '../lib/registerSchema'
import { initRegisterData, fieldNames } from '../model/initRegisterData'
import { useShowAlert } from '@/widgets/globalAlert'
import { createHandleFormErrors } from '@/shared/lib/form/createHandleFormErrors'
import styles from './RegisterForm.module.scss'

export const RegisterForm = () => {
  const { handleRegister } = useRegister()
  const { successAlert } = useShowAlert()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      ...initRegisterData,
    },
  })
  const handleErrors = createHandleFormErrors<RegisterFormData>(
    fieldNames,
    setError
  )

  const onSubmit = async (data: RegisterFormData) => {
    if (isSubmitting) return

    try {
      await handleRegister(data)
      successAlert(
        'Регистрация в системе',
        'Вы успешно зарегистрировались в системе'
      )
    } catch (error) {
      handleErrors(error)
    }
  }

  return (
    <div className={styles['login-form']}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['login-form__container']}
      >
        <h2 className={styles['login-form__title']}>Регистрация</h2>

        {errors.root && (
          <div className={styles['login-form__error']}>
            {errors.root?.message}
          </div>
        )}

        <div className={styles['login-form__field']}>
          <label>Username</label>
          <TextInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите username"
            validationState={errors.username ? 'invalid' : undefined}
            errorMessage={errors.username?.message}
            {...register('username')}
            className={styles['login-form__input']}
          />
        </div>

        <div className={styles['login-form__field']}>
          <label>Email</label>
          <TextInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите email"
            validationState={errors.email ? 'invalid' : undefined}
            errorMessage={errors.email?.message}
            {...register('email')}
            className={styles['login-form__input']}
          />
        </div>

        <div className={styles['login-form__field']}>
          <label>Пароль</label>
          <PasswordInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите пароль"
            validationState={errors.password ? 'invalid' : undefined}
            errorMessage={errors.password?.message}
            {...register('password')}
            className={styles['login-form__input']}
          />
        </div>

        <Button
          view="action"
          type="submit"
          size="xl"
          pin="circle-circle"
          disabled={isSubmitting}
          loading={isSubmitting}
          className={styles['login-form__button']}
        >
          {isSubmitting ? 'Регистрация...' : 'Регистрация'}
        </Button>
      </form>
    </div>
  )
}
