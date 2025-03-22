import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
        svgr({
            svgrOptions: {
                icon: true,
                // This will transform your SVG to a React component
                exportType: "named",
                namedExport: "ReactComponent",
            },
        }),
    ],
});
