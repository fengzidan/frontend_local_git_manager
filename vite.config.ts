import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import topLevelAwait from "vite-plugin-top-level-await";
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

function resolve(dir) {
  return join(__dirname, "./", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve("src/components/icon/svg/")],
      // 指定symbolId格式
      symbolId: "icon-[name]",
    }),

    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
    legacy({
      polyfills: ['es.promise.finally', 'es/map', 'es/set'],
      modernPolyfills: ['es.promise.finally']
    }),
    // element-plus自动引入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: process.env.NODE_ENV === "production" ? "/remote-manager" : "./",
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  server: {
    port: 4004,
    proxy: {
      "/remote": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
});