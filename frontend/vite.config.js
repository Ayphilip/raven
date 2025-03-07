import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import react from "@vitejs/plugin-react";
// import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  nodePolyfills({
    // Whether to polyfill `global`, `process`, and `Buffer`.
    // By default, all are true.
    protocolImports: true,
  }),
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:4000',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
