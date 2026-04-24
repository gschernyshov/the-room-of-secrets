import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, PasswordInput, Button } from '@gravity-ui/uikit'
import { useLogin } from '../model/useLogin'
import { loginSchema, type LoginData } from '../model/schema'
import { initLoginData, fieldNames } from '../model/initData'
import { useShowAlert } from '@/widgets/globalAlert'
import { createHandleFormErrors } from '@/shared/lib/form/createHandleFormErrors'
import styles from './LoginForm.module.scss'

export const LoginForm = () => {
  const { handleLogin } = useLogin()
  const { successAlert } = useShowAlert()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      ...initLoginData,
    },
  })
  const handleErrors = createHandleFormErrors<LoginData>(fieldNames, setError)

  const onSubmit = async (data: LoginData) => {
    if (isSubmitting) return

    try {
      await handleLogin(data)
      successAlert('Вход в систему', 'Вы успешно вошли в систему')
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
        <h2 className={styles['login-form__title']}>Вход</h2>

        {errors.root && (
          <div className={styles['login-form__error']}>
            {errors.root?.message}
          </div>
        )}

        <div className={styles['login-form__field']}>
          <label htmlFor="email">Email</label>
          <TextInput
            id="email"
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
          <label htmlFor="password">Пароль</label>
          <PasswordInput
            id="password"
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
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  )
}
