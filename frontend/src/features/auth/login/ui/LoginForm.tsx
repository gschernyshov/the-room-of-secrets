import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, PasswordInput, Button } from '@gravity-ui/uikit'
import { useLogin } from '../lib/useLogin'
import { loginSchema, type LoginFormData } from '../lib/loginSchema'
import { initLoginFormData, fieldNames } from '../model/initLoginFormData'
import { useShowAlert } from '@/widgets/globalAlert'
import { createHandleFormErrors } from '@/shared/lib/form/createHandleFormErrors'
import styles from './LoginForm.module.scss'

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      ...initLoginFormData,
    },
  })
  const { handleLogin } = useLogin()
  const { successAlert } = useShowAlert()
  const handleErrors = createHandleFormErrors<LoginFormData>(
    fieldNames,
    setError
  )

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return

    try {
      await handleLogin(data)
      successAlert('Вход в систему', 'Вы успешно вошли в систему')
    } catch (error) {
      handleErrors(error)
    }
  }

  return (
    <div className={styles['container']}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
        <h2 className={styles['form__title']}>Вход</h2>

        {errors.root && (
          <div className={styles['form__error']}>{errors.root?.message}</div>
        )}

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
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  )
}
