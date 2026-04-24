import { changeInfoSchema, type ChangeInfo, type FieldKey } from './schema'
import { type User } from '@/entities/user/model/types'

export const getInitialFormData = (
  user: User | null,
  nameFiled: FieldKey
): ChangeInfo => ({
  [nameFiled]: user?.[nameFiled] ?? '',
})

export const fieldNames = Object.keys(changeInfoSchema.shape) as Array<FieldKey>
