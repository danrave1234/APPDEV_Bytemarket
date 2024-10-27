import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'C:/Users/Danrave/Desktop/School/APPDEV_Final Project/byte-market-api/BackEnd/src/main/resources/static',
    // Set the output directory to the Spring Boot static folder
    emptyOutDir: true,
  }
})
