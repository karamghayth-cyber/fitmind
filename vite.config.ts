import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'FitMind — AI Dietitian & Coach',
        short_name: 'FitMind',
        description: 'Your AI-powered dietitian and fitness coach for the UAE',
        theme_color: '#52a07c',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/app/dashboard',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } },
          },
        ],
      },
    }),
  ],
})
