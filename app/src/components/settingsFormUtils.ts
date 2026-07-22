import { validateSettings, type SettingsValues } from './settingsValidation'

export type { SettingsValues, Theme } from './settingsValidation'
export { defaultSettingsValues } from './settingsValidation'

export type ValidatedField = 'displayName' | 'email'

export type SettingsFormProps = {
  initialValues?: Partial<SettingsValues>
  onSave?: (values: SettingsValues) => void
}

export function getFieldErrorId(field: ValidatedField): string {
  return `${field}-error`
}

export function shouldShowFieldError(
  field: ValidatedField,
  touched: Partial<Record<ValidatedField, boolean>>,
  values: SettingsValues,
): boolean {
  return Boolean(touched[field]) || values[field].length > 0
}

export function isSettingsFormValid(values: SettingsValues): boolean {
  return Object.keys(validateSettings(values)).length === 0
}
