import { type ChangeInfo, type FieldKey } from '../model/schema'
import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const changeInfoApi = async (nameField: FieldKey, data: ChangeInfo) => {
  const response = await apiFetch(ROUTES.user.update(nameField), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  return result
}
