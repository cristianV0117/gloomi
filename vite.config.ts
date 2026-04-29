import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Ejecutar con `TUNNEL=1 npm run dev` o `npm run dev:tunnel` al usar Localtunnel/ngrok */
const tunnel = process.env.TUNNEL === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true,
    ...(tunnel && {
      // HTTPS público → el cliente HMR debe usar wss en el puerto del navegador (443)
      hmr: {
        protocol: 'wss',
        clientPort: 443,
      },
    }),
  },
})
