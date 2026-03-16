import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, PasswordInput, Button } from '@gravity-ui/uikit'
import { useLogin } from '../lib/useLogin'
import { loginSchema, type LoginFormData } from '../lib/loginSchema'
import { initLoginFormData } from '../model/initLoginFormData'
import { AppError } from '@/shared/utils/errors'
import { safeJsonParse } from '@/shared/utils/safeJsonParse'
import styles from './LoginForm.module.scss'

const LOGIN_FORM_FIELDS = {
  login: 'email',
  password: 'password',
} as const

const UNEXPECTED_ERROR = {
  type: 'server',
  message: 'При авторизации возникла непредвиденная ошибка',
} as const

export const LoginForm = () => {
  const { login } = useLogin()
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

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
    } catch (error) {
      if (!(error instanceof AppError)) {
        setError('root', UNEXPECTED_ERROR)
        return
      }

      const parsedMessage = safeJsonParse(error.message)

      if (Array.isArray(parsedMessage)) {
        parsedMessage.forEach(error => {
          if (
            error &&
            typeof error === 'object' &&
            'path' in error &&
            typeof error.path === 'string' &&
            Object.values(LOGIN_FORM_FIELDS).includes(error.path) &&
            'msg' in error &&
            typeof error.msg === 'string'
          ) {
            setError(error.path, {
              type: 'server',
              message: error.msg,
            })
          }
        })
      } else if (typeof parsedMessage === 'string') {
        setError('root', {
          type: 'server',
          message: parsedMessage,
        })
      } else {
        setError('root', UNEXPECTED_ERROR)
      }
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Вход</h2>

        {errors.root && (
          <div className={styles.error}>{errors.root?.message}</div>
        )}

        <div className={styles.field}>
          <label>Email</label>
          <TextInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите email"
            validationState={errors.email ? 'invalid' : undefined}
            errorMessage={errors.email?.message}
            {...register(LOGIN_FORM_FIELDS.login)}
            style={{
              '--g-text-input-border-color': 'white',
              '--g-text-input-border-radius': '100px',
            }}
          />
        </div>

        <div className={styles.field}>
          <label>Пароль</label>
          <PasswordInput
            size="xl"
            pin="round-round"
            disabled={isSubmitting}
            placeholder="Введите пароль"
            validationState={errors.password ? 'invalid' : undefined}
            errorMessage={errors.password?.message}
            {...register(LOGIN_FORM_FIELDS.password)}
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
          style={{ '--g-button-background-color': 'rgb(222, 222, 222)' }}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  )
}
