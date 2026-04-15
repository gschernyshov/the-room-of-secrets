import {
  changePasswordSchema,
  type FieldKey,
} from '../lib/changePasswordSchema'

export const fieldNames = Object.keys(
  changePasswordSchema.shape
) as Array<FieldKey>
