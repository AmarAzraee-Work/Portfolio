const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Please enter your name.'
  if (!email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Please enter a valid email address.'
  if (!message.trim()) errors.message = 'Please enter a message.'
  return errors
}

export async function sendContact(formId, values) {
  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  })
  if (!response.ok) throw new Error(`Formspree responded with ${response.status}`)
}
