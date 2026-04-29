import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display mb-4 text-5xl tracking-widest text-zinc-600">404</p>
      <h1 className="mb-4 text-xl text-zinc-200">Aquí solo hay niebla.</h1>
      <p className="mb-8 max-w-[22ch] text-sm text-zinc-500">
        Esta ruta no existe. Vuelve al inicio o a la tienda.
      </p>
      <Link
        to="/"
        className="inline-flex w-full max-w-xs items-center justify-center rounded-2xl bg-zinc-100 px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
      >
        Volver al inicio
      </Link>
      <Link
        to="/tienda"
        className="mt-4 block text-sm font-medium text-zinc-500 hover:text-zinc-200"
      >
        Ir a la tienda
      </Link>
    </div>
  )
}
