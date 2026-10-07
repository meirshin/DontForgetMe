import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from GitHub Pages at https://ym987.github.io/DontForgetMe/
export default defineConfig({
  base: '/DontForgetMe/',
  plugins: [react()],
});
