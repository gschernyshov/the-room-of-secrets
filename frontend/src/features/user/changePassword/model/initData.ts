import { changePasswordSchema, type FieldKey } from './schema'

export const fieldNames = Object.keys(
  changePasswordSchema.shape
) as Array<FieldKey>
