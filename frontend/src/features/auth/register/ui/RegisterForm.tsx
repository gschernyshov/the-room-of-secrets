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
  const { handleRegister } = useRegister()
  const { successAlert } = useShowAlert()
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
    <div className={styles['container']}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
        <h2 className={styles['form__title']}>Регистрация</h2>

        {errors.root && (
          <div className={styles['form__error']}>{errors.root?.message}</div>
        )}

        <div className={styles['form__field']}>
          <label>Username</label>
          <TextInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите username"
            validationState={errors.username ? 'invalid' : undefined}
            errorMessage={errors.username?.message}
            {...register('username')}
            style={{
              '--g-text-input-border-color': 'white',
              '--g-text-input-border-radius': '100px',
            }}
          />
        </div>

        <div className={styles['form__field']}>
          <label>Email</label>
          <TextInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите email"
            validationState={errors.email ? 'invalid' : undefined}
            errorMessage={errors.email?.message}
            {...register('email')}
            style={{
              '--g-text-input-border-color': 'white',
              '--g-text-input-border-radius': '100px',
            }}
          />
        </div>

        <div className={styles['form__field']}>
          <label>Пароль</label>
          <PasswordInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите пароль"
            validationState={errors.password ? 'invalid' : undefined}
            errorMessage={errors.password?.message}
            {...register('password')}
            style={{
              '--g-text-input-border-color': 'white',
              '--g-text-input-border-radius': '100px',
            }}
          />
        </div>

        <Button
          view="action"
          type="submit"
          size="xl"
          pin="circle-circle"
          disabled={isSubmitting}
          loading={isSubmitting}
          style={{ '--g-button-background-color': 'rgb(222, 222, 222)' }}
        >
          {isSubmitting ? 'Регистрация...' : 'Регистрация'}
        </Button>
      </form>
    </div>
  )
}
