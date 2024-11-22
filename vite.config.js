import { fileURLToPath, URL } from 'node:url'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    return {
      plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      VueDevTools(),
      quasar({
        sassVariables: 'src/WebApp/assets/quasar-variables.sass'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/WebApp', import.meta.url))
      }
    },

    build: {
      outDir: "public",
      sourceMap: mode ==='dev',
      minify: mode !== 'dev'
    }
  }
})
