import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import './SettingsForm.css'
import {
  getFieldErrorId,
  shouldShowFieldError,
  type SettingsFormProps,
  type ValidatedField,
} from './settingsFormUtils'
import {
  mergeSettingsValues,
  validateSettings,
  type SettingsValues,
} from './settingsValidation'

export default function SettingsForm({
  initialValues = {},
  onSave,
}: SettingsFormProps) {
  const [values, setValues] = useState<SettingsValues>(() =>
    mergeSettingsValues(initialValues),
  )
  const [touched, setTouched] = useState<
    Partial<Record<ValidatedField, boolean>>
  >({})
  const [saved, setSaved] = useState(false)
  const initialValuesRef = useRef(JSON.stringify(initialValues))

  useEffect(() => {
    const nextInitialValues = JSON.stringify(initialValues)

    if (initialValuesRef.current === nextInitialValues) return

    initialValuesRef.current = nextInitialValues
    setValues(mergeSettingsValues(initialValues))
    setTouched({})
    setSaved(false)
  }, [initialValues])

  const errors = useMemo(() => validateSettings(values), [values])
  const isValid = Object.keys(errors).length === 0

  function updateField<K extends keyof SettingsValues>(
    key: K,
    value: SettingsValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }))
    setSaved(false)
  }

  function markTouched(field: ValidatedField) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setTouched({ displayName: true, email: true })

    if (!isValid) return

    onSave?.(values)
    setSaved(true)
  }

  function handleReset() {
    setValues(mergeSettingsValues(initialValues))
    setTouched({})
    setSaved(false)
  }

  function renderFieldError(field: ValidatedField) {
    const error = errors[field]
    const visible =
      error && shouldShowFieldError(field, touched, values)

    if (!visible) return null

    return (
      <span
        id={getFieldErrorId(field)}
        className="settings-form__error"
        role="alert"
      >
        {error}
      </span>
    )
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your account preferences and notifications.</p>
      </header>

      {saved && (
        <p className="settings-form__status" role="status">
          Settings saved successfully.
        </p>
      )}

      <section className="settings-form__section" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>

        <div className="settings-form__field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            required
            minLength={3}
            value={values.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
            onBlur={() => markTouched('displayName')}
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={
              errors.displayName && shouldShowFieldError('displayName', touched, values)
                ? getFieldErrorId('displayName')
                : undefined
            }
          />
          {renderFieldError('displayName')}
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => markTouched('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email && shouldShowFieldError('email', touched, values)
                ? getFieldErrorId('email')
                : undefined
            }
          />
          {renderFieldError('email')}
        </div>
      </section>

      <section
        className="settings-form__section"
        aria-labelledby="preferences-heading"
      >
        <h2 id="preferences-heading">Preferences</h2>

        <div className="settings-form__field">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={values.theme}
            onChange={(event) =>
              updateField('theme', event.target.value as SettingsValues['theme'])
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="settings-form__field">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={values.language}
            onChange={(event) => updateField('language', event.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="settings-form__field">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={values.timezone}
            onChange={(event) => updateField('timezone', event.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Asia/Kolkata">India Standard Time</option>
          </select>
        </div>
      </section>

      <section
        className="settings-form__section"
        aria-labelledby="notifications-heading"
      >
        <h2 id="notifications-heading">Notifications</h2>

        <label className="settings-form__toggle" htmlFor="emailNotifications">
          <input
            id="emailNotifications"
            name="emailNotifications"
            type="checkbox"
            checked={values.emailNotifications}
            onChange={(event) =>
              updateField('emailNotifications', event.target.checked)
            }
          />
          <span className="settings-form__toggle-label">
            <strong>Email notifications</strong>
            <small>Receive updates about your account activity.</small>
          </span>
        </label>

        <label className="settings-form__toggle" htmlFor="pushNotifications">
          <input
            id="pushNotifications"
            name="pushNotifications"
            type="checkbox"
            checked={values.pushNotifications}
            onChange={(event) =>
              updateField('pushNotifications', event.target.checked)
            }
          />
          <span className="settings-form__toggle-label">
            <strong>Push notifications</strong>
            <small>Get alerts on this device.</small>
          </span>
        </label>

        <label className="settings-form__toggle" htmlFor="marketingEmails">
          <input
            id="marketingEmails"
            name="marketingEmails"
            type="checkbox"
            checked={values.marketingEmails}
            onChange={(event) =>
              updateField('marketingEmails', event.target.checked)
            }
          />
          <span className="settings-form__toggle-label">
            <strong>Marketing emails</strong>
            <small>Product news and feature announcements.</small>
          </span>
        </label>
      </section>

      <div className="settings-form__actions">
        <button
          type="button"
          className="settings-form__button settings-form__button--secondary"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="submit"
          className="settings-form__button settings-form__button--primary"
          disabled={!isValid}
          aria-disabled={!isValid}
        >
          Save changes
        </button>
      </div>
    </form>
  )
}
