import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

function resolve(dir) {
  return join(__dirname, "./", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve("src/plugins/icon/svg/")],
      // 指定symbolId格式
      symbolId: "icon-[name]",
    }),
  ],
  base: "./",
  server: {
    port: 4004,
    proxy: {
      "/api": {
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
