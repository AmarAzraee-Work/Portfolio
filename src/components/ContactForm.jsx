import { useState } from 'react'
import { validateContact, sendContact } from '../lib/contact'
import { btnPrimary } from './buttonStyles'

const EMPTY = { name: '', email: '', message: '', _gotcha: '' }

function Field({ label, name, type = 'text', multiline = false, value, error, onChange }) {
  const Control = multiline ? 'textarea' : 'input'
  const errorId = `${name}-error`
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-xs text-muted">
        {label}
      </label>
      <Control
        id={name}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 5 : undefined}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-1.5 w-full rounded border border-line bg-bg px-3 py-2 text-heading focus:border-accent"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function EmailLink({ email }) {
  return (
    <a href={`mailto:${email}`} className="text-accent hover:underline">
      {email}
    </a>
  )
}

export default function ContactForm({ formId, fallbackEmail }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  if (!formId) {
    return (
      <p className="leading-relaxed">
        Email me directly at <EmailLink email={fallbackEmail} />.
      </p>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')
    try {
      await sendContact(formId, values)
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="name" name="name" value={values.name} error={errors.name} onChange={handleChange} />
      <Field label="email" name="email" type="email" value={values.email} error={errors.email} onChange={handleChange} />
      <Field label="message" name="message" multiline value={values.message} error={errors.message} onChange={handleChange} />

      {/* Honeypot: hidden from people, bots fill it in, Formspree drops those submissions. */}
      <input
        type="text"
        name="_gotcha"
        value={values._gotcha}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <button type="submit" disabled={status === 'sending'} className={`${btnPrimary} disabled:opacity-60`}>
        {status === 'sending' ? 'sending…' : 'send message'}
      </button>

      <div role="status" aria-live="polite" className="min-h-6 text-sm">
        {status === 'success' && <p className="text-accent">Message sent. I&apos;ll get back to you soon.</p>}
        {status === 'error' && (
          <p>
            Something went wrong. Please email me directly at <EmailLink email={fallbackEmail} />.
          </p>
        )}
      </div>
    </form>
  )
}
