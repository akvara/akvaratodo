import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the desired port
    host: true, // Enable access over the network
  },
  build: {
    outDir: 'build', // Specify the output directory as 'build'
    emptyOutDir: true, // Ensures the folder is emptied before building
  },
})
