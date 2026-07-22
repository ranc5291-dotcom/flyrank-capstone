export type Theme = 'light' | 'dark' | 'system'

export type SettingsValues = {
  displayName: string
  email: string
  theme: Theme
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
}

export type SettingsFieldErrors = Partial<
  Pick<SettingsValues, 'displayName' | 'email'>
>

export const defaultSettingsValues: SettingsValues = {
  displayName: '',
  email: '',
  theme: 'system',
  language: 'en',
  timezone: 'UTC',
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function mergeSettingsValues(
  initialValues: Partial<SettingsValues> = {},
): SettingsValues {
  return {
    ...defaultSettingsValues,
    ...initialValues,
  }
}

export function validateSettings(values: SettingsValues): SettingsFieldErrors {
  const errors: SettingsFieldErrors = {}
  const displayName = values.displayName.trim()

  if (!displayName) {
    errors.displayName = 'Display name is required.'
  } else if (displayName.length < 3) {
    errors.displayName = 'Display name must be at least 3 characters.'
  }

  const email = values.email.trim()

  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}
