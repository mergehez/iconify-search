import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'

export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        port: 1584,
        open: true,
    },
})