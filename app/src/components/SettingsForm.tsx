import { useState, type FormEvent } from 'react'
import './SettingsForm.css'

export type SettingsValues = {
  displayName: string
  email: string
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  language: string
  timezone: string
}

const defaultValues: SettingsValues = {
  displayName: '',
  email: '',
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  language: 'en',
  timezone: 'UTC',
}

type SettingsFormProps = {
  initialValues?: Partial<SettingsValues>
  onSave?: (values: SettingsValues) => void
}

export default function SettingsForm({
  initialValues = {},
  onSave,
}: SettingsFormProps) {
  const [values, setValues] = useState<SettingsValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SettingsValues, string>>>({})
  const [saved, setSaved] = useState(false)

  function updateField<K extends keyof SettingsValues>(
    key: K,
    value: SettingsValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setSaved(false)
  }

  function validate(formValues: SettingsValues) {
    const nextErrors: Partial<Record<keyof SettingsValues, string>> = {}

    if (!formValues.displayName.trim()) {
      nextErrors.displayName = 'Display name is required.'
    }

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    onSave?.(values)
    setSaved(true)
  }

  function handleReset() {
    setValues({ ...defaultValues, ...initialValues })
    setErrors({})
    setSaved(false)
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
            value={values.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={errors.displayName ? 'displayName-error' : undefined}
          />
          {errors.displayName && (
            <span id="displayName-error" className="settings-form__error">
              {errors.displayName}
            </span>
          )}
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="settings-form__error">
              {errors.email}
            </span>
          )}
        </div>
      </section>

      <section
        className="settings-form__section"
        aria-labelledby="notifications-heading"
      >
        <h2 id="notifications-heading">Notifications</h2>

        <label className="settings-form__toggle">
          <input
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

        <label className="settings-form__toggle">
          <input
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

        <label className="settings-form__toggle">
          <input
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

      <section
        className="settings-form__section"
        aria-labelledby="preferences-heading"
      >
        <h2 id="preferences-heading">Preferences</h2>

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

      <div className="settings-form__actions">
        <button type="button" className="settings-form__button settings-form__button--secondary" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className="settings-form__button settings-form__button--primary">
          Save changes
        </button>
      </div>
    </form>
  )
}
