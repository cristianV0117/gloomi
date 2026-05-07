import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-2 sm:px-6 lg:px-8 lg:pb-32 xl:max-w-[90rem] xl:px-10">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-7xl border-t border-[rgb(201_38_74_/0.18)] bg-gradient-to-t from-[rgb(120_18_38_/0.08)] to-transparent px-4 py-8 text-center text-xs text-zinc-500 sm:px-6 lg:px-8 xl:max-w-[90rem] xl:px-10">
        Gloomi — creepy-cute, sostenible, tuyo.
      </footer>
    </div>
  )
}
