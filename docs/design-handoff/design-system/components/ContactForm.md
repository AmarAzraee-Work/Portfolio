# ContactForm

Name / email / message form with inline validation and a success state.

- Provide `onSubmit(values)` returning a promise (e.g. a Laravel endpoint or Formspree). Resolve → success panel; reject → an alert asking them to email instead.
- Validates on submit: empty name, malformed email, message under 10 characters. Errors sit under each field with an icon, are linked by `aria-describedby`, and focus jumps to the first invalid field.
- Inputs use `border-input` (3.5:1); invalid ones switch to `danger` and keep the written message.
- `initialErrors` / `initialStatus` exist for previews only.
