import { Camera, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { getApiBaseUrl } from '../lib/api'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
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
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo enviar.')
    }
  }

  return (
    <div className="w-full pb-14 pt-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">
      <div className="mb-12 text-center lg:mb-0 lg:text-left">
        <h1 className="font-display mb-4 text-3xl tracking-wide sm:text-4xl">Contacto</h1>
        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base lg:mx-0">
          Pedidos especiales, prensa o colaboraciones — escríbenos. Respondemos cuando la luna esté
          del lado correcto del cielo.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm lg:justify-start lg:gap-8">
          <a
            href="mailto:hola@gloomi.local"
            className="flex items-center gap-2 text-zinc-200 underline-offset-4 hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden /> hola@gloomi.local
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-zinc-200 underline-offset-4 hover:underline"
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
            <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Nombre <span className="text-zinc-600">(opcional)</span>
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
              placeholder="Cómo te llamamos"
              maxLength={120}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Correo
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Asunto <span className="text-zinc-600">(opcional)</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(ev) => setSubject(ev.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
              placeholder="Pedido especial, prensa…"
              maxLength={200}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Mensaje
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
              className="w-full resize-y rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
              placeholder="Cuéntanos qué necesitas (mínimo 10 caracteres)"
              minLength={10}
              maxLength={5000}
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-emerald-400" role="status">
              Mensaje enviado. Te responderemos pronto.
            </p>
          )}
          {status === 'error' && errorMessage && (
            <p className="text-sm text-rose-400" role="alert">
              {errorMessage}
            </p>
          )}

          <Button type="submit" variant="cta" disabled={status === 'loading'} className="max-w-xs">
            {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
          </Button>
        </form>
      </div>
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 px-5 py-7 text-left sm:px-8">
        <h2 className="font-display mb-4 text-center text-lg tracking-wide text-zinc-200 sm:text-xl lg:text-left">
          Testimonios
        </h2>
        <blockquote className="border-l-2 border-zinc-600 pl-4 text-sm italic text-zinc-400 sm:text-base">
          «Mi Grimm llegó mejor abrazado que empaquetado. Ya no duermo solo.»
          <footer className="mt-3 not-italic text-xs text-zinc-500">
            — Valentina, Buenos Aires
          </footer>
        </blockquote>
      </section>
    </div>
  )
}
