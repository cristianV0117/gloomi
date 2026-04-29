import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { error: Error | null; info: ErrorInfo | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
    this.setState({ info })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh bg-zinc-950 px-6 py-10 font-sans text-zinc-100">
          <h1 className="font-display mb-4 text-xl tracking-wide">
            Error al cargar la vista
          </h1>
          <p className="mb-4 max-w-prose text-sm text-zinc-400">
            Revisa la consola del navegador (F12). Si usas un túnel (loca.lt), ejecuta{' '}
            <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs text-zinc-300">
              npm run dev:tunnel
            </code>{' '}
            y reinicia el túnel.
          </p>
          <pre className="max-h-[45vh] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-black/60 p-4 text-xs text-red-300">
            {this.state.error.stack}
            {this.state.info?.componentStack ? `\n${this.state.info.componentStack}` : ''}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
