import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, PasswordInput, Button } from '@gravity-ui/uikit'
import { useLogin } from '../lib/useLogin'
import { loginSchema, type LoginFormData } from '../lib/loginSchema'
import { initLoginFormData } from '../model/initLoginFormData'
import { AppError } from '@/shared/utils/errors'
import { safeJsonParse } from '@/shared/utils/safeJsonParse'

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Вход</h2>

      {errors.root && <div>{errors.root?.message}</div>}

      <div>
        <label>Email</label>
        <TextInput
          size="m"
          pin="round-brick"
          disabled={isSubmitting}
          placeholder="Введите email"
          validationState={errors.email ? 'invalid' : undefined}
          errorMessage={errors.email?.message}
          {...register(LOGIN_FORM_FIELDS.login)}
        />
      </div>

      <div>
        <label>Пароль</label>
        <PasswordInput
          size="m"
          pin="round-brick"
          disabled={isSubmitting}
          placeholder="Введите пароль"
          validationState={errors.password ? 'invalid' : undefined}
          errorMessage={errors.password?.message}
          {...register(LOGIN_FORM_FIELDS.password)}
        />
      </div>

      <Button size="m" type="submit" view="action" disabled={isSubmitting}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  )
}
