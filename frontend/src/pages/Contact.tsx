import { Camera, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'
import { getApiBaseUrl } from '../lib/api'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-600'

export function Contact() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch(`${getApiBaseUrl()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      })
      const text = await res.text()
      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
        return
      }
      let payload: unknown = null
      try {
        payload = text ? (JSON.parse(text) as unknown) : null
      } catch {
        /* respuesta no JSON */
      }
      const body =
        payload && typeof payload === 'object' && 'message' in payload
          ? (payload as { message?: string | string[] })
          : {}
      const msg = body.message
      const errText = Array.isArray(msg)
        ? msg.join('. ')
        : typeof msg === 'string'
          ? msg
          : `Error ${res.status}`
      throw new Error(errText)
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : t('contact.errorFallback'),
      )
    }
  }

  return (
    <div className="w-full pb-14 pt-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">
      <div className="mb-12 text-center lg:mb-0 lg:text-left">
        <h1 className="font-display mb-4 text-3xl tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          {t('contact.title')}
        </h1>
        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base lg:mx-0">
          {t('contact.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm lg:justify-start lg:gap-8">
          <a
            href="mailto:hola@gloomi.local"
            className="flex items-center gap-2 text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            <Mail className="h-4 w-4" aria-hidden /> hola@gloomi.local
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            <Camera className="h-4 w-4" aria-hidden /> @gloomi
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-md space-y-4 text-left lg:mx-0"
          noValidate
        >
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              {t('contact.nameLabel')}{' '}
              <span className="text-zinc-500">{t('contact.optional')}</span>
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className={inputClass}
              placeholder={t('contact.namePh')}
              maxLength={120}
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              {t('contact.emailLabel')}
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={inputClass}
              placeholder={t('contact.emailPh')}
            />
          </div>
          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              {t('contact.subjectLabel')}{' '}
              <span className="text-zinc-500">{t('contact.optional')}</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(ev) => setSubject(ev.target.value)}
              className={inputClass}
              placeholder={t('contact.subjectPh')}
              maxLength={200}
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              {t('contact.messageLabel')}
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
              className={inputClass}
              placeholder={t('contact.messagePh')}
              minLength={10}
              maxLength={5000}
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
              {t('contact.success')}
            </p>
          )}
          {status === 'error' && errorMessage && (
            <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
              {errorMessage}
            </p>
          )}

          <Button type="submit" variant="cta" disabled={status === 'loading'} className="max-w-xs">
            {status === 'loading' ? t('contact.sending') : t('contact.submit')}
          </Button>
        </form>
      </div>
      <section className="rounded-3xl border border-zinc-200 bg-white/70 px-5 py-7 text-left dark:border-zinc-800 dark:bg-zinc-950/70 sm:px-8">
        <h2 className="font-display mb-4 text-center text-lg tracking-wide text-zinc-900 dark:text-zinc-200 sm:text-xl lg:text-left">
          {t('contact.testimonials')}
        </h2>
        <blockquote className="border-l-2 border-zinc-400 pl-4 text-sm italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400 sm:text-base">
          {t('contact.quote')}
          <footer className="mt-3 not-italic text-xs text-zinc-500">
            {t('contact.quoteFooter')}
          </footer>
        </blockquote>
      </section>
    </div>
  )
}
