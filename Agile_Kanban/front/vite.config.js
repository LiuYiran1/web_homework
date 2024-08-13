import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 设置前端端口为 3000
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5173', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 将路径中的 /api 替换为空
      },
    },
  },
});
