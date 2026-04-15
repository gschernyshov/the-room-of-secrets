import {
  changeInfoSchema,
  type ChangeInfoFormData,
  type FieldKey,
} from '../lib/cnangeInfoSchema'
import { type User } from '@/entities/user/model/types'

export const getInitialFormData = (
  user: User | null,
  nameFiled: FieldKey
): ChangeInfoFormData => ({
  [nameFiled]: user?.[nameFiled] ?? '',
})

export const fieldNames = Object.keys(changeInfoSchema.shape) as Array<FieldKey>
