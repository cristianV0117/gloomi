import { Camera, Mail } from 'lucide-react'

export function Contact() {
  return (
    <div className="w-full pb-14 pt-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">
      <div className="mb-12 text-center lg:mb-0 lg:text-left">
        <h1 className="font-display mb-4 text-3xl tracking-wide sm:text-4xl">Contacto</h1>
        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base lg:mx-0">
          Pedidos especiales, prensa o colaboraciones — escribenos. Respondemos cuando la luna esté
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
