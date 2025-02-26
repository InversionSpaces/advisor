import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        assetsDir: 'assets',
        assetsInlineLimit: 0,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
}); 