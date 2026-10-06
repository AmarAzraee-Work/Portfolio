const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Please enter your name.'
  if (!email.trim()) errors.email = 'Please enter your email so I can reply.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'That email looks incomplete — check for a missing @ or domain.'
  if (message.trim().length < 10) errors.message = 'Please write a short message (at least 10 characters).'
  return errors
}

// Posts the message as JSON (Formspree today, a Laravel endpoint later). Gives up after timeoutMs so the
// visitor is never left waiting on "sending" forever.
export async function sendContact(endpoint, values, { timeoutMs = 15000 } = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) throw new Error(`Contact endpoint responded with ${response.status}`)
}
