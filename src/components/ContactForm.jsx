import { useEffect, useRef, useState } from 'react'
import { CheckCircle, EnvelopeSimple, PaperPlaneTilt, WarningCircle } from '@phosphor-icons/react'
import { sendContact, validateContact } from '../lib/contact'

const EMPTY = { name: '', email: '', message: '' }
const FIELD_ORDER = ['name', 'email', 'message']

// Keyframes and timings from the design's sendForm(): the form folds away while a small envelope cube flies off.
const FOLD = [
  [
    { transform: 'none', opacity: 1 },
    { transform: 'rotateX(-80deg) scale(.55)', opacity: 0.7, offset: 0.6 },
    { transform: 'rotateX(-90deg) scale(.12)', opacity: 0 },
  ],
  { duration: 650, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' },
]
const FLY = [
  [
    { opacity: 0, transform: 'scale(.2) rotateX(0deg) rotateY(0deg)' },
    { opacity: 1, transform: 'scale(1.1) rotateX(200deg) rotateY(160deg)', offset: 0.4 },
    { opacity: 1, transform: 'translate(0px,0px) scale(1) rotateX(330deg) rotateY(300deg)', offset: 0.65 },
    { opacity: 0, transform: 'translate(260px,-300px) scale(.3) rotateX(540deg) rotateY(500deg)' },
  ],
  { duration: 1500, delay: 380, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' },
]

const cubeFace = {
  position: 'absolute',
  inset: 0,
  border: '1px solid var(--color-accent-400)',
  borderRadius: '6px',
  background: 'color-mix(in srgb, var(--color-accent-800) 88%, transparent)',
}
const FACE_TRANSFORMS = ['rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)']

function EmailLink({ email }) {
  return <a href={`mailto:${email}`}>{email}</a>
}

function Field({ id, label, error, multiline, ...input }) {
  const Control = multiline ? 'textarea' : 'input'
  const errorId = `${id}-error`
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Control id={id} className="input" aria-invalid={error ? 'true' : undefined} aria-describedby={error ? errorId : undefined} {...input} />
      {error && (
        <p id={errorId} style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: '6px 0 0', fontSize: '12px', color: 'var(--color-danger)' }}>
          <WarningCircle aria-hidden="true" style={{ flex: 'none', fontSize: '14px' }} />
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm({ endpoint, email, reducedMotion = false }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [failed, setFailed] = useState(false)
  const [sentName, setSentName] = useState('')
  const busy = useRef(false)
  const formRef = useRef(null)
  const foldRef = useRef(null)
  const sentRef = useRef(null)
  const running = useRef([])

  const canAnimate = !reducedMotion && typeof Element.prototype.animate === 'function'

  useEffect(() => {
    if (status === 'sent' && canAnimate && sentRef.current) {
      sentRef.current.animate(
        [
          { opacity: 0, transform: 'translateY(14px) scale(.97)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' },
      )
    }
  }, [status, canAnimate])

  if (!endpoint) {
    return (
      <div className="card elev-md" style={{ padding: '22px', gap: '10px' }}>
        <span style={{ fontSize: '18px', fontWeight: 500 }}>Send a message</span>
        <p style={{ margin: 0, color: 'var(--color-neutral-300)' }}>
          Email me at <EmailLink email={email} />.
        </p>
      </div>
    )
  }

  const change = (field) => (event) => {
    const value = event.target.value
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest)
  }

  const cancelAnimations = () => {
    running.current.forEach((animation) => animation.cancel())
    running.current = []
  }

  async function submit(event) {
    event.preventDefault()
    if (busy.current) return // one request at a time, even on a fast double click

    const found = validateContact(values)
    setErrors(found)
    const first = FIELD_ORDER.find((field) => found[field])
    if (first) {
      document.getElementById(`contact-${first}`)?.focus()
      return
    }

    busy.current = true
    setFailed(false)
    setSentName(values.name.trim().split(' ')[0] || 'friend')
    setStatus('sending')

    const request = sendContact(endpoint, values)
    let animationDone = Promise.resolve()
    if (canAnimate && formRef.current && foldRef.current) {
      const fold = formRef.current.animate(...FOLD)
      const fly = foldRef.current.animate(...FLY)
      running.current = [fold, fly]
      animationDone = new Promise((resolve) => {
        fly.onfinish = resolve
      })
    }

    try {
      await Promise.all([request, animationDone])
      running.current = []
      setStatus('sent')
    } catch {
      cancelAnimations() // brings the form back exactly as it was
      setStatus('idle')
      setFailed(true)
    } finally {
      busy.current = false
    }
  }

  function sendAnother() {
    cancelAnimations()
    foldRef.current?.getAnimations?.().forEach((animation) => animation.cancel())
    setValues(EMPTY)
    setStatus('idle')
  }

  return (
    <div style={{ position: 'relative', perspective: '1000px', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {status !== 'sent' && (
        <form ref={formRef} onSubmit={submit} noValidate className="card elev-md" style={{ padding: '22px', gap: '14px', transformOrigin: '50% 0%' }}>
          <span style={{ fontSize: '18px', fontWeight: 500 }}>Send a message</span>
          <Field id="contact-name" name="name" label="Your name" placeholder="Ali bin Abu" autoComplete="name" value={values.name} onChange={change('name')} error={errors.name} />
          <Field
            id="contact-email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@email.com"
            autoComplete="email"
            value={values.email}
            onChange={change('email')}
            error={errors.email}
          />
          <Field
            id="contact-message"
            name="message"
            label="Message"
            placeholder="Tell me about your project"
            multiline
            value={values.message}
            onChange={change('message')}
            error={errors.message}
          />
          {failed && (
            <p role="alert" style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: 0, fontSize: '13px', color: 'var(--color-danger)' }}>
              <WarningCircle aria-hidden="true" style={{ flex: 'none', fontSize: '16px' }} />
              <span>
                Something went wrong. Please email me at <EmailLink email={email} />.
              </span>
            </p>
          )}
          <button className="btn btn-primary" type="submit" aria-disabled={status === 'sending' ? 'true' : undefined} style={{ padding: '11px 18px', alignSelf: 'flex-start' }}>
            <PaperPlaneTilt aria-hidden="true" />
            Send message
          </button>
        </form>
      )}
      {status === 'sent' && (
        <div ref={sentRef} role="status" className="card elev-md" style={{ padding: '28px 22px', gap: '12px', alignItems: 'flex-start' }}>
          <CheckCircle aria-hidden="true" style={{ fontSize: '38px', color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '22px', fontWeight: 500 }}>Message sent</span>
          <p style={{ margin: 0, color: 'var(--color-neutral-300)' }}>Thanks, {sentName}. It&apos;s on its way, and I&apos;ll get back to you soon.</p>
          <button className="btn btn-secondary" onClick={sendAnother} style={{ marginTop: '6px' }}>
            Send another
          </button>
        </div>
      )}
      <div
        ref={foldRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '64px',
          height: '64px',
          margin: '-32px 0 0 -32px',
          transformStyle: 'preserve-3d',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ ...cubeFace, transform: 'translateZ(32px)', display: 'grid', placeItems: 'center', color: 'var(--color-accent-200)', fontSize: '26px' }}>
          <EnvelopeSimple />
        </div>
        {FACE_TRANSFORMS.map((t) => (
          <div key={t} style={{ ...cubeFace, transform: `${t} translateZ(32px)` }} />
        ))}
      </div>
    </div>
  )
}
