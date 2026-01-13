
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            "@apollo/client": "@apollo/client/core",
        },
    },
});
